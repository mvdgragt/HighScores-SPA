var express = require('express');
var router = express.Router();
// import { saveGame, getGames } from '.'

const dropdownVals = ["Shooter", "Action adventure","Simulation","Racing","Strategy","Sports","Puzzle platform","Action platform","Online board games","Fighting"]

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

    return result.rows;
}
// GET /admin/games
router.get('/', async (req, res) => {

    const db = req.app.locals.db;

    const games = await getGames(db);

    res.render('admin/games/index', {
        title: 'Administration',
        games
    });
});

// GET /admin/games/new
router.get('/new', async (req, res) => {

    res.render('admin/games/new', {
        title: 'Nytt spel',
        dropdownVals
    });
});

// POST /admin/games/new
router.post('/new', async (req, res) => {

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

    await saveGame(game, db);

    res.redirect('/admin/games');
});

const generateURLSlug = (game_title) =>
    game_title.replace('-', '')
        .replaceAll(' ', '-')
        .toLowerCase();

      
        

module.exports = router;