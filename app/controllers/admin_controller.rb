class AdminController < ApplicationController
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
end
