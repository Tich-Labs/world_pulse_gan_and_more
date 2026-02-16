class PagesController < ApplicationController
  def index
  end

  def roadmap
  end

  def community_hub
  end

  def matchmaking
    @projects = Project.order(created_at: :desc).limit(10)
    @logged_in = current_user.present?
  end

  def messaging
  end

  def documentation
  end

  def before_profile
  end

  def awards
  end

  def after_profile
  end

  def training
  end

  def profile
  end
end
