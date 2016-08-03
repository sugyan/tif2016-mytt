# coding: utf-8

class ApiController < ApplicationController
  def timetable
    @data = Rails.cache.read('main') || []
    @data.concat(Rails.cache.read('greeting') || [])
  end

  def generate
    days = {
      'day1' => '8/5 (金)',
      'day2' => '8/6 (土)',
      'day3' => '8/7 (日)'
    }
    colors = {
      'HOT STAGE'      => '#fb1a39',
      'SHIP STAGE'     => '#363483',
      'SMILE GARDEN'   => '#ff9000',
      'DOLL FACTORY'   => '#ff6aa2',
      'SKY STAGE'      => '#07c1fe',
      'FESTIVAL STAGE' => '#9fc700',
      'DREAM STAGE'    => '#009c45',
      'INFO CENTRE'    => '#e4007f'
    }
    images = %w(day1 day2 day3).map do |day|
      next unless params[day]
      title = Magick::Image.new(550, 35)
      Magick::Draw.new.annotate(title, 0, 0, 0, 0, days[day]) do
        self.font = Rails.root.join('.fonts', 'ipagp.ttf').to_path
        self.pointsize = 15
        self.gravity = Magick::CenterGravity
      end
      images = params[day].map do |item|
        time = format(
          '%s - %s',
          item['start'].in_time_zone.strftime('%H:%M'),
          item['end'].in_time_zone.strftime('%H:%M')
        )
        img = Magick::Image.new(550, 35) do
          self.background_color = colors[item['stage']] || '#808080'
        end
        Magick::Draw.new.fill('white').roundrectangle(5, 5, 545, 30, 5, 5).draw(img)
        Magick::Draw.new.annotate(img, 0, 0, 10, 24, time) do
          self.pointsize = 15
        end
        Magick::Draw.new.annotate(img, 0, 0, 100, 24, format('[%s]', item['stage'])) do
          self.pointsize = 15
        end
        Magick::Draw.new.annotate(img, 0, 0, 270, 24, item['artist']) do
          self.font = Rails.root.join('.fonts', 'ipagp.ttf').to_path
          self.font_weight = Magick::BoldWeight
          self.pointsize = 15
        end
        img
      end
      Magick::ImageList.new.push(title).concat(images).append(true)
    end
    png = Magick::ImageList.new.concat(images).append(true).to_blob do
      self.format = 'PNG'
    end
    render json: { result: "data:image/png;base64,#{Base64.strict_encode64(png)}" }
  end
end
