Rails.application.routes.draw do
  get "messages/create"
  get "messages/index"
  resources :users, only: [ :new, :create ]
  resource :session, only: [ :new, :create, :destroy ]
  resources :projects, only: [ :create, :index ]
  resources :messages, only: [ :create, :index ]

  get "up" => "rails/health#show", :as => :rails_health_check

  root "pages#index"
  get "/roadmap", to: "pages#roadmap"
  get "/roadmap/ideas", to: "roadmap#index"
  post "/roadmap/vote/:id", to: "roadmap#vote"
  get "/matchmaking", to: "pages#matchmaking"
  get "/messaging", to: "pages#messaging"
  get "/documentation", to: "pages#documentation"
  get "/before_profile", to: "pages#before_profile"
  get "/awards", to: "pages#awards"
  get "/awards/stories", to: "stories#index"
  post "/awards/vote/:id", to: "stories#vote"
  get "/after_profile", to: "pages#after_profile"
  get "/training", to: "pages#training"
  get "/training/data", to: "training#index"
  post "/training/request", to: "training#create_request"
  post "/training/offering", to: "training#create_offering"
  post "/training/vote/:id", to: "training#vote_request"
  get "/profile", to: "pages#profile"

  # Admin routes
  get "/admin", to: "admin#index"
  resources :admin do
    collection do
      get :users
      get :projects
      get :stories
      get :messages
      get :roadmap_ideas
      get :training_requests
      get :training_offerings
    end
  end
end
