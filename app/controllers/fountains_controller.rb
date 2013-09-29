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
    id = 'QTFUCSDEJWLIJMMUYN2CO44HPXP5W51MMUOANZRUKR1YBUOG'
    secret = 'AO2MLVZC3TZ5SCCXH1F2KEBWDDBFREILGRC1YH441V5PIIBH'
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
