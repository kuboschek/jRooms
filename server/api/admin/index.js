'use strict';

var express = require('express');
var controller = require('./admin.controller');

var router = express.Router();

router.get('/importUsers', controller.importUsers);
router.get('/currentSettings', controller.currentSettings);
router.post('/addFoundationYears', controller.addFoundationYears);
router.post('/updateSettings', controller.updateSettings);
router.get('/getUser', controller.getUser);
router.post('/setUser', controller.setUser);
router.get('/importUsers', controller.importUsers);
router.get('/resetSystem', controller.resetSystem);
router.post('/forcePhase', controller.forcePhase);
router.post('/cancelForce', controller.cancelForce);
router.post('/endAllocation', controller.endAllocation);

module.exports = router;