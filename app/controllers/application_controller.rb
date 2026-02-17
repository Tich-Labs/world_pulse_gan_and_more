class ApplicationController < ActionController::Base
  allow_browser versions: :modern

  stale_when_importmap_changes

  helper_method :current_user, :current_account, :super_admin?

  def current_user
    @current_user ||= User.find_by(id: session[:user_id]) if session[:user_id]
  end

  def current_account
    current_user&.account
  end

  def super_admin?
    current_user&.role == "super_admin"
  end

  def authenticate_user
    redirect_to new_session_path unless current_user
  end

  def require_account
    redirect_to root_path, alert: "No account selected" unless current_account || super_admin?
  end

  def scoped_account
    super_admin? ? nil : current_account
  end
end
