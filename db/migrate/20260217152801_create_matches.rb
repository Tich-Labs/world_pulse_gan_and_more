class CreateMatches < ActiveRecord::Migration[8.1]
  def change
    create_table :matches do |t|
      t.references :account, null: false, foreign_key: true
      t.references :match_type, null: false, foreign_key: true
      t.references :user_a, null: false, foreign_key: { to_table: :users }
      t.references :user_b, null: false, foreign_key: { to_table: :users }
      t.integer :score
      t.string :status

      t.timestamps
    end
  end
end
