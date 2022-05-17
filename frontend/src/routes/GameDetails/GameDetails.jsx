import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ScoreCardsScore from "../../components/ScoreCards/ScoreCardsScore";

const GamesDetails = () => {
  
  const { urlSlug } = useParams();

  const [game, setGame] = useState();

  useEffect(() => {
    fetch(`http://localhost:5000/api/games/${urlSlug}`)
      .then((resp) => resp.json())
      .then((game) => setGame(game))
  }, [urlSlug]);

   return (

    <>
      {game && (
        <div className="mb-3">
          <div className="row no-gutters card-body text-info">
            <div className="col-sm-3">
              <img
                src={game[0].image_url}
                className="card-img-top h-100 game-card-details"
                alt={game[0].game_title}
                style={{maxWidth: "200px"}}
              />
            </div>
            <div className="col-sm-9">
              <div className="card-body">
                <h4 className="card-title">{game[0].game_title}</h4>
                <div className="score-card-name">
                  <p>
                    {game[0].genre}, {game[0].release_year}
                  </p>
                </div>
                <div className="score-card-name">
                  <p>{game[0].description}</p>
                </div>
              </div>
            </div>
          </div>
          <h4 className="highscore-table">Highscores React</h4>
         
          {game.map((g) => (
          <ScoreCardsScore game={g} key={g.id} />
          ))}

        </div>
      )}
    </>
  );
};

export default GamesDetails;
