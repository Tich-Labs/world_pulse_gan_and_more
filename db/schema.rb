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

ActiveRecord::Schema[8.1].define(version: 2026_02_17_152801) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "accounts", force: :cascade do |t|
    t.text "config_json"
    t.datetime "created_at", null: false
    t.string "name"
    t.string "plan"
    t.string "slug"
    t.datetime "updated_at", null: false
  end

  create_table "match_types", force: :cascade do |t|
    t.bigint "account_id", null: false
    t.datetime "created_at", null: false
    t.text "description"
    t.string "name"
    t.string "name_a"
    t.string "name_b"
    t.datetime "updated_at", null: false
    t.index ["account_id"], name: "index_match_types_on_account_id"
  end

  create_table "matches", force: :cascade do |t|
    t.bigint "account_id", null: false
    t.datetime "created_at", null: false
    t.bigint "match_type_id", null: false
    t.integer "score"
    t.string "status"
    t.datetime "updated_at", null: false
    t.bigint "user_a_id", null: false
    t.bigint "user_b_id", null: false
    t.index ["account_id"], name: "index_matches_on_account_id"
    t.index ["match_type_id"], name: "index_matches_on_match_type_id"
    t.index ["user_a_id"], name: "index_matches_on_user_a_id"
    t.index ["user_b_id"], name: "index_matches_on_user_b_id"
  end

  create_table "messages", force: :cascade do |t|
    t.text "content"
    t.datetime "created_at", null: false
    t.integer "project_id"
    t.integer "receiver_id"
    t.integer "sender_id"
    t.datetime "updated_at", null: false
  end

  create_table "profile_fields", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "field_type"
    t.bigint "match_type_id", null: false
    t.string "name"
    t.text "options_json"
    t.integer "order"
    t.boolean "required"
    t.string "side"
    t.datetime "updated_at", null: false
    t.index ["match_type_id"], name: "index_profile_fields_on_match_type_id"
  end

  create_table "profiles", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.text "data_json"
    t.bigint "match_type_id", null: false
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.index ["match_type_id"], name: "index_profiles_on_match_type_id"
    t.index ["user_id"], name: "index_profiles_on_user_id"
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
    t.bigint "account_id"
    t.text "bio"
    t.datetime "created_at", null: false
    t.string "email"
    t.text "expertise"
    t.boolean "is_advisor"
    t.string "location"
    t.bigint "match_type_id"
    t.string "name"
    t.string "password_digest"
    t.string "role"
    t.string "side"
    t.datetime "updated_at", null: false
    t.index ["account_id"], name: "index_users_on_account_id"
    t.index ["match_type_id"], name: "index_users_on_match_type_id"
  end

  add_foreign_key "match_types", "accounts"
  add_foreign_key "matches", "accounts"
  add_foreign_key "matches", "match_types"
  add_foreign_key "matches", "users", column: "user_a_id"
  add_foreign_key "matches", "users", column: "user_b_id"
  add_foreign_key "profile_fields", "match_types"
  add_foreign_key "profiles", "match_types"
  add_foreign_key "profiles", "users"
  add_foreign_key "users", "accounts"
  add_foreign_key "users", "match_types"
end
