const express = require('express');
const router = express.Router();

router.get('/:id', (req, res) => {
    const idb = req.params.id
    console.log(idb)
    res.render('update', { idb: idb });
});

module.exports = router;