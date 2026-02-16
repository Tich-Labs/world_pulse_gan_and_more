class CreateProjects < ActiveRecord::Migration[8.1]
  def change
    create_table :projects do |t|
      t.string :name
      t.string :location
      t.text :description
      t.text :accomplishment_goal
      t.text :why_matters
      t.text :attempts_so_far
      t.text :what_worked
      t.text :support_types
      t.text :ideal_outcome
      t.date :timeline
      t.string :team_composition

      t.timestamps
    end
  end
end
