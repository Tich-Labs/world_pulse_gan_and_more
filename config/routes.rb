Rails.application.routes.draw do
  get "messages/create"
  get "messages/index"
  resources :users, only: [ :new, :create ]
  resource :session, only: [ :new, :create, :destroy ]
  resources :projects, only: [ :create, :index ]
  resources :messages, only: [ :create, :index ]
  resources :profiles, only: [ :show, :edit, :update ] do
    member do
      get :complete
    end
  end

  resources :match_types, only: [ :index, :show ] do
    resources :profiles, only: [ :new, :create ]
  end

  resources :accounts, only: [] do
    resources :match_types, only: [ :new, :create, :edit, :update, :destroy ]
  end

  resources :discovery, only: [ :index ] do
    collection do
      get :search
      post :connect
      get :connections
    end
  end

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
  namespace :admin do
    get "/", to: "index"
    get "/users", to: "users"
    get "/projects", to: "projects"
    get "/stories", to: "stories"
    get "/messages", to: "messages"
    get "/roadmap-ideas", to: "roadmap_ideas"
    get "/training-requests", to: "training_requests"
    get "/training-offerings", to: "training_offerings"
    post "/import-stories", to: "import_stories"
    post "/import-roadmap-ideas", to: "import_roadmap_ideas"
  end
end
