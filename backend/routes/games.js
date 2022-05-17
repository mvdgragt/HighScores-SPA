var express = require('express');
var router = express.Router();

router.get('/:urlSlug', async function(req, res) {

    const urlSlug = req.params.urlSlug;

  const db = req.app.locals.db;

  const sql = `
    SELECT *
      FROM highscores
RIGHT JOIN games ON highscores.gameid = games.id
     WHERE url_slug = $1
  `;

  const sql_highscores = `
  SELECT *
    FROM highscores
  JOIN games ON highscores.gameid = games.id
   WHERE url_slug = $1
`;


  const result = await db.query(sql, [urlSlug]);
  const result_highscores = await db.query(sql_highscores, [urlSlug]);
  const game = result.rows[0]; 

    const scores = result_highscores.rows.map((score) => ({
    username: score.player,
    highscore: score.score,
    highscore_date: score.score_date,
  }));

  res.render('games/details', { 
    title: game.game_title,
    game,
     scores
  });



});

module.exports = router;