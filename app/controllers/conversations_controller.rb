class ConversationsController < ApplicationController
  before_action :authenticate_user

  def index
    @conversations = Conversation.where(account: current_user.account)
      .joins(:match)
      .where(matches: { user_a_id: current_user.id })
      .or(Conversation.where(account: current_user.account).joins(:match).where(matches: { user_b_id: current_user.id }))
      .order(updated_at: :desc)
      .includes(:messages, match: [ :user_a, :user_b ])
  end

  def show
    @conversation = Conversation.find(params[:id])
    unless @conversation.match.user_ids.include?(current_user.id)
      redirect_to conversations_path, alert: "Access denied"
      return
    end

    @conversation.messages.where.not(sender_id: current_user.id).where(read_at: nil).update_all(read_at: Time.current)
    @other_user = @conversation.other_participant(current_user)
  end

  def create
    match = Match.find(params[:conversation][:match_id])

    existing = Conversation.find_by(match: match)
    if existing
      redirect_to conversation_path(existing)
      return
    end

    conversation = Conversation.create!(
      account: current_user.account,
      match: match
    )

    redirect_to conversation_path(conversation)
  end
end
