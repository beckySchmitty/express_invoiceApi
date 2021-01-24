const express = require("express");
const router = express.Router();
const db = require("../db")
const ExpressError = require("../expressError")
const slugify = require('slugify')


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
        const resp = await db.query(`SELECT code, name, 
        description FROM companies WHERE code=$1`,[code]);
        const company = resp.rows[0];
        if (!company) {
            throw new ExpressError(`Company ${code} not found`, 404);
        }
        return res.json({"company": company})
    } catch (e) {
        return next(e);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const company = req.body;
        let slugified = slugify(company.code, {remove: /[*+~.()'"!:@]/g}).toLowerCase().slice(0,4);
        const companyAdded = await db.query(
            'INSERT INTO companies (code, name, description) VALUES ($1, $2, $3) RETURNING code, name, description',
             [slugified, company.name, company.description])
        return res.json({"company": companyAdded.rows[0]})
    } catch (e) {
        return next(e)
    }
});

router.put('/:code', async (req, res, next) => {
    try {
        const code = req.params.code;
        const { name, description } = req.body;
        const company = await db.query(`UPDATE companies WHERE name=$2, 
        description=$3 WHERE code=$1 
        RETURNING code, name, description`,[code, name, description]);
        return res.json({"company": company.rows[0]})
    } catch (e) {
        return next(e);
    }
});

router.delete('/:code', async (req, res, next) => {
    try {
        const code = req.params.code;
        const company = await db.query(`DELETE FROM companies WHERE code=$1`,[code]);
        return res.json({msg: 'deleted'})
    } catch (e) {
        return next(e);
    }
});
module.exports = router; 