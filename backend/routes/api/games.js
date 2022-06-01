var express = require('express');
var router = express.Router();

// GET /api/games/{url_slug}

router.get('/', async (req, res) => {
  const { title } = req.query;
  const db = req.app.locals.db;



  const games = title 
      ? await searchGame(title, db)
      : await getGames(db);

  res.json(games);
});



router.get('/:url_slug', async (req, res) => {
  
    const { url_slug } = req.params;
    const db = req.app.locals.db;
  
    const game = await getGame(url_slug, db)

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

  async function getGame(url_slug, db) {
     
    const sql = `
     SELECT g.id,
            g.game_title,
            g.description,
            g.genre,
            g.image_url,
            g.release_year,
            g.url_slug,
            h.player,
            h.score_date,
            h.score
       FROM highscores as h
       JOIN games as g ON h.gameid = g.id
      WHERE url_slug = $1
     `;
     const result = await db.query(sql, [url_slug])
  
     const game = result.rows
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