(function () {
  'use strict';

  angular
    .module('dopplerApp')
    .controller(
      'ModalSendMaxSubscribersEmailCtrl',
      ModalSendMaxSubscribersEmailCtrl
    );

  ModalSendMaxSubscribersEmailCtrl.$inject = [
    '$scope',
    'close',
    'headerService',
    'data',
  ];

  function ModalSendMaxSubscribersEmailCtrl(
    $scope,
    close,
    headerService,
    data
  ) {
    $scope.data = [];
    $scope.isShowTextarea = false;
    $scope.domain = data.urlbase;
    $scope.isSendEmail = false;
    $scope.buttonsDisabled = false;
    activate();

    function fixDataForSelect() {
      angular.forEach($scope.data.QuestionsList, function (value, key) {
        value.name = 'question' + key;
        if (value.Answer.AnswerType === 4) {
          var optionList = [];
          angular.forEach(value.Answer.AnswerOptions, function (option, index) {
            var text = option;
            optionList[index] = { text: text };
          });
          value.Answer.AnswerOptions = optionList;
        } else if (value.Answer.AnswerType === 5) {
          value.Answer.Value = value.Answer.AnswerOptions[0];
        }
      });
    }

    function setModelValues() {
      angular.forEach($scope.data.QuestionsList, function (value, key) {
        if (value.Answer.AnswerType === 2 || value.Answer.AnswerType === 3) {
          value.Answer.Value = '';
          angular.forEach(value.Answer.List, function (option, index) {
            value.Answer.Value += value.Answer.AnswerOptions[index] + ' - ';
            if (
              value.Answer.AnswerType === 3 &&
              index === value.Answer.AnswerOptions.length - 1
            ) {
              $scope.data.QuestionsList[key].Answer.Value +=
                $scope.data.QuestionsList[key].Answer.Text + ' - ';
            }
          });
        }
        if (value.Answer.AnswerType === 4) {
          var optionList = [];
          angular.forEach(value.Answer.AnswerOptions, function (option, index) {
            optionList[index] = option.text;
          });
          $scope.data.QuestionsList[key].Answer.AnswerOptions = optionList;
        }
      });
    }

    function activate() {
      headerService
        .getMaxSubscribersData($scope.domain)
        .then(function (result) {
          $scope.data = result;
          fixDataForSelect();
        });
    }

    $scope.toggleTextarea = function () {
      $scope.isShowTextarea = !$scope.isShowTextarea;
    };

    $scope.sendEmail = function () {
      if ($scope.validationForm.$valid) {
        setModelValues();
        headerService.saveMaxSubscribersData($scope.data, $scope.domain);
        $scope.isSendEmail = true;
      } else {
        $scope.buttonsDisabled = false;
      }
    };

    $scope.close = function (result) {
      close(result);
    };

    $scope.someSelected = function (object) {
      var selected = false;
      angular.forEach(object, function (value) {
        if (value === true) {
          selected = value;
        }
      });
      return selected;
    };
  }
})();
