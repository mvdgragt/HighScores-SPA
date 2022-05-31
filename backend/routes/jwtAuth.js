const router = require("express").Router();
const pool = require("../app");
const bcrypt = require("bcrypt");
const jwtGenerator = require("../utils/jwtGenerator");
const validInfo = require("../middleware/validInfo");
const authorization = require("../middleware/authorization")

// registering

router.post("/register", validInfo, async (req, res) => {
  try {
    // 1. destructur teh re.body (name, email, password)

    const { name, email, password } = req.body;

    // 2. check if user exists (if user doesn't exist, throw error)

    const user = await pool.query("SELECT * FROM users WHERE user_email=$1", [
      email,
    ]);
    if (user.rows.length !== 0) {
      return res.status(401).send("User already exists");
    }

    // 3. Bcrypt the user password

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const bcryptPassword = await bcrypt.hash(password, salt);
    // 4. Enter the new user inside our database

    const newUser = await pool.query(
      "INSERT INTO users (user_name, user_email, user_password) VALUES ($1, $2, $3) RETURNING *",
      [name, email, bcryptPassword]
    );


    // 5. Generating our JWT token

    const token = jwtGenerator(newUser.rows[0].user_id);
    res.json({ token });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

// login route

router.post("/login", validInfo, async (req,res) => {
try {
    
    // 1. destructure the req.body

    const { email, password } = req.body;

    // 2. check if user doesn't exist (if not we throw error)
    const user = await pool.query( "SELECT * FROM users WHERE user_email = $1", [email]
    );

    if (user.rows.length === 0) {
        return res.status(401).json("password or Email is incorrect")
    }

    // 3. check if incoming password matches database password

    const validPassword = await bcrypt.compare(password, user.rows[0].user_password);

    if (!validPassword) {
        return res.status(401).json("Password or Email is incorrect")
    }

    // 4. give them the jwt token

        const token = jwtGenerator(user.rows[0].user_id);
        res.json({token})

} catch (error) {
    console.log(err.message);
    res.status(500).send("Server Error");
}
})

router.get("/is-verify", authorization, async (req,res) => {
    try {
        res.json(true)
        
    } catch (error) {
        console.log(err.message);
        res.status(500).send("Server Error");     
    }
})
module.exports = router;
