const express = require("express");
const router = express.Router();
const db = require("../db")
const ExpressError = require("../expressError")

// debugger;


router.get('/', async (req, res, next) => {
    try {
        const resp = await db.query(`SELECT id, comp_code 
        FROM invoices
        ORDER BY id`);
        return res.json({"invoices": resp.rows[0]})
    } catch (e) {
        return next(e)
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const inv = await db.query(`SELECT * FROM invoices WHERE id=$1`, [id]);
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

router.put('/:id', async (req, res, next) => {
    try {
        const {id} = req.params;
        const {amt, paid} = req.body;
        let invoice = await db.query(`SELECT *
        FROM invoices 
        WHERE id=$1`, [id]);
        // invoice not found
        if (invoice.rows.length === 0) {
            throw new ExpressError(`No invoice found with id of ${id}`, 404)
        }

        invoice = resp.rows[0];
        let paidDate;

        //  marking paid when invoice has not been paid yet
        if (paid && invoice.paid === false) {
            paidDate = new Date();
        // if un-paying
        } else if (!paid) {
            paidDate = null;
        } else {
            paidDate = invoice.paid_date;
        }

        const updatedInv = await db.query(`UPDATE invoices  
        SET amt=$2, paid=$3, paid_date=$4 
        WHERE id=$1
        RETURNING id, comp_code, amt, 
        paid, add_date, paid_date`, [id, amt, paid, paidDate ])
        return res.json({"invoice": updatedInv.rows[0]})
    
      return res.json({"invoice": result.rows[0]});
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