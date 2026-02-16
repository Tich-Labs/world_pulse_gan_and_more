class Story < ApplicationRecord
  validates :title, :author, :content, presence: true

  scope :ordered_by_votes, -> { order(votes: :desc) }
end
