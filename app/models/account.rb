class Account < ApplicationRecord
  has_many :users
  has_many :match_types, dependent: :destroy

  validates :name, presence: true
  validates :slug, presence: true, uniqueness: true

  before_validation :generate_slug, if: -> { slug.blank? }

  def generate_slug
    self.slug = name.parameterize
  end
end
