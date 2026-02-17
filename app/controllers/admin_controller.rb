class AdminController < ApplicationController
  layout "admin"

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
    @users = User.all.order(created_at: :desc)
  end

  def projects
    @projects = Project.all.order(created_at: :desc)
  end

  def stories
    @stories = Story.all.order(created_at: :desc)
  end

  def messages
    @messages = Message.all.order(created_at: :desc)
  end

  def roadmap_ideas
    @roadmap_ideas = RoadmapIdea.all.order(created_at: :desc)
  end

  def training_requests
    @training_requests = TrainingRequest.all.order(created_at: :desc)
  end

  def training_offerings
    @training_offerings = TrainingOffering.all.order(created_at: :desc)
  end

  def import_roadmap_ideas
    if request.post?
      file = params[:csv_file]
      if file.present?
        CSV.foreach(file.path, headers: true) do |row|
          RoadmapIdea.create!(
            title: row["title"],
            description: row["description"],
            category: row["category"] || "general"
          )
        end
        redirect_to admin_roadmap_ideas_path, notice: "Successfully imported roadmap ideas!"
      else
        redirect_to admin_roadmap_ideas_path, alert: "Please select a CSV file"
      end
    end
  end

  def import_stories
    if request.post?
      file = params[:csv_file]
      if file.present?
        CSV.foreach(file.path, headers: true) do |row|
          Story.create!(
            title: row["title"],
            content: row["content"],
            author: row["author"] || "Anonymous"
          )
        end
        redirect_to admin_stories_path, notice: "Successfully imported stories!"
      else
        redirect_to admin_stories_path, alert: "Please select a CSV file"
      end
    end
  end
end
