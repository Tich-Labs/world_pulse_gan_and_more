require "csv"

class AdminController < ApplicationController
  layout "admin"

  include Pagy::Backend

  def index
    @user_count = User.count
    @project_count = Project.count
    @story_count = Story.count
    @message_count = Message.count
    @roadmap_idea_count = RoadmapIdea.count
    @training_request_count = TrainingRequest.count
    @training_offering_count = TrainingOffering.count
  end

  def users
    scope = User.all.order(created_at: :desc)
    scope = apply_search(scope, %w[email name])
    per_page = (params[:per_page] || 25).to_i
    @pagy, @users = pagy(scope, items: per_page)
    render "users"
  end

  def projects
    scope = Project.all.order(created_at: :desc)
    scope = apply_search(scope, %w[name description])
    per_page = (params[:per_page] || 25).to_i
    @pagy, @projects = pagy(scope, items: per_page)
    render "projects"
  end

  def stories
    scope = Story.all.order(created_at: :desc)
    scope = apply_search(scope, %w[title content author])
    per_page = (params[:per_page] || 25).to_i
    @pagy, @stories = pagy(scope, items: per_page)
    render "stories"
  end

  def messages
    scope = Message.all.order(created_at: :desc)
    if params[:q].present? && params[:q] =~ /^\d+$/
      # allow searching by sender/receiver id
      id = params[:q].to_i
      scope = scope.where("sender_id = ? OR receiver_id = ?", id, id)
    else
      scope = apply_search(scope, %w[content])
    end
    per_page = (params[:per_page] || 25).to_i
    @pagy, @messages = pagy(scope, items: per_page)
    render "messages"
  end

  def roadmap_ideas
    scope = RoadmapIdea.all.order(created_at: :desc)
    scope = apply_search(scope, %w[name user_story idea_type submitter])
    scope = scope.where(idea_type: params[:idea_type]) if params[:idea_type].present?
    per_page = (params[:per_page] || 25).to_i
    @pagy, @roadmap_ideas = pagy(scope, items: per_page)
    render "roadmap_ideas"
  end

  def training_requests
    scope = TrainingRequest.all.order(created_at: :desc)
    scope = apply_search(scope, %w[topic description status])
    scope = scope.where(status: params[:status]) if params[:status].present?
    per_page = (params[:per_page] || 25).to_i
    @pagy, @training_requests = pagy(scope, items: per_page)
    render "training_requests"
  end

  def training_offerings
    scope = TrainingOffering.all.order(created_at: :desc)
    scope = apply_search(scope, %w[topic description availability])
    scope = scope.where(topic: params[:topic]) if params[:topic].present?
    per_page = (params[:per_page] || 25).to_i
    @pagy, @training_offerings = pagy(scope, items: per_page)
    render "training_offerings"
  end

  private

  def apply_search(scope, fields)
    return scope unless params[:q].present?
    term = "%#{params[:q].to_s.strip}%"
    sql = fields.map do |f|
      if f =~ /_id$/
        "CAST(#{f} AS text) ILIKE :term"
      else
        "#{f} ILIKE :term"
      end
    end.join(" OR ")
    scope.where(sql, term: term)
  end

  def import_stories
    if request.post?
      file = params[:csv_file]
      if file.present?
        imported = 0
        skipped = []
        ::CSV.foreach(file.path, headers: true) do |row|
          title = (row["title"] || row["name"] || row["headline"] || row["Title"]).to_s.strip
          content = (row["content"] || row["body"] || row["description"] || row["Content"]).to_s.strip
          author = (row["author"] || row["submitter"] || "Anonymous").to_s.strip

          if title.present? && content.present?
            story = Story.new(title: title, content: content, author: author)
            if story.save
              imported += 1
            else
              skipped << { row: row.to_h, errors: story.errors.full_messages }
            end
          else
            skipped << { row: row.to_h, errors: [ "missing title or content" ] }
          end
        end
        notice = "Imported #{imported} stories"
        notice += ", skipped #{skipped.size}" if skipped.any?
        redirect_to admin_stories_path, notice: notice
      else
        redirect_to admin_stories_path, alert: "Please select a CSV file"
      end
    end
  end

  def import_roadmap_ideas
    if request.post?
      file = params[:csv_file]
      if file.present?
        imported = 0
        skipped = []
        ::CSV.foreach(file.path, headers: true) do |row|
          name = (row["name"] || row["title"]).to_s.strip
          user_story = (row["user_story"] || row["description"] || row["user story"]).to_s.strip
          idea_type = (row["idea_type"] || row["category"] || "general").to_s.strip
          submitter = (row["submitter"] || row["author"] || "import").to_s.strip

          if name.present? && user_story.present?
            idea = RoadmapIdea.new(name: name, user_story: user_story, idea_type: idea_type.presence || "general", submitter: submitter)
            if idea.save
              imported += 1
            else
              skipped << { row: row.to_h, errors: idea.errors.full_messages }
            end
          else
            skipped << { row: row.to_h, errors: [ "missing name or user_story/description" ] }
          end
        end
        notice = "Imported #{imported} roadmap ideas"
        notice += ", skipped #{skipped.size}" if skipped.any?
        redirect_to admin_roadmap_ideas_path, notice: notice
      else
        redirect_to admin_roadmap_ideas_path, alert: "Please select a CSV file"
      end
    end
  end
end
