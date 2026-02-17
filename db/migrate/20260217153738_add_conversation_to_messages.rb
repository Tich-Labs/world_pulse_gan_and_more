class AddConversationToMessages < ActiveRecord::Migration[8.1]
  def change
    add_reference :messages, :conversation, foreign_key: true
    add_column :messages, :read_at, :datetime
  end
end
