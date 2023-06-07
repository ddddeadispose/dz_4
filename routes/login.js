const express = require('express');
const router = express.Router();

// Авторизация
router.post('/api/user/login', (req,res) => {
    console.log('Авторизация')
    res.json({
        id: 1,
        mail: "test@mail.ru"
    })
})

module.exports = router;