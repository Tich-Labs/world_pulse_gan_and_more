class User < ApplicationRecord
  has_secure_password

  belongs_to :account, optional: true
  belongs_to :match_type, optional: true
  has_one :profile, dependent: destroy

  validates :name, presence: true
  validates :email, presence: true, uniqueness: true
  validates :password, presence: true, if: :new_record?

  validates :side, inclusion: { in: %w[a b], allow_blank: true }

  def profile_for(match_type)
    Profile.find_by(user: self, match_type: match_type)
  end

  def side_label(match_type)
    return nil unless side.present?
    (side == "a") ? match_type.name_a : match_type.name_b
  end
end
