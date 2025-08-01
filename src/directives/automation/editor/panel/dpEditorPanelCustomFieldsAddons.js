(function () {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .directive('dpEditorPanelCustomFieldsAddons', ['$document', '$timeout', 'settingsService', dpEditorPanelCustomFieldsAddons]);

  function dpEditorPanelCustomFieldsAddons($document, $timeout, settingsService) {
    return {
      templateUrl: 'angularjs/partials/automation/editor/directives/panel/dp-editor-panel-custom-fields-addons.html',
      restrict: 'AE',
      scope: {
        sortedUserFields: '<',
        targetModel: '=?', 
      },
      link: function (scope, element, attrs) {

        if (!scope.sortedUserFields) {
          settingsService.getSettings().then(function(response) {
            scope.sortedUserFields = response.sortedUserFields;
          });
        }
        scope.showFieldsMenu = false;
        scope.showSearch = attrs.showSearch !== undefined && attrs.showSearch !== 'false';
        scope.searchText = '';

        scope.toggleFieldsMenu = function () {
          scope.showFieldsMenu = !scope.showFieldsMenu;

          if (scope.showFieldsMenu) {
            setupOutsideClickListener();
          }
        };

        scope.clickCFItem = function (customFieldName) {
          insertCustomField(customFieldName);
          scope.showFieldsMenu = false;
        };

       // Returns the input (input or textarea) within the wrapper or nulll
        function findInput(element) {
          return element.closest('.content-wrapper')?.querySelector('input, textarea') || null;
        }

        // Gets current value and cursor selection
        function getCurrentValueAndSelection(scope, element) {
          const input = findInput(element[0]);
          let currentValue = scope.targetModel ?? (input ? input.value : '');
          let selectionStart = 0;
          let selectionEnd = 0;

          if (input) {
            selectionStart = input.selectionStart ?? 0;
            selectionEnd = input.selectionEnd ?? 0;
          } else {
            selectionStart = selectionEnd = currentValue.length;
          }

          return { currentValue, selectionStart, selectionEnd, input };
        }

        // Formats the custom field by adding spaces if necessary
        function formatCustomField(currentValue, selectionStart, selectionEnd, customFieldName) {
          const charBefore = currentValue[selectionStart - 1] || '';
          const charAfter = currentValue[selectionEnd] || '';

          let formatted = `[[[${customFieldName}]]]`;

          if (charBefore && !/\s/.test(charBefore)) {
            formatted = ' ' + formatted;
          }
          if (charAfter && !/\s/.test(charAfter)) {
            formatted = formatted + ' ';
          }
          return formatted;
        }

        // Main function that inserts the custom field
        function insertCustomField(customFieldName) {
          const { currentValue, selectionStart, selectionEnd, input } = getCurrentValueAndSelection(scope, element);
          const formatted = formatCustomField(currentValue, selectionStart, selectionEnd, customFieldName);

          const newValue = currentValue.slice(0, selectionStart) + formatted + currentValue.slice(selectionEnd);

          if (scope.targetModel !== undefined) {
            scope.targetModel = newValue;
          } else if (input) {
            input.value = newValue;
            input.dispatchEvent(new Event('change'));
          }

          if (input) {
            const newCursorPos = selectionStart + formatted.length;
            $timeout(() => {
              input.focus();
              input.setSelectionRange(newCursorPos, newCursorPos);
            });
          }
        }

        function setupOutsideClickListener() {
          $timeout(function () {
            $document.one('click', function (event) {
              const isClickInside = element[0].contains(event.target);
              if (!isClickInside) {
                scope.$applyAsync(() => {
                  scope.showFieldsMenu = false;
                });
              }
            });
          });
        }
      }

      /*
      TODO: analize to set error when the content has custom field deleted
      userFieldsDataservice.getDeletedField(fieldInUse, fieldsToCompare)
      */
    };
  }
})();
