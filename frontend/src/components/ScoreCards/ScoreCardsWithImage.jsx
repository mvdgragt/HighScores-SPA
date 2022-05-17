import React from "react";
import { Link } from "react-router-dom";

const ScoreCardsWithImage = ({ game }) => (
  <section className="popular-products mb-4">
    <div className="card border-info mb-3">
      <Link to={"/games/" + game.url_slug}>
        <div className="row no-gutters card-body text-info">
          <div className="col-sm-7">
            <div className="card-body">
              <h4 className="card-title">{game.game_title}</h4>
              <div className="score-card-name">
                <p>
                  {game.genre}, {game.release_year}
                </p>
              </div>
            </div>
          </div>
          <div className="col-sm-5">
            <img
              src={game.image_url}
              className="card-img-top h-100 game-card-image image-card"
              alt="{ game.game_title }"
              style={{ maxWidth: "200px" }}
            />
          </div>
        </div>
      </Link>
    </div>
  </section>
);

export default ScoreCardsWithImage;
