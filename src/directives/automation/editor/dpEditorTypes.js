(function() {
  'use strict';

  angular
    .module('dopplerApp')
    .directive('dpEditorTypes', dpEditorTypes);

  dpEditorTypes.$inject = [
    'automation',
    'taskService',
    'ModalService',
    'selectedElementsService',
    '$rootScope',
    'AUTOMATION_TYPE_IDS',
    '$window'
  ];

  function dpEditorTypes(automation, taskService, ModalService, selectedElementsService,
    $rootScope, AUTOMATION_TYPE_IDS, $window) {
    var directive = {
      restrict: 'E',
      link: link,
      templateUrl: 'angularjs/partials/automation/editor/directives/dp-editor-types.html'
    };

    return directive;

    function link(scope) {
      scope.types = [];
      scope.isLoading = true;
      scope.integrationsListLength = 0;
      automation.updateAutomationFlowState();
      automation.load(0);

      taskService.getAutomationTypeList()
        .then(function(data) {
          scope.types = data;
          scope.isLoading = false;
        });

      scope.showPopup = function() {
        ModalService.showModal({
          templateUrl: 'angularjs/partials/automation/siteBehaviorModal.html',
          controller: 'ModalYesOrNoCtrl',
          inputs: { data: {} }
        })
          .then(function(modal) {
            modal.close.then(function(response) {
              if (response) {
                taskService.activateSiteBehavior()
                  .then(function(){
                    ModalService.showModal({
                      templateUrl: 'angularjs/partials/automation/siteBehaviorDomainsModal.html',
                      controller: 'ModalYesOrNoCtrl',
                      inputs: { data: {} }
                    });
                  });
              }
            });
          });
      };

      scope.selectAutomationType = function(type, status) {
        if (status === 'active') {
          scope.selectedType = type;
          scope.buildAutomation();
        }
      };

      scope.buildAutomation = function() {
        automation.buildAutomation(scope.selectedType);
        automation.saveChanges().then(function(response){
          $window.location.href = '/Automation/EditorConfig?idScheduledTask=' + response.data.id + '&automationType=' +  automation.getAutomationType(parseInt(scope.selectedType));
        });
      };
      scope.integrationsList = function(automationType) {
        var result = [];
        switch (automationType) {
        case AUTOMATION_TYPE_IDS.ABANDONED_CART.toString():
          result = $rootScope.thirdPartyAppsConnected.filter(function(val) {
            return val.AbandonedCartEnabled === true;
          });
          break;
        case AUTOMATION_TYPE_IDS.VISITED_PRODUCTS.toString():
          result = $rootScope.thirdPartyAppsConnected.filter(function(val) {
            return val.VisitedProductsEnabled === true;
          });
            break;
          case AUTOMATION_TYPE_IDS.PENDING_ORDER.toString():
            result = $rootScope.thirdPartyAppsConnected.filter(function (val) {
              return val.PendingOrderEnabled === true;
            });
            break;
          case AUTOMATION_TYPE_IDS.CONFIRMATION_ORDER.toString():
            result = $rootScope.thirdPartyAppsConnected.filter(function (val) {
              return val.ConfirmationOrderEnabled === true;
            });
            break;
        default:
          return false;
        }
        scope.integrationsListLength = result.length;
        return result;
      };
    }
  }
})();
