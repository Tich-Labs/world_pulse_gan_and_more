class Review < ApplicationRecord
  belongs_to :match
  belongs_to :reviewer, class_name: "User"
  belongs_to :user

  validates :rating, presence: true, inclusion: { in: 1..5 }
  validates :reviewer_id, uniqueness: { scope: :match_id, message: "You have already reviewed this match" }

  validate :cannot_review_self

  private

  def cannot_review_self
    if reviewer_id == user_id
      errors.add(:base, "You cannot review yourself")
    end
  end
end
