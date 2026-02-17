class CreateProfileFields < ActiveRecord::Migration[8.1]
  def change
    create_table :profile_fields do |t|
      t.references :match_type, null: false, foreign_key: true
      t.string :side
      t.string :name
      t.string :field_type
      t.text :options_json
      t.boolean :required
      t.integer :order

      t.timestamps
    end
  end
end
