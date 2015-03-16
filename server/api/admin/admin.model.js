'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var AdminSchema = new Schema({
	isDatabaseReady : Boolean,
	tallPeople: String,
	disabledRooms: String,
	disabledUsers: String,
	maxRooms: Number,
	email: Object,
	phases: Array
});

module.exports = mongoose.model('Admin', AdminSchema);