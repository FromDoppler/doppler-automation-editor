(function() {
  'use strict';

  angular
    .module('dopplerApp')
    .directive('dpCreateList', dpCreateList);

  dpCreateList.$inject = [
    'listService',
    'selectedElementsService',
    'settingsService',
    '$translate',
    'utils',
    '$q'
  ];

  function dpCreateList(listService, selectedElementsService, settingsService, $translate, utils, $q) {
    var directive = {
      restrict: 'E',
      link: link,
      templateUrl: 'angularjs/partials/automation/editor/directives/dp-create-list.html'
    };

    return directive;

    function link(scope) {
      var listPromises = [];
      scope.REGEX_EMAIL = utils.REGEX_EMAIL;
      settingsService.getSettings().then(function(response) {
        scope.maxSubsInList = parseInt(response.sendTestMaxSubsInList);
      });

      scope.list = {
        ListName: '',
        SubscribersList: [{
          Email: '',
          Firstname: '',
          IdSubscriber: '0',
          Lastname: ''
        }]
      };

      scope.addSubscriberList = function() {
        if (scope.list.SubscribersList.length >= scope.maxSubsInList) {
          return;
        }

        scope.list.SubscribersList.push({
          Email: '',
          FirstName: '',
          IdSubscriber: '0',
          LastName: ''
        });
      };

      scope.removeSubscriptList = function(index) {
        scope.list.SubscribersList.splice(index, 1);
      };

      scope.createList = function() {
        var selectedComponent = selectedElementsService.getSelectedComponent();
        $q.all(listPromises).then(function() {
          if (scope.validationForm.$valid) {
            listService.createList(scope.list).then(function(data) {
              if (data.success) {
                utils.assign(selectedComponent, 'idList', data.idListCreated);
                scope.toggleCreateListTemplate(false);
              } else {
                scope.createListFailedMsg = data.errorMessage;
                scope.validationForm['listName'].$setValidity('createListFailed', data.success);
              }
            });
          }
        });
      };

      scope.getMaxSubscriberLabel = function() {
        return $translate.instant('automation_editor.create_list.footer_tip').replace('%1', scope.maxSubsInList);
      };

      scope.validateSubscriber = function(index) {
        var row = scope.list.SubscribersList[index];
        var promise;

        if (!row.Email) {
          return;
        }

        var duplicateEmail = _.find(scope.list.SubscribersList, function(subscriber, i) {
          if (i !== index) {
            return subscriber.Email === row.Email;
          }
        });

        scope.validationForm['Email' + index].$setValidity('duplicateEmail', !duplicateEmail);

        promise = listService.autocompleteUser(row.Email);
        listPromises.push(promise);
        promise.then(function(data) {
          scope.validationForm['Email' + index].$setValidity('unsubscribedUser', data.success);
          scope.unsubscribedUserMsg = !data.success ? data.errorMessage : '';
          if (data.SubscriberModel && data.SubscriberModel.IdSubscriber) {
            row.Firstname = data.SubscriberModel.FirstName;
            row.Lastname = data.SubscriberModel.LastName;
          }
          removePromise(promise);
        });
      };

      scope.validateListName = function(listName) {
        var promise = listService.validateListName(listName);
        listPromises.push(promise);
        promise.then(function(data) {
          scope.validationForm['listName'].$setValidity('duplicateListName', data.success);
          removePromise(promise);
        });
      };

      scope.isValidForm = function() {
        if (!scope.submitted) {
          return true;
        }

        return scope.validationForm.$valid;
      };

      function removePromise(promiseToRemove) {
        _.remove(listPromises, function(promise) {
          return promise === promiseToRemove;
        });
      }
    }
  }
})();
