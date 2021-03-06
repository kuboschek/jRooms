'use strict';

angular.module('jRoomsApp')
  .controller('AdminCtrl', function ($rootScope, $scope, $location, State, Communicator) {
    $scope.pageReady = false;

  	$scope.nextPhaseId = 1;
    $scope.showImportSettings = false;
    $scope.showEditUser = false;
    $scope.isImportingUsers = false;
    $scope.editUserString = '';
    $scope.editUser = {};
    $scope.importJSONString = '';

  	$scope.settings = {
  		isDatabaseReady : false,
      isDebug: false,
  		tallPeople: '',
  		disabledRooms: '',
      disabledUsers: '',
      whitelistUsers: '',
      maxRooms: 7,
  		email: {
  			preference1: false,
  			preference2: false,
  			preference3: false,
  			preference4: false
  		},
      collegeGame: {
        Krupp: 0,
        Mercator: 0,
        C3: 0,
        Nordmetall: 0
      },
  		phases: []
  	};

  	Communicator.currentSettings(function(err, settings) {
      if (!err && settings) {
        console.log(settings);
        $scope.settings = settings;
        $scope.pageReady = true;

        if (settings.phases.length > 0) {
          $scope.nextPhaseId = _.max(settings.phases, function(phase) { return phase.id; }).id + 1;
        }
      }
      else {
        $rootScope.showAlert({
          type: 'danger',
          msg: 'Oh oh! ' + err.error
        });
      }
    });

    $scope.setDebug = function(val) {
      $scope.settings.isDebug = val;
      $scope.updateSettings();
    }

  	$scope.updateSettings = function() {
      Communicator.updateSettings($scope.settings, function(err, smth) {
        if (!err) {
          $rootScope.showAlert({
            type: 'success',
            msg: 'Successfully saved!'
          });
        } 
        else {
          $rootScope.showAlert({
            type: 'danger',
            msg: 'Oh oh! ' + err.error
          });
        }
      });
  	};

  	$scope.importUsers = function() {
     $scope.isImportingUsers = true;
  	 Communicator.importUsers(function(err, data) {
        $scope.isImportingUsers = false;
        if (!err) {
          $scope.settings.isDatabaseReady = true;
          $rootScope.showAlert({
            type: 'success',
            msg: 'Successfully imported users from OpenJUB!'
          });
        }
        else {
          $rootScope.showAlert({
            type: 'danger',
            msg: 'Oh oh! ' + err.error
          });
        }
     });
    };

  	$scope.addPhase = function() {
      if(!$scope.settings.phases) {
        $scope.settings.phases = [];
      }
  		$scope.settings.phases.push({
  			id: $scope.nextPhaseId,
  			name: 'New phase',
  			from: '',
  			to: '',
        isCollegePhase: false,
  			filters: {
	  			enableFilterTall: false,
          enableFilterColleges: false,
	  			enableFilterExchange: false,
          enableFilterPoints: false,
          enableFilterRooms: false,
          enableFilterQuiet: false,
          enableFilterWhitelist: false,

          pointsMin: '',
          pointsMax: '',

          whitelist: '',

          colleges: {
            krupp: false,
            mercator: false,
            nordmetall: false,
            c3: false
          },

          rooms: {
            single: false,
            double: false,
            triple: false
          }
	  		}
  		});

      ++$scope.nextPhaseId;
  	}

    $scope.endAllocation = function() {
      Communicator.endAllocation(function(err, data) {
        if (!err) {
          $rootScope.showAlert({
              type: 'success',
              msg: 'Successfully terminated the active phase!'
            });
        }
        else {
          $rootScope.showAlert({
              type: 'danger',
              msg: 'Oh oh! ' + err.error
            });
        }
      });
    }

    $scope.collegePhaseSelected = function(id) {
      var phase = _.find($scope.settings.phases, function(val) {
        if (val.id == id) return true;
      });

      if (phase.isCollegePhase) {
        phase.filters.enableFilterTall = false;
        phase.filters.enableFilterColleges = false;
        phase.filters.enableFilterExchange = false;
        phase.filters.enableFilterPoints = false;
        phase.filters.enableFilterRooms = false;
        phase.filters.enableFilterQuiet = false;
      }
    }

  	$scope.removePhase = function(e, id) {
      e.preventDefault();
      e.stopPropagation();

      $scope.settings.phases = _.reject($scope.settings.phases, function(val) {
        if (val.id == id) return true;
        return false;
      });
  	}

    $scope.forcePhase = function(id) {
      console.log(id);
      Communicator.forcePhase(id, function(err, data) {
        if (!err) {
            $rootScope.showAlert({
              type: 'success',
              msg: 'Successfully set the active phase!'
            });
        }
        else {
          $rootScope.showAlert({
            type: 'danger',
            msg: 'Oh oh! ' + err.error
          });
        }
      })
    }

    $scope.editUserToggle = function() {
      $scope.showEditUser = !$scope.showEditUser;

      if ($scope.showEditUser) {
        Communicator.getUser($scope.editUserString, function(err, user) {
          if (!err) {
            $scope.editUser = user;
          }
          else {
            $rootScope.showAlert({
              type: 'danger',
              msg: 'Oh oh! ' + err.error
            });
          }
        });
      }
    }

    $scope.editUserSubmit = function() {
      Communicator.setUser($scope.editUserString, $scope.editUser, function(err, smth) {
        if (!err) {
          $rootScope.showAlert({
            type: 'success',
            msg: 'Modifications to the user have been saved in the database!'
          });
        }
        else {
          $rootScope.showAlert({
            type: 'danger',
            msg: 'Oh oh! ' + err.error
          });
        }

        $scope.showEditUser = false;
        $scope.editUserString = '';
      });
    }

  	$scope.exportSettingsURL = function() {
      // Works nicest in Firefox, Chrome, Opera.
      var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify($scope.settings));
      return 'data:'+data;
    }

    $scope.importSettingsToggle = function() {
  	  $scope.showImportSettings = !$scope.showImportSettings;
  	}

    $scope.importSettingsSubmit = function() {
      $scope.showImportSettings = false;

      var obj;
      try {
        obj = JSON.parse($scope.importJSONString);
      }
      catch (syntaxError) {
        $rootScope.showAlert({
          type: 'danger',
          msg: 'Oh oh! Got a syntax error, while trying to parse the JSON, that you provided! Please, be super careful with what you import here as it might corrupt the state of the entire server.'
        });
        return;
      }

      $scope.settings = obj;
      $scope.updateSettings();
      $scope.importJSONString = '';
    }

  	$scope.resetSystem = function() {
      Communicator.resetSystem(function(err, settings) {
        if (!err && settings) {
          $scope.settings = settings;
          $rootScope.showAlert({
            type: 'success',
            msg: 'Successfully reset everything. Good luck next year, I suppose.'
          });
        }
        else {
           $rootScope.showAlert({
            type: 'danger',
            msg: 'Oh oh! ' + err.error
          });
        }
      });
  	}
  });
