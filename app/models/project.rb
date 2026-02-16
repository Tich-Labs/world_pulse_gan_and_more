class Project < ApplicationRecord
  validates :name, :location, :description, presence: true

  def support_types_array
    support_types.to_s.split(", ").map(&:strip).reject(&:empty?)
  end
end
