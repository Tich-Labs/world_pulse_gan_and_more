class TrainingRequest < ApplicationRecord
  validates :topic, :description, presence: true
end
