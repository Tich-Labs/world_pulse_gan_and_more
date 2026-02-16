class StoriesController < ApplicationController
  def index
    @stories = Story.ordered_by_votes
    render json: @stories
  end

  def vote
    story = Story.find_by(id: params[:id])

    if story
      story.increment!(:votes)
      render json: { success: true, votes: story.votes }
    else
      render json: { success: false, error: "Story not found" }, status: :not_found
    end
  end
end
