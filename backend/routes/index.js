var express = require('express');
var router = express.Router();

// GET http://localhost:3000/
router.get('/', async function(req, res) {
 
  const db = req.app.locals.db;

  const sql = `
  SELECT DISTINCT ON (games.game_title) games.game_title, highscores.player, highscores.score_date, highscores.score, games.url_slug
  FROM highscores
INNER JOIN games ON highscores.gameid = games.id
ORDER BY games.game_title, highscores.score DESC
  `;

  const result = await db.query(sql);

  res.render('index', { 
    title: 'Highscore',
    scorecards: result.rows
  });
});

module.exports = router;
