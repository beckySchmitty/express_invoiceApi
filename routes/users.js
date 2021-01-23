// routes for users of pg-relationships-practice
const express = require("express");
const router = express.Router();
const db = require("../db");
const ExpressError = require("../expressError");


// GET users
router.get("/", async function (req, res, next) {
    try {
      const results = await db.query(
        `SELECT id, name, type FROM users`);
  
      return res.json(results.rows);
    }
  
    catch (err) {
      return next(err);
    }
  });
  
// get user by ID  
router.get('/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
      const userResults = await db.query(`SELECT name, type FROM users WHERE id = $1`, [id]);
      const msgResults = await db.query(`SELECT id, msg FROM messages WHERE user_id = $1`, [id]);
      if (userResults.rows.length === 0) {
        throw new ExpressError("User not found", 404);
      }
      const user = userResults.rows[0];
      user.messages = msgResults.rows;
      return res.send(user)
    } catch (e) {
      return next(e)
    }
  })

module.exports = router;