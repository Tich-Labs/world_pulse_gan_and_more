# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_02_15_160001) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "messages", force: :cascade do |t|
    t.text "content"
    t.datetime "created_at", null: false
    t.integer "project_id"
    t.integer "receiver_id"
    t.integer "sender_id"
    t.datetime "updated_at", null: false
  end

  create_table "projects", force: :cascade do |t|
    t.text "accomplishment_goal"
    t.text "attempts_so_far"
    t.datetime "created_at", null: false
    t.text "description"
    t.text "ideal_outcome"
    t.string "location"
    t.string "name"
    t.text "support_types"
    t.string "team_composition"
    t.date "timeline"
    t.datetime "updated_at", null: false
    t.integer "votes"
    t.text "what_worked"
    t.text "why_matters"
  end

  create_table "roadmap_ideas", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "idea_type"
    t.string "name"
    t.string "submitter"
    t.datetime "updated_at", null: false
    t.text "user_story"
    t.integer "votes", default: 0
    t.index ["idea_type"], name: "index_roadmap_ideas_on_idea_type"
    t.index ["votes"], name: "index_roadmap_ideas_on_votes"
  end

  create_table "stories", force: :cascade do |t|
    t.string "author"
    t.text "content"
    t.datetime "created_at", null: false
    t.string "tags", default: [], array: true
    t.string "title"
    t.datetime "updated_at", null: false
    t.string "url"
    t.integer "votes", default: 0
    t.index ["tags"], name: "index_stories_on_tags", using: :gin
    t.index ["votes"], name: "index_stories_on_votes"
  end

  create_table "training_offerings", force: :cascade do |t|
    t.string "availability"
    t.datetime "created_at", null: false
    t.text "description"
    t.string "topic"
    t.datetime "updated_at", null: false
    t.integer "votes", default: 0
  end

  create_table "training_requests", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.text "description"
    t.string "status", default: "pending"
    t.string "topic"
    t.datetime "updated_at", null: false
    t.integer "votes", default: 0
  end

  create_table "users", force: :cascade do |t|
    t.text "bio"
    t.datetime "created_at", null: false
    t.string "email"
    t.text "expertise"
    t.boolean "is_advisor"
    t.string "location"
    t.string "name"
    t.string "password_digest"
    t.datetime "updated_at", null: false
  end
end
