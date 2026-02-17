class Match < ApplicationRecord
  belongs_to :account
  belongs_to :match_type
  belongs_to :user_a, class_name: "User"
  belongs_to :user_b, class_name: "User"

  STATUS_SUGGESTED = "suggested"
  STATUS_PENDING = "pending"
  STATUS_ACCEPTED = "accepted"
  STATUS_REJECTED = "rejected"

  validates :user_a_id, uniqueness: { scope: [ :user_b_id, :match_type_id ] }

  def other_user(current_user)
    (current_user.id == user_a_id) ? user_b : user_a
  end

  def self.opposite_side(side)
    (side == "a") ? "b" : "a"
  end

  def self.suggested_for(user)
    return [] unless user.match_type && user.side

    opposite = opposite_side(user.side)

    Profile.where(match_type: user.match_type)
      .where.not(user_id: user.id)
      .joins(:user)
      .where(users: { side: opposite, account_id: user.account_id })
      .includes(:user)
  end
end
