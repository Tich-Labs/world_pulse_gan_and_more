class Profile < ApplicationRecord
  belongs_to :user
  belongs_to :match_type

  validates :user_id, uniqueness: { scope: :match_type_id }

  def data
    return {} unless data_json.present?
    JSON.parse(data_json).with_indifferent_access
  end

  def data=(hash)
    self.data_json = hash.to_json
  end

  def get(field_name)
    data[field_name]
  end

  def set(field_name, value)
    current = data
    current[field_name] = value
    self.data = current
  end
end
