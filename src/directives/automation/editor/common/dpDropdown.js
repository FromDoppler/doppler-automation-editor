(function() {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .directive('dpEditorDropdown', ['$document', '$timeout', dpEditorDropdown]);

  function dpEditorDropdown($document, $timeout) {
    var directive = {
      restrict: 'E',
      link: link,
      templateUrl: 'angularjs/partials/automation/editor/directives/common/dp-dropdown.html',
      scope: {
        arrowSelection: '=',
        keyLabel: '=',
        keyValue: '=',
        label: '=',
        onSelectOption: '&',
        onSelectPrevOption: '&',
        onSelectNextOption: '&',
        options: '=',
        valueSelected: '=',
        disabled: '=ngDisabled'
      }
    };

    return directive;

    function link(scope, element) {
      scope.expanded = false;
      scope.searchInput = element[0].querySelector('.search-text');
      scope.searchQuery = '';
      scope.filteredOptions = scope.options;

      $timeout(function() {
        scope.allowSearch = scope.options && scope.options.length > 5 && !scope.arrowSelection;
      });

      scope.onSearchQueryChanged = function() {
        scope.filteredOptions = _.filter(scope.options, function(option) {
          var optionLabel = scope.keyLabel ? option[scope.keyLabel] : option.label;
          optionLabel = optionLabel.toLowerCase();
          return optionLabel.indexOf(scope.searchQuery.toLowerCase()) === 0;
        });
      };

      scope.isSelected = function(item) {
        if (scope.keyValue) {
          return scope.valueSelected === item[scope.keyValue];
        }
        return scope.valueSelected === item.value;
      };

      scope.nextOption = function() {
        scope.expanded = true;
        scope.onSelectNextOption();
      };

      scope.prevOption = function() {
        scope.expanded = true;
        scope.onSelectPrevOption();
      };

      scope.toggleVisibility = function() {
        if ((!scope.disabled && scope.options.length) || (!scope.options.length && scope.expanded)) {
          scope.expanded = !scope.expanded;
          if (scope.expanded) {
            closeOnOutsideClick();
            if (scope.options.length > 5 && !scope.arrowSelection) {
              $timeout(scrollToSelectedItem, 100);
            }
            $timeout(function(){
              scope.searchInput.focus();
            }, 300);
            scope.searchQuery = '';
            scope.filteredOptions = scope.options;
          }
        }
      };

      function scrollToSelectedItem() {
        var dropdownListContainer = element[0].querySelector('.dropdown-list');
        var selectedOptionIndex = _.findIndex(scope.filteredOptions, function(item) {
          if (scope.keyValue) {
            return item[scope.keyValue] === scope.valueSelected;
          }
          return item.value === scope.valueSelected;
        });
        var selectedOptionElement = dropdownListContainer.querySelector('#item' + selectedOptionIndex);
        if (selectedOptionElement) {
          selectedOptionElement.scrollIntoView({ block: "nearest" });
        }
      }

      function closeOnOutsideClick() {
        // If we don't use $timeout the same "click" event that fired this method will trigger the $document.one('click') binding we're doing next.
        $timeout(function() {
          // We just want it to fire once so we don't populate our DOM with event listeners.
          $document.one('click', function(event) {
            // If next click is on the same dropdown (to close it) then don't do anything and leave the default behavior.
            if (element[0].contains(event.target)) {
              return;
            }

            scope.$apply(function() {
              scope.expanded = false;
            });
          });
        }, 0, false);
      }
    }
  }
})();
