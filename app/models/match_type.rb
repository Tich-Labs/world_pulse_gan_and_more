class MatchType < ApplicationRecord
  belongs_to :account
  has_many :profile_fields, dependent: :destroy
  has_many :users
  has_many :profiles, dependent: :destroy

  validates :name, presence: true
  validates :name_a, presence: true
  validates :name_b, presence: true

  def fields_for_side(side)
    profile_fields.where(side: side).order(:order)
  end
end
