class User < ApplicationRecord
  has_secure_password

  belongs_to :account, optional: true
  belongs_to :match_type, optional: true
  has_one :profile, dependent: :destroy
  has_many :reviews_received, class_name: "Review", foreign_key: :user_id

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

  def average_rating
    return 0 unless reviews_received.any?
    reviews_received.average(:rating).round(1)
  end

  def total_reviews
    reviews_received.count
  end
end
