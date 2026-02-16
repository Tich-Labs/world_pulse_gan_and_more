class RoadmapIdea < ApplicationRecord
  validates :name, :submitter, :idea_type, :user_story, presence: true

  scope :ordered_by_votes, -> { order(votes: :desc) }
end
