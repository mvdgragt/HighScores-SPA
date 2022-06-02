var express = require('express');
var router = express.Router();
var authorize = require('../../middleware/authorize')

/**
 * @swagger
 * /api/scores:
 *    get:
 *      summary: Get all scores
 *      description: Get all scores
 *      tags: [Highscores]
 *      responses:
 *        200:
 *          description: List of highscores
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/Score'
 */

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

/**
 * @swagger
 * /api/scores/{url_slug}/highscores:
 *    get:
 *      summary: Get all scores per game
 *      description: Get highscores per game
 *      tags: [Highscores]
 *      parameters:
 *        - name: url_slug
 *          in: path
 *          description: Highscores per game
 *          required: true
 *      responses:
 *        200:
 *          description: Returns highscores per game
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                $ref: '#/components/schemas/Score'
 *        404:
 *          description: Game not found
 */

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

/**
 * @swagger
 * /api/scores:
 *   post:
 *     summary: Register new highscore
 *     description: Register new highscore
 *     tags: [Highscores]
 *     consumes:
 *       - application/json
 *     requestBody:
 *       description: Highscore details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: '#/components/schemas/NewScore'
 *     produces:
 *       - application/json
 *     responses:
 *       201:
 *         description: Returns highscore
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/Score'
 *       400:
 *         description: Invalid highscore
 *       401:
 *         description: Invalid token
 *       403:
 *         description: Not allowed
 */

router.post('/', authorize, async (req,res) => {
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


/**
 * @swagger:
 * components:
 *  schemas:
 *    Score:
 *      type: object
 *      properties:
 *        id:
 *          type: integer
 *          description: id
 *        gameid:
 *          type: integer
 *          description: gameid
 *        player:
 *          type: string
 *          description: player
 *        score_date:
 *          type: string
 *          description: score_date
 *        score:
 *          type: integer
 *          description: score
 *    NewScore:
 *      type: object
 *      properties:
 *        id:
 *          type: integer
 *          description: id
 *        gameid:
 *          type: integer
 *          description: gameid
 *        player:
 *          type: string
 *          description: player
 *        score_date:
 *          type: string
 *          description: score_date
 *        score:
 *          type: integer
 *          description: score
 
 */
