(function() {
  'use strict';

  angular
    .module('dopplerApp')
    .directive('dropdown', dropdown);

  dropdown.$inject = ['$document', '$timeout'];

  function dropdown($document, $timeout) {

    var directive = {
      restrict: 'E',
      templateUrl: 'angularjs/partials/shared/dropdown.html',
      scope: {
        list: '=',
        selected: '=ngModel',
        property: '@',
        idValue: '@',
        selectedElement: '=?',
        ngDisabled: '=',
        dropup: '@',
        id: '@',
        placeholder: '@'
      },
      require: 'ngModel',
      link: link
    };

    return directive;

    function link(scope, elem, attrs, modelCtrl) {
      scope.dropdownElementClass = 'dropdown' + elem[0].id;
      scope.listVisible = false;
      scope.searchInput = elem[0].querySelector('.search-text');
      scope.scroll = true;
      scope.searchText = '';
      scope.display = '';


      $timeout(function() {
        var selectedItem = _.find(scope.list, function(item) {
          return item[scope.idValue] === scope.selected;
        });
        if (selectedItem) {
          scope.display = selectedItem[scope.property];
        } else if (scope.placeholder && !scope.display) {
          scope.display = scope.placeholder;
        }

      });

      scope.filterByLabel = function(value){
        var text = value[scope.property];
        text = (text + '').toLowerCase();
        return text.indexOf(scope.searchText.toLowerCase()) === 0;
      };

      scope.select = function(item) {
        scope.selected = scope.idValue !== undefined ? item[scope.idValue] : item;
        scope.display = item[scope.property];
        modelCtrl.$setViewValue(item[scope.idValue]);
      };

      scope.isSelected = function(item) {
        if (scope.selected === undefined) {
          return false;
        }
        return scope.property !== undefined ? item[scope.idValue] === scope.selected : item === scope.selected;
      };

      scope.show = function() {
        if (!scope.ngDisabled) {
          scope.listVisible = !scope.listVisible;
          if (scope.listVisible) {
            scope.searchText = '';
            $timeout(function(){
              scope.searchInput.focus();
            }, 300);
          }
        }
        if (scope.list.length <= 6) {
          scope.scroll = false;
        } else {
          scope.scroll = true;
        }
      };

      scope.close = function() {
        scope.listVisible = false;
      };

      elem.bind('click', function(event) {
        var isClickedElementChildOfDropDown = event.target.className.indexOf(scope.dropdownElementClass) !== -1 ||
          event.target.className.indexOf('dropdown-arrow') !== -1 ||
          event.target.className.indexOf('dropdown-label') !== -1 ||
          event.target.className.indexOf('dropdown-display') !== -1;
        if (isClickedElementChildOfDropDown) {
          return;
        }

        scope.listVisible = false;
        scope.$apply();
      });

      scope.$watch('selected', function(newValue) {
        if (scope.list !== undefined) {
          if (scope.idValue === undefined) {
            for (var i = 0, len = scope.list.length; i < len; i++) {
              if (scope.list[i] === newValue) {
                scope.display = scope.list[i];
                scope.selectedElement = scope.list[i];
                break;
              }
            }
          } else {
            for (var j = 0, len2 = scope.list.length; j < len2; j++) {
              if (scope.list[j][scope.idValue] === newValue) {
                scope.display = scope.list[j][scope.property];
                scope.selectedElement = scope.list[j];
                break;
              }
            }
          }
        }
        if (newValue === null) {
          var selectedItem = _.find(scope.list, function(item) {
            return item[scope.idValue] === scope.newValue;
          });
          if (!selectedItem && scope.placeholder) {
            scope.display = scope.placeholder;
          }
        }

      });
    }

  }

})();
