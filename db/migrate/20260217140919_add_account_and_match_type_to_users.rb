class AddAccountAndMatchTypeToUsers < ActiveRecord::Migration[8.1]
  def change
    add_reference :users, :account, foreign_key: true
    add_reference :users, :match_type, foreign_key: true
    add_column :users, :side, :string
    add_column :users, :role, :string
  end
end
