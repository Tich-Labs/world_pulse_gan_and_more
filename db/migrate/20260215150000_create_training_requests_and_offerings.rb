class CreateTrainingRequestsAndOfferings < ActiveRecord::Migration[8.1]
  def change
    create_table :training_requests do |t|
      t.string :topic
      t.text :description
      t.string :status, default: "pending"

      t.timestamps
    end

    create_table :training_offerings do |t|
      t.string :topic
      t.text :description
      t.string :availability

      t.timestamps
    end
  end
end
