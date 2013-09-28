class Fountain
  include Mongoid::Document
  field :location, type: Array
  field :name, type: String

  index({location: '2dsphere'})
end
