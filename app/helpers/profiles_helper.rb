module ProfilesHelper
  def render_profile_field(field, form_builder, profile_data)
    name = field.name.parameterize.underscore
    value = profile_data[name] || profile_data[field.name]
    options = field.options

    label_class = "block text-sm font-medium text-gray-700 mb-1"
    input_class = "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-custom focus:ring-primary-custom sm:text-sm"

    label_tag("profile_data[#{field.name}]", field.name, class: label_class)

    case field.field_type
    when "text"
      form_builder.text_field field.name, value: value, class: input_class
    when "textarea"
      form_builder.text_area field.name, value: value, rows: 4, class: input_class
    when "number"
      form_builder.number_field field.name, value: value, class: input_class
    when "select"
      form_builder.select field.name, options, { selected: value, include_blank: true }, class: input_class
    when "multiselect"
      selected = value.is_a?(Array) ? value : []
      content_tag(:div, class: "space-y-2") do
        options.map do |opt|
          content_tag(:label, class: "inline-flex items-center") do
            check_box_tag("profile_data[#{field.name}][]", opt, selected.include?(opt), class: "rounded border-gray-300 text-primary-custom shadow-sm") +
              content_tag(:span, opt, class: "ml-2 text-sm text-gray-600")
          end
        end.join.html_safe
      end
    when "boolean"
      form_builder.check_box field.name, { checked: value, class: "rounded border-gray-300 text-primary-custom shadow-sm" }, "true", "false"
    else
      form_builder.text_field field.name, value: value, class: input_class
    end
  end

  def render_profile_field_readonly(field, profile_data)
    name = field.name.parameterize.underscore
    value = profile_data[name] || profile_data[field.name]

    case field.field_type
    when "multiselect"
      value.is_a?(Array) ? value.join(", ") : value
    when "boolean"
      (value == "true" || value == true) ? "Yes" : "No"
    else
      value.presence || "-"
    end
  end
end
