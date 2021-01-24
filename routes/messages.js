// routes for users of pg-relationships-practice
const express = require("express");
const router = express.Router();
const db = require("../db");
const ExpressError = require("../expressError");


// GET messages
router.get("/", async function (req, res, next) {
    try {
      const results = await db.query(
        `SELECT * FROM messages`);
  
      return res.json(results.rows);
    }
  
    catch (err) {
      return next(err);
    }
});
  
router.get("/:id", async function (req, res, next) {
    try {
      const resp = await db.query(
        `SELECT m.id, m.msg, t.tag
        FROM messages AS m
        JOIN messages_tags AS mt 
        ON m.id = mt.message_id
        JOIN tags AS t 
        ON mt.tag_code = t.code
        WHERE m.id = $1;`, [req.params.id]);
  
        let { id, msg } = resp.rows[0];
        let tags = resp.rows.map(r => r.tag);
    
        return res.json({id, msg, tags});  
    }
    catch (err) {
      return next(err);
    }
  });

module.exports = router;