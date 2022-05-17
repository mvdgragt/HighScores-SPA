import Moment from 'moment';

const ScoreCardsScore = ({game}) => {

  const formatDate = Moment(game.score_date).format('YYYY-MM-DD')

  return (
  <div className="card border-info mb-3">
    <div className="card-body text-info">
      <div className="score-card-title">
        <h4>{ game.player }, { formatDate }</h4>
        <h4>{ game.score }</h4>

      </div>
    </div>
</div>
  )};
export default ScoreCardsScore
