'use strict';

var express = require('express');
var controller = require('./phase.controller');

var router = express.Router();

// Stubs
router.get('/current', controller.currentPhase);
router.get('/result', controller.result);
router.get('/allResults', controller.allResults);
router.get('/csv', controller.csv);
router.get('/unallocated', controller.unallocated);

module.exports = router;