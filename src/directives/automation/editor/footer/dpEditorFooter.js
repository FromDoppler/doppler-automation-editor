(function() {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .directive('dpEditorFooter', dpEditorFooter);

  dpEditorFooter.$inject = [
    '$rootScope',
    'automation',
    'AUTOMATION_STATE',
    'AUTOMATION_TYPE',
    'changesManager',
    'COMPONENT_TYPE',
    'selectedElementsService',
    'ModalService',
    'settingsService',
    'LIST_SELECTION_STATE',
    'AUTOMATION_COMPLETED_STATE',
    '$translate'
  ];

  function dpEditorFooter($rootScope, automation, AUTOMATION_STATE, AUTOMATION_TYPE, changesManager, COMPONENT_TYPE,
    selectedElementsService, ModalService, settingsService, LIST_SELECTION_STATE, AUTOMATION_COMPLETED_STATE,
    $translate) {
    var directive = {
      restrict: 'E',
      templateUrl: 'angularjs/partials/automation/editor/directives/footer/dp-editor-footer.html',
      link: link
    };

    function link(scope) {
      scope.isEnabled = false;
      scope.automationCompleted = false;
      scope.LIST_SELECTION_STATE = LIST_SELECTION_STATE;
      scope.AUTOMATION_COMPLETED_STATE = AUTOMATION_COMPLETED_STATE;

      automation.updateAutomationFlowState();

      settingsService.getSettings().then(function(response) {
        scope.isRegistrationCompleted = response.isRegistrationCompleted;
        scope.hasSmsCredit = response.hasSmsCredits;
      });

      scope.hasNotSmsCredits = function () {
        return !scope.hasSmsCredit && automation.hasSmsComponent();
      }

      scope.backToEditor = function() {
        scope.toggleListSelection(LIST_SELECTION_STATE.NONE);
      };

      scope.confirmListSelection = function() {
        var selectedComponent = selectedElementsService.getSelectedComponent();

        $rootScope.$broadcast(selectedComponent.type !== COMPONENT_TYPE.CONDITION ?
          'COMPONENT_LIST.CONFIRM_SELECTION' :
          'CONDITIONAL_LIST.CONFIRM_SELECTION');
        scope.backToEditor();
      };

      scope.startCampaignWithDynamicCheck = function() {
        var automationType = automation.getModel().automationType;
        if (automationType === AUTOMATION_TYPE.ABANDONED_CART
          || automationType === AUTOMATION_TYPE.VISITED_PRODUCTS
          || automationType === AUTOMATION_TYPE.PENDING_ORDER
          || automationType === AUTOMATION_TYPE.CONFIRMATION_ORDER) {
          automation.hasDynamicElement().then(function(result) {
            if (result) {
              scope.startCampaign();
            } else {
              ModalService.showModal({
                templateUrl: 'angularjs/partials/automation/noDynamicElementModal.html',
                controller: 'ModalNoDynamicElementCtrl',
                inputs: {
                  data: {
                    automationType: automationType
                  }
                }
              });
            }
          });
        } else {
          scope.startCampaign();
        }
      };

      $rootScope.startCampaign = function() {
        selectedElementsService.unsetSelectedComponent();
        if (scope.isRegistrationCompleted) {
          automation.setAutomationAsActive();
        } else {
          scope.showContentInformation().then(function(modal) {
            modal.close.then(function(response) {
              if (response === 'ok') {
                scope.isRegistrationCompleted = true;
                automation.setAutomationAsActive();
              }
            });
          });
        }
      };

      scope.stopCampaign = function() {
        ModalService.showModal({
          templateUrl: '/angularjs/partials/automation/stopAutomationModal.html',
          controller: 'ModalYesOrNoCtrl',
          inputs: { data: {} }
        })
          .then(function(modal) {
            modal.close.then(function(response) {
              if (response) {
                automation.setIsProcessing(true);
                automation.stopAutomationCampaign().then(function(res) {
                  scope.rootComponent.state = AUTOMATION_STATE.STOPPED;
                  if (res.data.campaigns && res.data.campaigns.length) {
                    automation.updateEmailsId(res.data.campaigns);
                    automation.saveChanges();
                  }
                  automation.setIsProcessing(false);
                  changesManager.enable();
                  selectedElementsService.enableService();
                  $rootScope.stoppedDate = res.data.stoppedDate;
                }, function() {
                  automation.setIsProcessing(false);
                });
              }
            });
          });
      };

      scope.$on('SUSCRIPTION_LIST.ENABLE_BUTTON', function() {
        scope.isEnabled = true;
      });

      scope.isFlowComplete = automation.getIsFlowComplete;


      scope.showContentInformation = function() {
        return ModalService.showModal({
          templateUrl: '/angularjs/partials/automation/completeInformation.html',
          controller: 'automationCompleteInformationCtrl'
        });
      };

      scope.getAutomationTipLabel = function() {
        var label;
        var isFlowComplete = scope.isFlowComplete();
        if (!scope.rootComponent) {
          return;
        }
        if (isFlowComplete === AUTOMATION_COMPLETED_STATE.WITH_DELETED_FIELDS ||
          isFlowComplete === AUTOMATION_COMPLETED_STATE.WITH_SITE_TRACKING_DISABLED ||
          isFlowComplete === AUTOMATION_COMPLETED_STATE.WITH_DELETED_DOMAIN ||
          isFlowComplete === AUTOMATION_COMPLETED_STATE.WITH_NON_VERIFIED_DOMAIN ||
          isFlowComplete === AUTOMATION_COMPLETED_STATE.WITH_NON_REGISTERED_DOMAIN){
          label = $translate.instant('automation_editor.footer.tip_state_error');
        } else if (scope.hasNotSmsCredits()) {
          label = $translate.instant('automation_editor.footer.tip_not_sms_credit');
        } else {
          label = $translate.instant('automation_editor.footer.tip_state_' + isFlowComplete);
        }
        return label;
      };

      scope.getAutomationBtnLabel = function() {
        var label;
        var isFlowComplete = scope.isFlowComplete();
        if (!scope.rootComponent) {
        	return;
        }
        if (scope.rootComponent.state !== AUTOMATION_STATE.ACTIVE) {
          if (isFlowComplete === AUTOMATION_COMPLETED_STATE.COMPLETE_WITH_WARNINGS) {
            label = $translate.instant('automation_editor.buttons.start_campaign_warning');
          } else if (scope.rootComponent.state === AUTOMATION_STATE.PAUSED) {
            label = $translate.instant('automation_editor.buttons.restart_campaign');
          } else if (scope.rootComponent.state === AUTOMATION_STATE.STOPPED) {
            label = $translate.instant('automation_editor.buttons.reactivate_campaign');
          } else {
            label = $translate.instant('automation_editor.buttons.start_campaign');
          }
          return label;
        }
      };

      scope.hasErrors = function() {
        return scope.isFlowComplete() === AUTOMATION_COMPLETED_STATE.WITH_DELETED_FIELDS ||
        scope.isFlowComplete() === AUTOMATION_COMPLETED_STATE.WITH_SITE_TRACKING_DISABLED ||
        scope.isFlowComplete() === AUTOMATION_COMPLETED_STATE.WITH_DELETED_DOMAIN ||
        scope.isFlowComplete() === AUTOMATION_COMPLETED_STATE.WITH_NON_VERIFIED_DOMAIN ||
        scope.isFlowComplete() === AUTOMATION_COMPLETED_STATE.WITH_NON_REGISTERED_DOMAIN ||
        scope.isFlowComplete() === AUTOMATION_COMPLETED_STATE.WITH_DEMO_EXPIRED ||
        scope.isFlowComplete() === AUTOMATION_COMPLETED_STATE.WITH_TRIAL_DISABLED ||
        scope.isFlowComplete() === AUTOMATION_COMPLETED_STATE.WITH_NON_INTEGRATION ||
          scope.isFlowComplete() === AUTOMATION_COMPLETED_STATE.WITH_TRIAL_EXPIRED;
      };

      scope.pauseCampaign = function() {
        ModalService.showModal({
          templateUrl: '/angularjs/partials/automation/pauseAutomationModal.html',
          controller: 'ModalYesOrNoCtrl',
          inputs: { data: {} }
        })
          .then(function(modal) {
            modal.close.then(function(response) {
              if (response) {
                automation.setIsProcessing(true);
                automation.pauseAutomationCampaign().then(function(res) {
                  scope.rootComponent.state = AUTOMATION_STATE.PAUSED;
                  if (res.data.campaigns && res.data.campaigns.length) {
                    automation.updateEmailsId(res.data.campaigns);
                    automation.saveChanges();
                  }
                  automation.setIsProcessing(false);
                  changesManager.enable();
                  selectedElementsService.enableService();
                  showPausedConfirmationModal();
                  $rootScope.pausedDate = res.data.pausedDate;
                });
              }
            });
          });
      };

      function showPausedConfirmationModal() {
        ModalService.showModal({
          templateUrl: '/angularjs/partials/automation/pauseAutomationMessageModal.html',
          controller: 'ModalYesOrNoCtrl',
          inputs: { data: {} }
        });
      }
    }

    return directive;
  }
})();
