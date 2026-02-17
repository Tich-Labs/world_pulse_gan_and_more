class Message < ApplicationRecord
  belongs_to :conversation, optional: true
  belongs_to :sender, class_name: "User"

  validates :content, presence: true

  after_create_commit { broadcast_append_to "conversations" }
end
