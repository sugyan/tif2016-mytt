json.array! @data do |item|
  json.day item['day']
  json.stage item['stage']
  json.start item['start']
  json.end item['end']
  json.artist item['artist']
end
