var express = require("express");
var router = express.Router();

router.get("/", async (req, res) => {

    const db = req.app.locals.db;

    const games = await getGames(db)
  
    res.json(games);
  });


  async function getGames(db) {
    const sql = `
      SELECT  id,
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

  const generateURLSlug = (game_title) =>
  game_title.replace("-", "").replaceAll(" ", "-").toLowerCase();

  module.exports = router;