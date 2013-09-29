require 'mongo'

class DataParser
  def self.parse file
    arr = []
    File.open(file).each_line do |line|
      record = line.split(',')
      lat    = record[1].to_f
      lon    = record[2].to_f
      name   = record[3].to_s.chomp

      document = self.to_ordered_hash lat, lon, name

      arr << document
    end
    arr
  end

  private

  def self.to_ordered_hash lat, lon, name
    hash            = BSON::OrderedHash.new
    hash[:location] = [lon, lat]
    hash[:name]     = name
    hash
  end
end

class MongoDumper
  include Mongo

  def initialize database, collection, host: "localhost", port: 27017
    database = MongoClient.new(host, port).db(database)
    @collection = database[collection]
  end

  def add_to_collection documents
    begin
      documents.each do |document|
        puts document.inspect
        @collection.insert(document)
      end
    rescue => e
      puts "Something went wrong while inserting: " + e.inspect
    end
  end
end

documents = DataParser.parse "fountains.csv"
dumper    = MongoDumper.new "forfreeplease_test", "fountains"
dumper.add_to_collection documents
