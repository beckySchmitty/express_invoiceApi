const express = require("express");
const router = express.Router();
const db = require("../db")
const ExpressError = require("../expressError")


router.get('/', async (req, res, next) => {
    try {
        const resp = await db.query(`SELECT name, code 
        FROM companies
        ORDER BY name`);
        return res.json({"companies": resp.rows})
    } catch (e) {
        return next(e)
    }
});

router.get('/:code', async (req, res, next) => {
    try {
        const { code } = req.params;
        const resp = await db.query(`SELECT code, name, description FROM companies WHERE code=$1`,[code]);
        const company = resp.rows[0];
        if (!company) {
            throw new ExpressError(`Company ${code} not found`, 404)
        }
        return res.json({"company": company})
    } catch (e) {
        return next(e);
    }
});

module.exports = router; 