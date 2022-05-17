var express = require('express');
var router = express.Router();

// GET http://localhost:3000/search?q=tetris
router.get('/', async(req, res) => {
 
  const searchTerm = req.query.q;

  const db = req.app.locals.db;

  const sql = `
    SELECT *
      FROM games
     WHERE game_title ILIKE '%' || $1 || '%'
  `;

  const result = await db.query(sql, [searchTerm]);
// const traffar = result.rows>1?"träffar":"träff";

  res.render('search', {
    title: 'Sökresultat',
    games: result.rows,
    searchTerm,
    traffar: result.rows.length==1?"träff":"träffar"
  });
});

module.exports = router;