class DiscoveryController < ApplicationController
  before_action :authenticate_user
  before_action :require_match_type

  def index
    @match_type = current_user.match_type
    @search_fields = @match_type.fields_for_side(Match.opposite_side(current_user.side))
    @current_filters = params[:filters] || {}

    @matches = potential_matches
    apply_filters!
    apply_search!
    @matches = @matches.page(params[:page]).per(12)
  end

  def search
    @match_type = current_user.match_type
    @search_fields = @match_type.fields_for_side(Match.opposite_side(current_user.side))
    @matches = potential_matches

    apply_filters!
    apply_search!

    render partial: "match_cards", locals: { matches: @matches }
  end

  def connect
    target_user = User.find(params[:user_id])

    existing = Match.find_by(
      account_id: current_user.account_id,
      match_type_id: current_user.match_type_id,
      user_a_id: [ current_user.id, target_user.id ],
      user_b_id: [ current_user.id, target_user.id ]
    )

    if existing
      redirect_to discovery_index, alert: "Connection already exists."
      return
    end

    Match.create!(
      account: current_user.account,
      match_type: current_user.match_type,
      user_a_id: current_user.id,
      user_b_id: target_user.id,
      status: Match::STATUS_PENDING,
      score: calculate_match_score(target_user)
    )

    redirect_to discovery_index, notice: "Connection request sent to #{target_user.name}!"
  end

  def connections
    @pending = Match.where("(user_a_id = ? OR user_b_id = ?) AND status = ?",
      current_user.id, current_user.id, Match::STATUS_PENDING)
      .includes(:user_a, :user_b)

    @accepted = Match.where("(user_a_id = ? OR user_b_id = ?) AND status = ?",
      current_user.id, current_user.id, Match::STATUS_ACCEPTED)
      .includes(:user_a, :user_b)
  end

  private

  def calculate_match_score(target_user)
    75
  end

  def require_match_type
    unless current_user.match_type
      redirect_to root_path, alert: "Please select a match type to discover matches."
    end
  end

  def potential_matches
    opposite_side = Match.opposite_side(current_user.side)

    Profile.where(match_type: current_user.match_type)
      .where.not(user_id: current_user.id)
      .joins(:user)
      .where(users: {
        account_id: current_user.account_id,
        side: opposite_side,
        match_type_id: current_user.match_type_id
      })
      .includes(:user)
  end

  def apply_filters!
    return unless params[:filters].present?

    filters = params[:filters].permit!.to_h

    filters.each do |field_name, value|
      next if value.blank? || value == "all"

      @matches = @matches.where("profiles.data_json::jsonb ->> ? ILIKE ?", field_name, "%#{value}%")
    end
  end

  def apply_search!
    return unless params[:q].present?

    search_term = "%#{params[:q]}%"

    @matches = @matches.where("profiles.data_json::text ILIKE ?", search_term)
      .or(@matches.where("users.name ILIKE ?", search_term))
  end
end
