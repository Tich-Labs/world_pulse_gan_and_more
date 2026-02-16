class CreateStories < ActiveRecord::Migration[8.1]
  def change
    create_table :stories do |t|
      t.string :title
      t.string :author
      t.text :content
      t.integer :votes, default: 0
      t.string :url
      t.string :tags, array: true, default: []

      t.timestamps
    end
    add_index :stories, :votes
    add_index :stories, :tags, using: "gin"
  end
end
