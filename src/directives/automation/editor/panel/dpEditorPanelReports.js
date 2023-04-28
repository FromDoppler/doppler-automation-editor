(function () {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .directive('dpEditorPanelReports', dpEditorPanelReports);

  dpEditorPanelReports.$inject = [
    'automationReportsService',
    'automation',
    'selectedElementsService',
    'COMPONENT_TYPE',
    '$rootScope',
  ];

  function dpEditorPanelReports(
    automationReportsService,
    automation,
    selectedElementsService,
    COMPONENT_TYPE,
    $rootScope
  ) {
    var directive = {
      restrict: 'AE',
      templateUrl:
        'angularjs/partials/automation/editor/directives/panel/dp-editor-panel-reports.html',
      link: link,
    };

    return directive;

    function link(scope) {
      scope.getFullReportLink = function (idModel, idAction) {
        var url =
          '/Automation/ReportTask/Index?showAll=true&idScheduledTask=' +
          idModel;
        if (idAction) {
          url += '&idAction=' + idAction;
        }

        return url;
      };

      scope.$watch(
        selectedElementsService.getSelectedComponent,
        function (newComponent) {
          if (newComponent && newComponent.type === COMPONENT_TYPE.CAMPAIGN) {
            getReport(scope, newComponent.id);
          } else {
            getReport(scope);
          }
        }
      );
    }

    function getReport(scope, campaignId) {
      var model = automation.getModel();
      automationReportsService
        .getSummaryResults(model.id, campaignId)
        .then(function (data) {
          data.id = model.id;
          scope.reports = data;
          $rootScope.pausedDate = data.pausedOn;
          $rootScope.stoppedDate = data.pausedOn;
        });
    }
  }
})();
