Rails.application.routes.draw do
  root 'root#index'

  namespace :api do
    get  'timetable', constraints: { format: 'json' }
    post 'generate'
  end
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
