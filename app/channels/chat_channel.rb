class ChatChannel < ApplicationCable::Channel
  def subscribed
    conversation = Conversation.find(params[:conversation_id])
    if current_user && conversation.match.user_ids.include?(current_user.id)
      stream_from "conversation_#{conversation.id}"
    end
  end

  def unsubscribed
    stop_all_streams
  end

  def send_message(data)
    conversation = Conversation.find(data["conversation_id"])
    message = conversation.messages.create!(
      sender: current_user,
      content: data["content"]
    )

    ActionCable.server.broadcast(
      "conversation_#{conversation.id}",
      message: render_message(message),
      conversation_id: conversation.id
    )
  end

  private

  def render_message(message)
    ApplicationController.render(
      partial: "messages/message",
      locals: { message: message }
    )
  end
end
