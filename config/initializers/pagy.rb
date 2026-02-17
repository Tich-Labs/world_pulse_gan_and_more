require 'pagy'

# Ensure the Pagy view helpers are available once ActionView loads
ActiveSupport.on_load(:action_view) do
	include Pagy::Frontend
end

# Optional: configure defaults here, e.g.:
# Pagy::VARS[:items] = 25
