var express = require("express");
var router = express.Router();
const jwt = require('jsonwebtoken');

/**
 * @swagger 
 * /api/auth: 
 *   post:
 *     summary: Generate authentication token
 *     description: Generate authentication token
 *     tags: [Authentication]
 *     consumes:
 *       - application/json 
 *     requestBody:
 *       description: User credentials
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_name:
 *                 type: string
 *               user_email:
 *                 type: string
 *               user_password:
 *                 type: string
 *     produces:
 *       - application/json
 *     responses:
 *       200: 
 *         description: Returns auth token        
 *         content:
 *           application/json:
 *             schema:
 *               type: object 
 *               properties:
 *                 token:
 *                   type: string
 *       401: 
 *         description: Invalid username/password
 */

router.post("/", async function (req, res) {
  const { user_name, user_password } = req.body;

  const db = req.app.locals.db;

  const user = await findUser(user_name, user_password, db);

  if (!user) {
    res.status(401).send(); // 401 Unauthorized
    return;
  }

  const token = generateToken();
  res.json({ token });
});

function generateToken() {
const token = jwt.sign({}, 'GREEN');
  return token;

}

async function findUser(user_name, user_password, db) {
  const sql = `
    SELECT  user_id,
            user_name,
            user_email
      FROM  "users"
     WHERE  user_name = $1
       AND  user_password = $2
    `;

  const result = await db.query(sql, [user_name, user_password]);

  let user = result.rows.length ? result.rows[0] : undefined;

  return user;
}

module.exports = router;
