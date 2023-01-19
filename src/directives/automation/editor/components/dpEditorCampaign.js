(function() {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .directive('dpEditorCampaign', dpEditorCampaign);

  dpEditorCampaign.$inject = [
    '$rootScope',
    '$timeout',
    'ModalService',
    'automation',
    'conditionsDataservice',
    'settingsService',
    'actionsDataservice',
    'AUTOMATION_TYPE',
    'templatesService',
    'selectedElementsService',
    'changesManager',
    'CONTENT_TYPE'
  ];

  function dpEditorCampaign($rootScope, $timeout, ModalService, automation, conditionsDataservice, settingsService,
    actionsDataservice, AUTOMATION_TYPE, templatesService, selectedElementsService, changesManager,
    CONTENT_TYPE) {
    var directive = {
      restrict: 'E',
      scope: {
        branch: '=',
        component: '='
      },
      templateUrl: 'angularjs/partials/automation/editor/directives/components/dp-editor-campaign.html',
      link: link
    };

    return directive;

    function link(scope) {
      scope.showRemoveCampaignConfirmation = false;
      scope.$on('AUTOMATION_SAVED', function() {
        scope.component.hasUnsavedChanges = false;
        if (scope.component.thumbnailUrl !== ""){
          $timeout(function() {
            scope.component.thumbnailUrl = (scope.component.thumbnailUrl.indexOf("?") > 0)?
              scope.component.thumbnailUrl.replace(/([^?]*$)/, Math.random().toString().split('.')[1]):
              scope.component.thumbnailUrl.concat("?").concat(Math.random().toString().split('.')[1]);
          }, 1000);
        }
      });
      settingsService.getSettings().then(function(response) {
        scope.settings = response;
      });

      scope.openPreview = function(campaign) {
        if (!automation.getIsProcessing()) {
          automation.setIsProcessing(true);
          automation.getHtmlContentForPreview(campaign.id).then(function(htmlResult) {
            showPreviewModal(campaign, htmlResult);
            campaign.previewHtml = htmlResult;
            automation.setIsProcessing(false);
          });
        }
      };

      scope.viewOnline = function(viewOnlineLink) {
        if (automation.isReadOnly()) {
          return window.open(viewOnlineLink, '_blank');
        }
        automation.saveChanges().then(function() {
          $rootScope.$broadcast('UPDATE_SAVING_STATE');
          window.open(viewOnlineLink, '_blank');
        });
      };

      scope.editContent = function (campaign) {
        if (!campaign.id) {
          return;
        }
        if (changesManager.getUnsavedChanges()) {
          automation.setIsProcessing(true);
          automation.saveChanges().then(function () {
            $rootScope.$broadcast('UPDATE_SAVING_STATE');
            automation.setIsProcessing(false);
            editContentCampaign(campaign);
          });
        } else {
          editContentCampaign(campaign);
        }
      };

      scope.canEdit = function () {
        return !automation.isReadOnly() || automation.isPaused();
      };

      scope.canBeRemoved = function() {
        scope.showDeleteWarning = conditionsDataservice.isEmailLinkedToConditional(scope.component.uid) ||
          actionsDataservice.isEmailReferenced(scope.component.uid);
        return !scope.showDeleteWarning;
      };

      scope.isDynamicCampaign = function() {
        return scope.component.campaignType === AUTOMATION_TYPE.ABANDONED_CART
          || scope.component.campaignType === AUTOMATION_TYPE.VISITED_PRODUCTS;
      };

      scope.urlTimeStamp = function() {
        return scope.component.thumbnailUrl;
      };

      scope.isAbandonedCart = function() {
        return scope.component.campaignType === AUTOMATION_TYPE.ABANDONED_CART;
      };

      scope.isProductRetargeting = function() {
        return scope.component.campaignType === AUTOMATION_TYPE.VISITED_PRODUCTS;
      };

      scope.$on('DELETE_COMPONENT_SHOW_CONFIRMATION', function() {
        scope.showOnlyDeleteIcon = true;
      });

      scope.$on('DELETE_COMPONENT_HIDE_CONFIRMATION', function() {
        scope.showOnlyDeleteIcon = false;
        scope.showRemoveCampaignConfirmation = false;
      });

      function showPreviewModal(campaign, html) {
        ModalService.showModal({
          templateUrl: 'angularjs/partials/shared/preview.html',
          controller: 'PreviewCtrl',
          inputs: {
            data: {
              templateId: campaign.id,
              isPublic: false,
              html: html
            }
          }
        });
      }

      function editContentCampaign(campaign) {
        selectedElementsService.setSelectedComponent(campaign);
        if (!automation.getIsProcessing()) {
          switch (campaign.contentType) {
            case CONTENT_TYPE.TINY_EDITOR:
              callParentMethod(scope, "toogleTinyEditorView", true);
              break;
            case CONTENT_TYPE.TEMPLATE:
              window.location.href = templatesService.getEditorCampaignUrl(campaign.id, campaign.editorType);
              break;
            case CONTENT_TYPE.IMPORT:
              callParentMethod(scope, "toggleImportHtmlView", true);
              break;
            default:
          }
        }
      }

      //iteractive function to get a parent method inside at the scope
      function callParentMethod(element, method, value) {
        var parent = element.$parent;
        if (!parent) {
          return null;
        }
        if (parent[method] && typeof parent[method] === 'function') {
          return parent[method](value);
        }
        callParentMethod(parent, method, value);
      }
    }
  }
})();
