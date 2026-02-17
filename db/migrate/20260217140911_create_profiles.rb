class CreateProfiles < ActiveRecord::Migration[8.1]
  def change
    create_table :profiles do |t|
      t.references :user, null: false, foreign_key: true
      t.references :match_type, null: false, foreign_key: true
      t.text :data_json

      t.timestamps
    end
  end
end
