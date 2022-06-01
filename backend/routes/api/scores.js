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


router.get('/:url_slug/highscores', async (req, res) => {
  
  const { url_slug } = req.params;
  const db = req.app.locals.db;

  const score = await getScore(url_slug, db)

  if (!score) {
      res.status(404).send();
      return;
    }

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
   const result = await db.query(sql, [url_slug])
  
   const score = result.rows
    return score;
}

async function saveScore(highscores, db) {

  const sql = `
      INSERT INTO highscores (
          gameid,
          player,
          score_date,
          score
          
      ) VALUES ($1, $2, $3, $4)
      RETURNING id
  `;

  const result = await db.query(sql, [
      highscores.gameid,
      highscores.player,
      highscores.score_date,
      highscores.score
  ]);
  return result.rows[0].id;

}

router.post('/', async (req,res) => {
  const {
    gameid,
    player,
    score_date,
    score
  } = req.body;

  const highscores = {
    gameid,
    player,
    score_date,
    score
};


const db = req.app.locals.db;

highscores.id = await saveScore(highscores, db);

  // Sätt Location-headern till "/api/games/tetris" (t.ex.)
  res.location(`/api/scores/`)

  // 201 Created
  res.status(201).send(highscores)
})

module.exports = router;
