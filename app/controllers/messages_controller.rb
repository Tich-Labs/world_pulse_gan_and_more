class MessagesController < ApplicationController
  skip_before_action :verify_authenticity_token, only: [ :create ]
  before_action :authenticate_user

  def create
    project = Project.find_by(id: params[:message][:project_id])
    return render json: { success: false, error: "Project not found" } unless project

    @message = Message.new(
      sender_id: current_user.id,
      project_id: project.id,
      content: params[:message][:content]
    )

    if @message.save
      render json: { success: true }
    else
      render json: { success: false, error: @message.errors.full_messages.join(", ") }
    end
  end

  def index
    @messages = Message.where("sender_id = ? OR receiver_id = ?", current_user.id, current_user.id).order(created_at: :desc)
  end
end
