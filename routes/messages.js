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

      if (results.rows.length === 0) {
        throw new ExpressError(`No messages found`, 404)
      }
  
      return res.json(results.rows);
    }
  
    catch (err) {
      return next(err);
    }
});
  
// Get message: {id, msg tags: [name, name]}
router.get("/:id", async function (req, res, next) {
    try {
      const resp = await db.query(
        `SELECT m.id, m.msg, t.tag
        FROM messages AS m
        LEFT JOIN messages_tags AS mt 
        ON m.id = mt.message_id
        JOIN tags AS t 
        ON mt.tag_code = t.code
        WHERE m.id = $1`, [req.params.id]);

        if (resp.rows.length === 0) {
          throw new ExpressError(`Message not found with id ${req.params.id}`, 404)
        }
  
        let { id, msg } = resp.rows[0];
        let tags = resp.rows.map(r => r.tag);
        // return res.send(req.params.id)
        return res.json({id, msg, tags});  
    }
    catch (e) {
      return next(e);
    }
  });

  router.patch('/:id', async (req, res, next) => {
    try {
      let msg = req.body.msg;
      let {id} = req.params;
      const resp = await db.query(`UPDATE messages 
      SET msg=$1 WHERE id=$2
      RETURNING id, user_id, msg`, [msg, id])
      if (resp.rows.length === 0) {
        throw new ExpressError("Message not found, no update", 404)
      }
      return res.json({"updated": resp.rows[0]})
    } catch(e) {
      return next(e)
    }
  })

module.exports = router;