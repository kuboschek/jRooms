'use strict';

var _ = require('lodash');
var Phase = require('./phase.model');
var User = require('./../user/user.model');

var isEligible = function(item, round, callback) {
  var status = true;
  User.findOne({token: item}).exec(function(err, user) {
    if(err || !user) {
      status = false;
    }

    round.isEligible = status;
    callback(round);
  });
}

exports.currentPhase = function(req, res) {

  Phase.findOne({isCurrent: true}).exec(function(err, data) {
    if(err || !data) {
      return res.json(500, err);
    }

    data.isEligible = isEligible(req.cookies.token, data, function(new_data) {
      res.json(200, new_data);
    });
  });

  /*return res.json(200, {
    id: 1,
    name: 'Testphase',
    from: '11.11.2011',
    to: '12.11.2011',
    isCollegePhase: false,
    isEligible: isEligible(),
    maxRooms: 7,
    next: '13.11.2011', //'none' if done with phases
    filters: {
      // enableFilterTall: false,
      // enableFilterColleges: false,
      // enableFilterExchange: false,
      // enableFilterPoints: false,
      // enableFilterRooms: false,

      // pointsMin: '',
      // pointsMax: '',

      // colleges: {
      //   krupp: false,
      //   mercator: false,
      //   nordmetall: false,
      //   c3: false
      // },

      // rooms: {
      //   one: false,
      //   two: false,
      //   three: false
      // }
    }
  });*/
}

exports.result = function(req, res) {
  var phaseId = req.query.phaseId;

  return res.json(200, {
    phaseId: phaseId,
    results: [
      'bla',
      'herp',
      'derp'
    ]
  });
}

exports.allResults = function(req, res) {
  return res.json(200, [
  {
    phaseId: 1,
    results: [
      'bla',
      'herp',
      'derp'
    ]
  },
  {
    phaseId: 2,
    results: [
      'john',
      'doe',
      'derb'
    ]
  }]);
}