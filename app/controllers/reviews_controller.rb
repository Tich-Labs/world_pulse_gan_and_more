class ReviewsController < ApplicationController
  before_action :authenticate_user

  def create
    @review = Review.new(review_params)
    @review.reviewer = current_user

    if @review.save
      redirect_to :back, notice: "Review submitted successfully!"
    else
      redirect_to :back, alert: @review.errors.full_messages.join(", ")
    end
  end

  def show
    @user = User.find(params[:id])
    @reviews = @user.reviews.includes(:reviewer, :match)
  end

  private

  def review_params
    params.require(:review).permit(:match_id, :user_id, :rating, :comment)
  end
end
