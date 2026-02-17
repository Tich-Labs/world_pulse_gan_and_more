require_relative "boot"

require "rails/all"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module WpPlus
  class Application < Rails::Application
    config.load_defaults 8.1
    config.autoload_lib(ignore: %w[assets tasks])
    config.secret_key_base = ENV.fetch("SECRET_KEY_BASE") { Rails.application.credentials.secret_key_base }
  end
end
