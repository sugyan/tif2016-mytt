module ApplicationHelper
  def javascript_include_tag(*sources)
    if Rails.env.development?
      opts = {
        src: '//localhost:8080/javascripts/main.js'
      }
      return content_tag(:script, '', opts)
    end
    super(*sources)
  end
end
