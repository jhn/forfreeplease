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
    respond_to do |format|
      format.html
      format.json { render json: specials_for_location(params) }
    end
  end

  private

  def specials_for_location(params)
    client = Foursquare2::Client.new(
      client_id: ENV['FOURSQUARE_ID'],
      client_secret: ENV['FOURSQUARE_SECRET']
    )
    client.search_specials(
      ll:"#{params[:latitude]},#{params[:longitude]}",
      radius: params[:radius].to_f * 1609.34
    )
  end
end
