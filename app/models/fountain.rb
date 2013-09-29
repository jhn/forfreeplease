class Fountain
  include Mongoid::Document
  field :location, type: Array
  field :name, type: String

  index({location: '2dsphere'})

  class << self
    def near(params={})
      lon    = params[:longitude].to_f
      lat    = params[:latitude].to_f
      radius = params[:radius].to_f
      Fountain.geo_near([lon, lat]).spherical.max_distance(radius / 3959).entries
    end
  end
end
