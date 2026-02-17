class Conversation < ApplicationRecord
  belongs_to :account
  belongs_to :match
  has_many :messages, dependent: :destroy

  def other_participant(current_user)
    (match.user_a_id == current_user.id) ? match.user_b : match.user_a
  end

  def unread_count_for(user)
    messages.where.not(sender_id: user.id).where(read_at: nil).count
  end
end
