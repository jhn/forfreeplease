class Fountain
  include Mongoid::Document
  field :location, type: Array
  field :name, type: String

  index({location: '2dsphere'})

  class << self
    def near(params={})
      # Should be an array containing [lat, lon]
      # The radious is divided by
    end
  end
end
