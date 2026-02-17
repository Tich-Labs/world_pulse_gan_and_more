class ProfilesController < ApplicationController
  before_action :authenticate_user
  before_action :set_profile, only: [ :show, :edit, :update, :complete ]
  before_action :set_match_type, only: [ :new, :create, :edit, :update ]

  def show
    @fields = @profile.match_type.fields_for_side(current_user.side)
  end

  def edit
    @fields = @profile.match_type.fields_for_side(current_user.side)
  end

  def update
    profile_data = profile_data_params.to_h
    @profile.data = profile_data

    if @profile.save
      redirect_to @profile, notice: "Profile updated successfully."
    else
      @fields = @profile.match_type.fields_for_side(current_user.side)
      render :edit, alert: "Failed to update profile."
    end
  end

  def complete
    @fields = @profile.match_type.fields_for_side(current_user.side)
    render :edit
  end

  def new
    if current_user.profile_for(@match_type)
      redirect_to edit_profile_path(current_user.profile_for(@match_type)), notice: "Profile already exists."
      return
    end

    @profile = Profile.new(user: current_user, match_type: @match_type)
    @fields = @match_type.fields_for_side(current_user.side)
  end

  def create
    profile_data = profile_data_params.to_h
    @profile = Profile.new(user: current_user, match_type: @match_type)
    @profile.data = profile_data

    if @profile.save
      redirect_to @profile, notice: "Profile created successfully."
    else
      @fields = @match_type.fields_for_side(current_user.side)
      render :new, alert: "Failed to create profile."
    end
  end

  private

  def set_profile
    @profile = current_user.profile
    unless @profile
      redirect_to root_path, alert: "Profile not found."
    end
  end

  def set_match_type
    @match_type = if params[:match_type_id]
      MatchType.find(params[:match_type_id])
    else
      current_user.match_type
    end
  end

  def profile_data_params
    params.fetch(:profile_data, ActionController::Parameters.new).permit!
  end
end
