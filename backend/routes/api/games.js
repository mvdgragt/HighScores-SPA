var express = require("express");
var router = express.Router();
var authorize = require("../../middleware/authorize");

/**
 * @swagger
 * /api/games:
 *    get:
 *      summary: Get all games
 *      description: Get all games
 *      tags: [Game]
 *      responses:
 *        200:
 *          description: List of games
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/Game'
 */

router.get("/", async (req, res) => {

  const db = req.app.locals.db;

  const games = await getGames(db);

  res.json(games);
});

/**
 * @swagger
 * /api/games/{id}:
 *    get:
 *      summary: Get game based on id
 *      description: Get game
 *      tags: [Game]
 *      parameters:
 *        - name: id
 *          in: path
 *          description: Game id
 *          required: true
 *      responses:
 *        200:
 *          description: Returns game
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                $ref: '#/components/schemas/Game'
 *        404:
 *          description: Game not found
 */

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const db = req.app.locals.db;

  const game = await getGame(id, db);

  if (!game) {
    res.status(404).send();
    return;
  }

  res.json(game);
});

/**
 * @swagger
 * /api/games:
 *   post:
 *     summary: Create new game
 *     description: Create new game
 *     tags: [Game]
 *     consumes:
 *       - application/json
 *     requestBody:
 *       description: Game details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: '#/components/schemas/NewGame'
 *     produces:
 *       - application/json
 *     responses:
 *       201:
 *         description: Returns game
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/Game'
 *       400:
 *         description: Invalid game
 *       401:
 *         description: Invalid token
 *       403:
 *         description: Not allowed
 */
router.post("/", authorize, async (req, res) => {
  const { game_title, description, genre, image_url, release_year } = req.body;

  const game = {
    game_title,
    description,
    genre,
    image_url,
    release_year: parseFloat(release_year),
    url_slug: generateURLSlug(game_title),
  };

  const db = req.app.locals.db;

  game.id = await saveGame(game, db);
  if (!game) {
    res.status(400).send();
    return;
  }
  // Sätt Location-headern till "/api/games/tetris" (t.ex.)
  res.location(`/api/games/${game.url_slug}`);

  // 201 Created
  res.status(201).send(game);
});


/**
 * @swagger
 * /api/games/{id}:
 *   delete:
 *     summary: Delete game based on id
 *     description: Delete game
 *     tags: [Game]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Game id
 *         required: true
 *     responses:
 *       204:
 *         description: Game deleted
 *       401:
 *         description: Not logged in
 *       403:
 *         description: Not allowed
 * 
 */
router.delete("/:id", authorize, async (req, res) => {
  const gameId = req.params.id;
  const db = req.app.locals.db;

  await deleteGame(gameId, db);

  //No content
  res.status(204).send();
});

async function deleteGame(id, db) {
  const sql = `
      DELETE FROM games
            WHERE id = $1
    `;

  await db.query(sql, [id]);
}

async function searchGame(title, db) {
  const sql = `
select 	id,
		    game_title,
        description,
        genre,
        image_url,
        release_year,
        url_slug
  from  games
WHERE game_title ILIKE '%' || $1 || '%'
`;
  const result = await db.query(sql, [title]);
  return result.rows;
}

async function getGames(db) {

  const sql = `
   SELECT id,
          game_title,
          description,
          genre,
          image_url,
          release_year,
          url_slug
     FROM games
   `;


   const result = await db.query(sql);

   const games = result.rows.map(game => ({
     id: game.id,
     game_title: game.game_title,
     description: game.description,
     genre: game.genre,
     image_url: game.image_url,
     release_year: game.release_year,
     url_slug: game.url_slug
   }));
 
   return games;
}


async function saveGame(games, db) {
  const sql = `
        INSERT INTO games (
            game_title,
            description,
            genre,
            image_url,
            release_year,
            url_slug
            
        ) VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id
    `;

  const result = await db.query(sql, [
    games.game_title,
    games.description,
    games.genre,
    games.image_url,
    games.release_year,
    games.url_slug,
  ]);
  return result.rows[0].id;
}

module.exports = router;

/**
 * @swagger:
 * components:
 *  schemas:
 *    Game:
 *      type: object
 *      properties:
 *        id:
 *          type: integer
 *          description: Game id
 *        title:
 *          type: string
 *          description: Game title
 *        description:
 *          type: string
 *          description: Game description
 *        genre:
 *          type: string
 *          description: Game genre
 *        image_url:
 *          type: string
 *          description: Game image
 *        release_year:
 *          type: integer
 *          description: Game release year
 *        url_slug:
 *          type: string
 *          description: Game URL slug
 *    NewGame:
 *      type: object
 *      properties:
 *        title:
 *          type: string
 *          description: Game title
 *        description:
 *          type: string
 *          description: Game description
 *        genre:
 *          type: string
 *          description: Game genre
 *        image_url:
 *          type: string
 *          description: Game image
 *        release_year:
 *          type: integer
 *          description: Game release year
 * 
 */
