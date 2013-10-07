require 'csv'

class BaseParser
  def each_record file, &block
    records = CSV.read(file)[1..-1]
    # CSV.foreach(file)
    records.map {|r| yield r}
  end
end
