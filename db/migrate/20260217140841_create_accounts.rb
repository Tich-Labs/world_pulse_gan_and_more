class CreateAccounts < ActiveRecord::Migration[8.1]
  def change
    create_table :accounts do |t|
      t.string :name
      t.string :slug
      t.string :plan
      t.text :config_json

      t.timestamps
    end
  end
end
