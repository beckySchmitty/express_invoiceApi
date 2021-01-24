const express = require("express");
const router = express.Router();
const db = require("../db")
const ExpressError = require("../expressError")


router.get('/', async (req, res, next) => {
    try {
        const resp = await db.query(`SELECT id, comp_code 
        FROM invoices
        ORDER BY id`);
        return res.json({"invoices": resp.rows})
    } catch (e) {
        return next(e)
    }
});
router.get('/:id', async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const inv = await db.query(`SELECT *
        FROM invoices 
        WHERE id=$1`, [id]);
        if (inv.rows.length === 0) {
            throw new ExpressError(`No invoice found with id of ${id}`, 404)
        }
        const invoice = inv.rows[0]
        const company = await db.query(`SELECT * FROM companies WHERE code=$1`, [invoice.comp_code])
        invoice.company = company.rows[0]
        return res.json({"invoice": invoice})
    } catch (e) {
        return next(e)
    }
});


router.delete('/:code', async (req, res, next) => {
    try {
        const code = req.params.code;
        const company = await db.query(`DELETE FROM ivoices WHERE code=$1`,[code]);
        return res.json({msg: 'deleted'})
    } catch (e) {
        return next(e);
    }
});

module.exports = router; 