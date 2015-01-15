'use strict';

var express = require('express');
var controller = require('./summoners.controller');

var router = express.Router();

router.get('/', controller.index);
router.post('/', controller.getInfo);

module.exports = router;