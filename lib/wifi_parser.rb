# wifi: id, name, address, city, url, phone, type, zip
# fountains: id, lat, lon, name
#
# Instead I can create a method that takes in a list of headers
# and returns the data parsed
require './base_parser'

class WifiParser < BaseParser
end

wifi = WifiParser.new
res = wifi.each_record("wifi.csv") do |row|
  id, name, address, city, url, phone, type, zip = row.split(',')
  row = {}
  row[:id] = id
  row[:name] = name
  row[:address] = address
  row[:city] = city
  row[:url] = url
  row[:phone] = phone
  row[:type] = type
  row[:zip] = zip
  row
end

puts res.inspect
