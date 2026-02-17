class CreateMatchTypes < ActiveRecord::Migration[8.1]
  def change
    create_table :match_types do |t|
      t.references :account, null: false, foreign_key: true
      t.string :name
      t.string :name_a
      t.string :name_b
      t.text :description

      t.timestamps
    end
  end
end
