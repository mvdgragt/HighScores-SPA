export async function saveGame(games, db) {

    const sql = `
        INSERT INTO games (
            game_title,
            description,
            genre,
            image_url,
            release_year,
            url_slug
            
        ) VALUES ($1, $2, $3, $4, $5, $6)
    `;

    await db.query(sql, [
        games.game_title,
        games.description,
        games.genre,
        games.image_url,
        games.release_year,
        games.url_slug
    ]);
}

export async function getGames(db) {

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