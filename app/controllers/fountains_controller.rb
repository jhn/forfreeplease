class FountainsController < ApplicationController
  def index
    if params.size > 2
      respond_to do |format|
        format.html
        format.json { render json: Fountain.near(params) }
      end
    end
  end
end
