class SessionsController < ApplicationController
  def new
    @project_id = params[:project_id]
  end

  def create
    user = User.find_by(email: params[:email])

    if user && user.authenticate(params[:password])
      session[:user_id] = user.id
      if params[:project_id].present?
        redirect_to messaging_path(project_id: params[:project_id]), notice: "Logged in successfully!"
      else
        redirect_to profile_path, notice: "Logged in successfully!"
      end
    else
      flash[:alert] = "Invalid email or password"
      redirect_to new_session_path(project_id: params[:project_id])
    end
  end

  def destroy
    session[:user_id] = nil
    redirect_to root_path, notice: "Logged out successfully!"
  end
end
