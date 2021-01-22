const express = require("express");
const router = express.Router();
const db = require("../db")
const ExpressError = require("../expressError")


router.get('/', async (req, res, next) => {
    try {
        const results = await db.query(`SELECT * FROM companies`);
        return res.json({companies: results.rows})
    } catch (e) {
        next(e);
    }
});

router.get('/:code', async (req, res, next) => {
    try {
        const { code } = req.params;
        const results = await db.query(`SELECT * FROM companies WHERE id=$1`,[code]);
        const data = results.rows[0];
        return res.json({company: {code: data.code, name: data.name, description: data.description}})
    } catch (e) {
        next(e);
    }
});

module.exports = router;