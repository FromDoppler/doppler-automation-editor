
(function() {
  'use strict';

  angular
    .module('dopplerApp.controlPanel')
    .controller('SubscribersScoringPreferencesCtrl', SubscribersScoringPreferencesCtrl);

  SubscribersScoringPreferencesCtrl.$inject = [
    '$scope',
    '$translate',
    'subscribersScoringService'
  ];

  function SubscribersScoringPreferencesCtrl($scope, $translate, subscribersScoringService) {
    $scope.isLoading = true;
    $scope.errorValues = false;
    subscribersScoringService.getScoringPreferences()
      .then(function(response) {
        $scope.scores = response.data.Scores.reverse();
        $scope.scoringValues = $scope.loadValues(1, 1000);
        $scope.periodValues = $scope.loadValues(1, 6);
        $scope.periodSelectedValue = response.data.ScoringPeriod;
        $scope.totalStars = response.data.Scores.length;
        $scope.isLoading = false;
        $scope.disableButton = false;
      });

    $scope.loadValues = function(since, to) {
      var values = [];
      for (var i = since; i <= to; i++) {
        values.push({
          label: String(i),
          value: i
        });
      }

      return values;
    };

    $scope.goBack = function() {
      window.location = '/ControlPanel/ControlPanel?section=CampaignsPreferences';
    };

    $scope.onValueSelected = function(index, value, flag, isLastIndex) {
      if (!isLastIndex) {
        if (value > 0 && value <= 1000) {
          $scope.scores[index][flag] = value;
        }
      }
    };

    $scope.onPeriodSelected = function(value) {
      if (value > 0 && value <= 6) {
        $scope.periodSelectedValue = value;
      }
    };

    $scope.validError = function() {
      $scope.disableButton = false;
      angular.forEach($scope.scores, function(value) {
        if (value.error){
          $scope.disableButton = true;
        }
      });
    };

    $scope.saveScoringPreferences = function() {
      if (!$scope.errorValues) {
        $scope.isLoading = true;
        var scoringInformation = {
          ScoringPeriod: $scope.periodSelectedValue,
          Active: true,
          Scores: $scope.scores
        };
        subscribersScoringService.saveScoringPreferences(scoringInformation)
          .then(function(response) {
            if (response.success) {
              $scope.goBack();
            } else {
              $scope.isLoading = false;
            }
          });
      }
    };
  }
})();
