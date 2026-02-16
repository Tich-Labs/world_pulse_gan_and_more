class TrainingController < ApplicationController
  skip_before_action :verify_authenticity_token, only: [ :create_request, :create_offering, :vote_request ]

  def index
    @requests = TrainingRequest.order(created_at: :desc)
    @offerings = TrainingOffering.order(created_at: :desc)
    render json: { requests: @requests, offerings: @offerings }
  end

  def create_request
    @request = TrainingRequest.new(request_params)

    if @request.save
      render json: { success: true, request: @request }
    else
      render json: { success: false, errors: @request.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def create_offering
    @offering = TrainingOffering.new(offering_params)

    if @offering.save
      render json: { success: true, offering: @offering }
    else
      render json: { success: false, errors: @offering.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def vote_request
    @request = TrainingRequest.find_by(id: params[:id])

    if @request
      @request.increment!(:votes)
      render json: { success: true, votes: @request.votes }
    else
      render json: { success: false, error: "Request not found" }, status: :not_found
    end
  end

  private

  def request_params
    params.require(:training_request).permit(:topic, :description)
  end

  def offering_params
    params.require(:training_offering).permit(:topic, :description, :availability)
  end
end
