class ProjectsController < ApplicationController
  def create
    project_params = permitted_params.dup
    project_params[:support_types] = permitted_params[:support_types].join(", ") if permitted_params[:support_types]

    @project = Project.new(project_params)

    if @project.save
      render json: { success: true, message: "Project submitted successfully!" }
    else
      render json: { success: false, error: @project.errors.full_messages.join(", ") }, status: :unprocessable_entity
    end
  end

  def index
    @projects = Project.order(created_at: :desc).limit(10)
    render json: @projects
  end

  private

  def permitted_params
    params.require(:project).permit(
      :name, :location, :description, :accomplishment_goal, :why_matters,
      :attempts_so_far, :what_worked, :ideal_outcome,
      :timeline, :team_composition, support_types: []
    )
  end
end
