json.array! @data do |item|
  json.day item['day']
  json.start item['start']
  json.end item['end']
  json.artist item['artist']
end
