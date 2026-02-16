class UsersController < ApplicationController
  def new
    @user = User.new
    @project_id = params[:project_id]
  end

  def create
    @user = User.new(user_params)
    @user.is_advisor = true

    if @user.save
      session[:user_id] = @user.id
      if params[:project_id].present?
        redirect_to messaging_path(project_id: params[:project_id]), notice: "Account created successfully!"
      else
        redirect_to profile_path, notice: "Account created successfully!"
      end
    else
      flash[:alert] = @user.errors.full_messages.join(", ")
      redirect_to new_user_path(project_id: params[:project_id])
    end
  end

  private

  def user_params
    params.require(:user).permit(:name, :email, :password, :bio, :location, :expertise)
  end
end
