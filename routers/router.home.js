const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    const viewData = {
        appTitle: 'GoGram',
        appMessage: 'Welcome to GoGram app'
    }
    res.render('index', viewData);
});

module.exports = router;