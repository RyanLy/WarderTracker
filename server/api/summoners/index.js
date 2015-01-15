'use strict';

var express = require('express');
var controller = require('./summoners.controller');

var router = express.Router();

router.get('/', controller.index);
router.post('/', controller.getInfo);
router.get('/clear', controller.clear); // Should be a post request, but seems inconvenient

module.exports = router;