var express = require('express');
var router = express.Router();

// GET /admin/score/new
router.get('/new', async (req, res) => {

    const db = req.app.locals.db;
    const games = await getGames(db);



    res.render('admin/score/new', {
        title: 'Nytt Highscore',
        games
    });
});
    
async function getGames(db) {

    const sql = `
        SELECT id,
               game_title
          FROM games
    `;

    const result = await db.query(sql);
    return result.rows;
}

// POST /admin/score/new
router.post('/new', async (req, res) => {

    const {
        game: gameid,
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

    await saveHighscore(highscores, db);

    res.redirect('/admin/games');
});

async function saveHighscore(highscores, db) {

    const sql = `
        INSERT INTO highscores (
            gameid,
            player,
            score_date,
            score
            
        ) VALUES ($1, $2, $3, $4)
    `;

    await db.query(sql, [
        highscores.gameid,
        highscores.player,
        highscores.score_date,
        highscores.score
    ]);
}


module.exports = router;