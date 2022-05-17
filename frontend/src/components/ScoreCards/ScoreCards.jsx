import React from "react";
import { Link } from "react-router-dom";
import Moment from 'moment';

const ScoreCards = ({ scores }) => {
  
  const formatDate = Moment(scores.score_date).format('YYYY-MM-DD')

  
  return (
    <section className="popular-products mb-4">
      <h2 className="text-center">Highscores</h2>
      <div>
      {scores.map(score => (
           <div className="card border-info mb-3" key={score.id}>
           <Link to={"/games/" + score.url_slug}>
           <div className="card-body text-info">
         <div className="score-card-title">
           <h4>{ score.game_title }</h4>
           <h4>{ score.score }</h4>
         </div>
         <div className="score-card-name">
           <p>{ score.player }, { formatDate }</p>
         </div>
       </div>
           </Link>
         </div>
        ))}
      </div>
    </section>
  )};

export default ScoreCards;
