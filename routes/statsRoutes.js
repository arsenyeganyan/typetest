const express = require('express');
const StatsController = require('../controllers/StatsController');

const router = express.Router();

router.post('/new', StatsController.addTest);
router.get('/get-all/:userId', StatsController.getAllTests);

module.exports = router;