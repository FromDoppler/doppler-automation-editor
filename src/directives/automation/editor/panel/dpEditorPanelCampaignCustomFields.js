(function () {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .directive('dpEditorPanelCampaignCustomFields', ['$document', '$timeout', dpEditorPanelCampaignCustomFields]);

  function dpEditorPanelCampaignCustomFields($document, $timeout) {
    var directive = {
      templateUrl: 'angularjs/partials/automation/editor/directives/panel/dp-editor-panel-campaign-custom-fields.html',
      restrict: 'AE',
      link: link
    };

    return directive;

    function link(scope) {
      scope.showContainerCFItems = false;
      var SUBJECT_INPUT_ID = 'subject_property';
      var CF_BUTTON_ID = 'customFieldsSubjectButton';
      var CF_ITEMS_CONTAINER_ID = 'customFieldsSubjectItemsContainer';

      function putCustomFieldInSelectedPosition(customFieldName) {
        var input = document.getElementById(SUBJECT_INPUT_ID);
        var currentPos = input.selectionStart;
        var selectionStart = input.selectionStart;
        var selectionEnd = input.selectionEnd;
        var formatedCustomField = '[[[' + customFieldName + ']]]';

        var currentSubject = scope.$parent.selectedComponent.subject;
        currentSubject = currentSubject ? currentSubject : '';

        // the scope will be updated in on change
        input.value = currentSubject
          .slice(0, selectionStart)
          .concat(formatedCustomField)
          .concat(currentSubject.slice(selectionEnd));

        // force change event
        input.dispatchEvent(new Event('change'));

        var newPosition = currentPos + formatedCustomField.length;

        input.focus();
        input.setSelectionRange(newPosition, newPosition);
      }

      function closeOnOutsideClick() {
        // If we don't use $timeout the same "click" event that fired this method will trigger the $document.one('click') binding we're doing next.
        $timeout(function () {
          // We just want it to fire once so we don't populate our DOM with event listeners.
          $document.one('click', function (event) {
            var cfButton = document.getElementById(CF_BUTTON_ID);
            var cfItemsContainer = document.getElementById(CF_ITEMS_CONTAINER_ID);

            // If next click is on the button, or custom fields items container, or something inside them, then don't do anything and leave the default behavior.
            if (cfButton === event.target ||
              cfButton.contains(event.target) ||
              cfItemsContainer === event.target ||
              cfItemsContainer.contains(event.target)
            ) {
              return;
            }

            //temporal fix to solve dp library issue
            document.getElementById(CF_ITEMS_CONTAINER_ID).style.display = 'none';
            scope.showContainerCFItems = false;
          });
        }, 0, false);
      }

      scope.clickCFItem = function (customFieldName) {
        putCustomFieldInSelectedPosition(customFieldName);
        //temporal fix to solve dp library issue
        document.getElementById(CF_ITEMS_CONTAINER_ID).style.display = 'none';
        scope.showContainerCFItems = false;
      }

      scope.clickCFButton = function () {
        scope.showContainerCFItems = !scope.showContainerCFItems;
        //temporal fix to solve dp library issue
        document.getElementById(CF_ITEMS_CONTAINER_ID).style.display = scope.showContainerCFItems?'block':'none';
        closeOnOutsideClick();
      }

    }
  }
})();
