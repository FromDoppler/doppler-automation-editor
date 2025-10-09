(function () {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .directive('dpEditorPanelFrequencyDayYearSelector', dpEditorPanelFrequencyDayYearSelector);

  dpEditorPanelFrequencyDayYearSelector.$inject = ['automation', 'optionsListDataservice', 'userFieldsDataservice', 'FIELD_TYPE'];

  function dpEditorPanelFrequencyDayYearSelector(automation, optionsListDataservice, userFieldsDataservice, FIELD_TYPE) {
    return {
      restrict: 'E',
      templateUrl: 'angularjs/partials/automation/editor/directives/panel/initialConditions/shared/dp-editor-panel-frequency-day-year-selector.html',
      scope: {
        frequency: '=',
        availableDateFields: '<?',
        onChange: '&',
        isReadOnly: '&'
      },
      link: function (scope, element) {
        scope.dayMoments = optionsListDataservice.getDayMoments();
        scope.deletedFields = [];
        scope.dateUserFields = userFieldsDataservice.getFieldsByType(FIELD_TYPE.DATE);
        element.ready(function() {
            updateDeletedFields();
        });

        scope.addNewCustomField = function () {
          var newField = scope.availableDateFields[0];
          scope.onCustomFieldSelected(newField);
          updateAvailableDateFields();
        };

        scope.onCustomFieldSelected = function (newOption, oldOption, index) {
          var fields = scope.frequency.customFields || [];
          if (oldOption) {
            fields = _.without(fields, oldOption);
          }

          var insertIndex = index >= 0 ? index : fields.length;
          fields.splice(insertIndex, 0, newOption);
          scope.onChange({ key: 'customFields', value: fields });

          if (oldOption && scope.deletedFields.length) {
            updateDeletedFields(insertIndex);
          }
        };

        scope.onCustomFieldRemoved = function (option) {
          var updated = _.without(scope.frequency.customFields, option);
          scope.onChange({ key: 'customFields', value: updated });
        };

        scope.onSelectDayMoment = function (option) {
          scope.dayMomentSelected = option;
          scope.onChange({ key: 'momentId', value: option.value });
        };

        function updateDeletedFields(index) {
          scope.deletedFields = userFieldsDataservice.getDeletedFieldsByType(
          scope.frequency.customFields, FIELD_TYPE.DATE);
          _.each(scope.deletedFields, function (deletedField) {
            scope.validationDayYearForm['customField' + deletedField.index].$setValidity('deletedField', false);
          });
          if (!scope.deletedFields.length) {
            automation.updateAutomationFlowState();
          }
        }

        // Sync initial selection
        scope.$watch('frequency.momentId', function (value) {
          scope.dayMomentSelected = _.find(scope.dayMoments, function (m) {
            return m.value === value;
          });
        });
        scope.$watch('frequency.customFields', updateAvailableDateFields);

        function updateAvailableDateFields() {
          scope.availableDateFields = _.sortBy(_.differenceBy(scope.dateUserFields, scope.frequency.customFields, 'id'), 'label');
        }
      
      }
    };
  }
})();