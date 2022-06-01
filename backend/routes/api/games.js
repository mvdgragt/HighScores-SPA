var express = require('express');
var router = express.Router();

/**
 * @swagger
 * /api/games:
 *    get:
 *      description: Get all games
 *      tags: [Game] 
 *      parameters:
 *        - name: title
 *          in: query
 *          description: Game title
 *          required: false
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

router.get('/', async (req, res) => {
  const { title } = req.query;
  const db = req.app.locals.db;



  const games = title 
      ? await searchGame(title, db)
      : await getGames(db);

  res.json(games);
});


/**
 * @swagger
 * /api/games/{id}:
 *    get:
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


router.get('/:id', async (req, res) => {
  
    const { id } = req.params;
    const db = req.app.locals.db;
  
    const game = await getGame(id, db)

    if (!game) {
        res.status(404).send();
        return;
      }
  
    res.json(game);
  });

  router.post('/', async (req,res) => {
    const {
      game_title,
      description,
      genre,
      image_url,
      release_year
    } = req.body;

    const game = {
      game_title,
      description,
      genre,
      image_url,
      release_year: parseFloat(release_year),
      url_slug: generateURLSlug(game_title)

      
  };


  const db = req.app.locals.db;

  game.id = await saveGame(game, db);
  if (!game) {
    res.status(400).send();
    return;
  }
    // Sätt Location-headern till "/api/games/tetris" (t.ex.)
    res.location(`/api/games/${game.url_slug}`)

    // 201 Created
    res.status(201).send(game)
  })
  
  router.delete('/:id', async (req, res) => {
    
    const gameId = req.params.id;
    const db = req.app.locals.db;
    
    await deleteGame(gameId,db);

    //No content
    res.status(204).send()
  });

  async function deleteGame(id,db) {
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
`
const result = await db.query(sql, [title]);
return result.rows;

}

async function getGame(id, db) {
     
  const sql = `
   SELECT id,
          game_title,
          description,
          genre,
          image_url,
          release_year,
          url_slug
     FROM games
    WHERE id = $1
   `;

  // async function getGame(id, db) {
     
  //   const sql = `
  //    SELECT g.id,
  //           g.game_title,
  //           g.description,
  //           g.genre,
  //           g.image_url,
  //           g.release_year,
  //           g.url_slug,
  //           h.player,
  //           h.score_date,
  //           h.score
  //      FROM games as g
  //     WHERE g.id = $1
  //    `;
     const result = await db.query(sql, [id])
  
     const game = result.rows.length > 0 ? result.rows[0] : undefined;
      return game;
  }

  async function getGames(db) {
    const sql = `
    SELECT 	id,
            game_title,
            description,
            genre,
            image_url,
            release_year,
            url_slug
      FROM  games
      `;
  
    const result = await db.query(sql);
  
    return result.rows;
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
        games.url_slug
    ]);
    return result.rows[0].id;

}

const generateURLSlug = (game_title) =>
    game_title.replace('-', '')
        .replaceAll(' ', '-')
        .toLowerCase();

  
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
   */