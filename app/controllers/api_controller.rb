require 'open-uri'

class ApiController < ApplicationController
  def timetable
    @data = Rails.cache.fetch('timetable', expires_in: 1.hour) do
      results = []
      open('http://www.idolfes.com/2016/json/timetable/time.json') do |f|
        JSON.parse(f.read).each do |day, stages|
          stages.each do |stage, items|
            items.each do |item|
              results << item.merge(
                'day' => day,
                'stage' => stage
              )
            end
          end
        end
      end
      results
    end
  end
end
