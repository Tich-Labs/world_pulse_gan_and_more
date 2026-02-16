class AddIndexesToRoadmapIdeas < ActiveRecord::Migration[8.1]
  def change
    add_index :roadmap_ideas, :votes
    add_index :roadmap_ideas, :idea_type
  end
end
