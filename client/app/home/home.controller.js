'use strict';

angular.module('jRoomsApp')
  .controller('HomeCtrl', function ($scope, $location, State, Communicator) {
    $scope.alerts = [];

    $scope.user = {};
    $scope.requestUsername = '';
    $scope.colleges = ['Krupp', 'Nordmetall', 'Mercator', 'C3'];
    $scope.rooms = [''];
    $scope.maxRooms = [];

    $scope.currentPhase = {};
    $scope.showNotEligible = false;
    $scope.showCollegeSelection = false;
    $scope.showRoomSelection = false;
    $scope.showDone = false;
    $scope.showError = false;

  	$scope.$watch(State.user, function(val) {
        if (val && val.username) {
          $scope.user = val;
        }
        else {
          $scope.user = {};
        }
    }, true);

    Communicator.currentPhase(function(err, phase) {
      if (!err) {
        $scope.currentPhase = phase;

        if (!phase.isEligible) {
          if (phase.next == 'none') {
            $scope.showDone = true;
          }
          else {
            $scope.showNotEligible = true;
          }
        }
        else {
          if (phase.isCollegePhase) {
            $scope.showCollegeSelection = true;
          }
          else {
            $scope.rooms = new Array(phase.maxRooms);
            $scope.maxRooms = _.range(0, phase.maxRooms);

            $scope.showRoomSelection = true;
          }
        }
      }
      else {
        $scope.showError = true;
      }
    });

    $scope.requestRoommate = function() {
      //console.log("Sending request to " + $scope.requestUsername);
      Communicator.requestRoommate($scope.requestUsername, function(err, data) {
        if (!err && data) {
          $scope.alerts.push({
            type: 'success',
            msg: 'Successfully sent the roommate request to ' + $scope.requestUsername + '!'
          });
        }
        else {
          $scope.alerts.push({
            type: 'danger',
            msg: 'Oh oh! Server returned an error while sending a roommate request!'
          });
        }

        $scope.requestUsername = '';
      });
    }

    $scope.acceptRoommate = function(cid) {
      //console.log("Accepting request from " + cid);
      Communicator.acceptRoommate(cid, function(err, data) {
        if (!err && data) {
          $scope.alerts.push({
            type: 'success',
            msg: 'Successfully accepted a roommate request!'
          });
        }
        else {
           $scope.alerts.push({
            type: 'danger',
            msg: 'Oh oh! Server returned an error while accepting a roommate request!'
          });
        }
      });
    }

    $scope.denyRoommate = function(cid) {
      //console.log("Denying request from " + cid);
      Communicator.denyRoommate(cid, function(err, data) {
        if (!err && data) {
          $scope.alerts.push({
            type: 'success',
            msg: 'Successfully denied the roommate request!'
          });
        }
        else {
           $scope.alerts.push({
            type: 'danger',
            msg: 'Oh oh! Server returned an error while denying the roommate request!'
          });
        }
      });
    }

    $scope.updateColleges = function() {
      if ($scope.colleges.length != _.uniq($scope.colleges).length) {
        $scope.alerts.push({
          type: 'danger',
          msg: 'Oh oh! Please, make sure that you didn\'t select the same college twice!'
        });
        return;
      }

       Communicator.updateColleges($scope.colleges, function(err, data) {
        if (!err && data) {
          $scope.alerts.push({
            type: 'success',
            msg: 'Successfully updated colleges!'
          });
        }
        else {
         $scope.alerts.push({
            type: 'danger',
            msg: 'Oh oh! Server returned an error while updating college selections!'
          });
        return;
        }
      });

    }

    $scope.updateRooms = function() {
      //console.log($scope.rooms);
      Communicator.updateRooms($scope.rooms, function(err, data) {
        if (!err && data) {
           $scope.alerts.push({
            type: 'success',
            msg: 'Successfully updated rooms!'
          });
        }
        else {
           $scope.alerts.push({
            type: 'danger',
            msg: 'Oh oh! Server returned an error while updating room selections!'
          });
        }
      });
    }

  });
