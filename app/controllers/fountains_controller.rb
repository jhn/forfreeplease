class FountainsController < ApplicationController
  def index
    if params.size > 2
      respond_to do |format|
        format.html
        format.json { render json: Fountain.near(params) }
      end
    end
  end

  def foursquare
    latitude = params[:latitude]
    longitude = params[:longitude]
    radius = params[:radius].to_f * 1609.34
    id = ENV['FOURSQUARE_ID']
    secret = ENV['FOURSQUARE_SECRET']
    client = Foursquare2::Client.new(client_id: id, client_secret: secret)
    specials = client.search_specials(ll:"#{latitude},#{longitude}", radius: radius)
    puts "About to make call: "
    puts "ll: #{latitude},#{longitude}, radius: #{radius}"
    respond_to do |format|
      format.html
      format.json { render json: specials }
    end
  end
end
