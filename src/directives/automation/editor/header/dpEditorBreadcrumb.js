(function () {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .directive('dpEditorBreadcrumb', dpEditorBreadcrumb);

  dpEditorBreadcrumb.$inject = [
    '$rootScope',
    '$window',
    'automation',
    'AUTOMATION_STATE',
    'CHANGE_TYPE',
    'changesManager',
    '$q',
    'optionsListDataservice',
  ];

  function dpEditorBreadcrumb(
    $rootScope,
    $window,
    automation,
    AUTOMATION_STATE,
    CHANGE_TYPE,
    changesManager,
    $q,
    optionsListDataservice
  ) {
    var directive = {
      restrict: 'AE',
      templateUrl:
        'angularjs/partials/automation/editor/directives/header/dp-editor-breadcrumb.html',
      link: link,
    };

    return directive;

    function link(scope, element) {
      var onBlurPromise;
      scope.exitOptions = optionsListDataservice.getExitOptions();
      scope.isOpen = false;
      if (scope.rootComponent.name === '') {
        element.find('input')[0].focus();
      }

      angular.forEach(element.find('a'), function (anchor) {
        angular.element(anchor).bind('contextmenu', function () {
          if (
            changesManager.getUnsavedChanges() &&
            scope.rootComponent.state !== AUTOMATION_STATE.ACTIVE
          ) {
            automation.saveChanges().then(function () {
              $rootScope.$broadcast('UPDATE_SAVING_STATE');
            });
          }
        });
      });

      function setDefaultNameIfEmpty() {
        return automation.getAutomationName().then(function (response) {
          scope.rootComponent.name = response;
        });
      }

      function addBreadcrumChange(newValue, oldValue) {
        changesManager.add({
          type: CHANGE_TYPE.AUTOMATION_NAME,
          uid: scope.rootComponent.uid,
          parentUid: scope.rootComponent.uid,
          key: 'name',
          oldValue: angular.copy(oldValue),
          newValue: angular.copy(newValue),
        });
      }

      scope.onFocusBreadcrum = function () {
        scope.breadcrumOldValue = scope.rootComponent.name;
      };

      scope.onBlurBreadcrum = function (newValue, reset) {
        if (!onBlurPromise || reset) {
          onBlurPromise = $q.defer();
        } else {
          return onBlurPromise.promise;
        }

        if (!newValue.length) {
          setDefaultNameIfEmpty().then(function () {
            addBreadcrumChange(
              scope.rootComponent.name,
              scope.breadcrumOldValue
            );
            onBlurPromise.resolve();
          });
        } else if (newValue !== scope.breadcrumOldValue) {
          addBreadcrumChange(newValue, scope.breadcrumOldValue);
          onBlurPromise.resolve();
        }
        // TO DO: this was a fix for FF name was showing cut, this is having issues in MAC please retest this when enabling
        // var automationNameInput = document.getElementById('automation-name');
        // setCaretPosition(automationNameInput, 0);
        return onBlurPromise.promise;
      };

      scope.$on('AUTOMATION_NAME_FOCUS', function () {
        element.find('input')[0].focus();
      });

      scope.closeDropdown = function () {
        scope.isOpen = false;
      };

      scope.toogleExitOptions = function () {
        scope.isOpen = !scope.isOpen;
      };
    }
  }
})();
