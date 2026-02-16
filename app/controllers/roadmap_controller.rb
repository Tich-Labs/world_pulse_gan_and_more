class RoadmapController < ApplicationController
  def index
    @ideas = RoadmapIdea.ordered_by_votes
    render json: @ideas
  end

  def vote
    idea = RoadmapIdea.find_by(id: params[:id])

    if idea
      idea.increment!(:votes)
      render json: { success: true, votes: idea.votes }
    else
      render json: { success: false, error: "Idea not found" }, status: :not_found
    end
  end
end
