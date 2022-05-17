var express = require('express');
var router = express.Router();

// GET /api/scores

router.get('/', async (req, res) => {
  const db = req.app.locals.db;

 const scores = await getScores(db);

  res.json(scores);
});

async function getScores(db) {
 
  const sql = `
  SELECT DISTINCT ON    (games.game_title) games.game_title, highscores.id, highscores.player, highscores.score_date, highscores.score, games.url_slug
                FROM    highscores
  INNER JOIN games ON   highscores.gameid = games.id
             ORDER BY   games.game_title, highscores.score DESC
  `;

  const result = await db.query(sql);
  
  return result.rows;
}


router.get('/:url_slug', async (req, res) => {
  
  const { url_slug } = req.params;
  const db = req.app.locals.db;

  const score = await getScore(url_slug, db)

  res.json(score);
});

async function getScore(url_slug, db) {
     
  const sql = `
   SELECT h.player,
          h.score_date,
          h.score
     FROM highscores as h
     JOIN games as g ON h.gameid = g.id
    WHERE url_slug = $1
   `;
}
module.exports = router;
