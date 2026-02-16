class AddVotesToTrainingTables < ActiveRecord::Migration[8.1]
  def change
    add_column :training_requests, :votes, :integer, default: 0
    add_column :training_offerings, :votes, :integer, default: 0
  end
end
