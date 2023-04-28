(function () {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .directive('dpEditorAction', dpEditorAction);

  dpEditorAction.$inject = [
    'ACTION_TYPE',
    'actionsDataservice',
    'FIELD_TYPE',
    '$translate',
  ];

  function dpEditorAction(
    ACTION_TYPE,
    actionsDataservice,
    FIELD_TYPE,
    $translate
  ) {
    var directive = {
      restrict: 'E',
      scope: {
        branch: '=',
        component: '=',
      },
      templateUrl:
        'angularjs/partials/automation/editor/directives/components/dp-editor-action.html',
      link: link,
    };

    function link(scope) {
      scope.ACTION_TYPE = ACTION_TYPE;
      scope.FIELD_TYPE = FIELD_TYPE;

      scope.format = $translate.instant('automation_editor.date_format');

      scope.formatDate = function (date) {
        return date ? moment(date).format(scope.format.toUpperCase()) : ' ';
      };

      scope.$on('CAMPAIGN.NAME_CHANGE', function (event, params) {
        if (scope.component.operation.email.uidEmail === params.uidEmail) {
          scope.component.operation.email.label = params.name;
        }
      });
      scope.deleteAction = function () {
        actionsDataservice.deleteEmailReference(scope.component.uid);
        scope.$parent.removeComponent(scope.component);
      };
      scope.$watch(
        'component.operation.email.uidEmail',
        function (newEmailUid) {
          actionsDataservice.setEmailReference(
            scope.component.uid,
            newEmailUid
          );
        }
      );
      scope.getRemoveSubscriberSummary = function () {
        var content = '';
        var selectedLists =
          scope.component.operation &&
          scope.component.operation.suscriptionLists;
        if (
          scope.component.operation.type ===
          ACTION_TYPE.REMOVE_SUBSCRIBER_FROM_LIST
        ) {
          for (var i = 0; i < selectedLists.length && i < 3; i++) {
            if (i > 0) {
              content += ', ';
            }
            content += '<strong>' + selectedLists[i].ListName + '</strong>';
          }
          if (selectedLists.length > 3) {
            content += '...';
          }
        }
        return content;
      };
      scope.showBrackets = function () {
        return (
          scope.component.operation &&
          !scope.component.operation.suscriptionList &&
          !scope.component.operation.email &&
          !scope.component.operation.suscriptionLists &&
          scope.component.operation.type !== ACTION_TYPE.CHANGE_SUBSCRIBER_FIELD
        );
      };
    }

    return directive;
  }
})();
