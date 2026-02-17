class MessagesController < ApplicationController
  skip_before_action :verify_authenticity_token, only: [ :create ]
  before_action :authenticate_user

  def create
    if params[:message][:conversation_id]
      conversation = Conversation.find(params[:message][:conversation_id])
      unless conversation.match.user_ids.include?(current_user.id)
        return render json: { success: false, error: "Access denied" }, status: :forbidden
      end

      @message = conversation.messages.create!(
        sender: current_user,
        content: params[:message][:content]
      )

      if @message
        render json: { success: true, message: { id: @message.id, content: @message.content, created_at: @message.created_at } }
      else
        render json: { success: false, error: @message.errors.full_messages.join(", ") }
      end
    else
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
  end

  def index
    @messages = Message.where("sender_id = ? OR receiver_id = ?", current_user.id, current_user.id).order(created_at: :desc)
  end
end
