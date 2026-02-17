class ProfileField < ApplicationRecord
  belongs_to :match_type

  validates :name, presence: true
  validates :side, presence: true, inclusion: { in: %w[a b] }
  validates :field_type, presence: true, inclusion: { in: %w[text number select multiselect textarea boolean] }

  def options
    return [] unless options_json.present?
    JSON.parse(options_json)
  end
end
