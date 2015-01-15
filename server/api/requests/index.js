'use strict';

var express = require('express');
var controller = require('./requests.controller');
var Summoner = require('./requests.model');

var router = express.Router();

router.get('/', controller.index);

module.exports = router;