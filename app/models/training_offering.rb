class TrainingOffering < ApplicationRecord
  validates :topic, :description, :availability, presence: true
end
