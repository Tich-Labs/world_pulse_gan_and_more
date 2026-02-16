class CreateRoadmapIdeas < ActiveRecord::Migration[8.1]
  def change
    create_table :roadmap_ideas do |t|
      t.string :name
      t.string :submitter
      t.string :idea_type
      t.text :user_story
      t.integer :votes, default: 0

      t.timestamps
    end
  end
end
