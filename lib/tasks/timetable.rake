# coding: utf-8
require 'open-uri'

namespace :timetable do
  task main: :environment do
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
    Rails.cache.write('main', results)
  end

  task greeting: :environment do
    results = []
    open('http://www.idolfes.com/2016/json/greeting/greeting.tsv').set_encoding('UTF-8').each_line do |line|
      day, time, *items = line.chomp.split(/\t/, 21)
      start_time, end_time = time.split(/-/)
      items.each.with_index do |item, i|
        next if item.blank?
        results << {
          'day'    => day,
          'stage'  => format('GREETING AREA (%s)', ('A'.ord + i).chr),
          'start'  => start_time.delete(':'),
          'end'    => end_time.delete(':'),
          'artist' => item.gsub(/<br>/, ' ')
        }
      end
    end
    Rails.cache.write('greeting', results)
  end

  task ennichi: :environment do
    results = []
    open('http://www.idolfes.com/2016/json/ennichi/ennichi.tsv').set_encoding('UTF-8').each_line do |line|
      day, start_time, end_time, lane, artist = line.strip.split(/\t/, 5)
      results << {
        'day'    => day,
        'stage'  => '縁日レーン' + lane,
        'start'  => start_time,
        'end'    => end_time,
        'artist' => artist.gsub('<br>', ' ')
      }
    end
    Rails.cache.write('ennichi', results)
  end
end
