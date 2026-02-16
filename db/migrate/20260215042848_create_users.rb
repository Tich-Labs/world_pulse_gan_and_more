class CreateUsers < ActiveRecord::Migration[8.1]
  def change
    create_table :users do |t|
      t.string :name
      t.string :email
      t.string :password_digest
      t.text :bio
      t.string :location
      t.text :expertise
      t.boolean :is_advisor

      t.timestamps
    end
  end
end
