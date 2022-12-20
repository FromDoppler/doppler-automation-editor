(function() {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .directive('dpEditorTinymce', dpEditorTinymce);

  dpEditorTinymce.$inject = [
    '$timeout',
    '$parse',
    '$sce',
    '$rootScope'
  ];

  function dpEditorTinymce($timeout, $parse, $sce, $rootScope) {
    var directive = {
      restrict: 'A',
      link: link,
      require: 'ngModel',
      priority: 10
    };

    return directive;

    function link(scope, element, attrs, ngModel) {

      //Debounce update and save action
      var debouncedUpdate = (function(debouncedUpdateDelay) {
        var debouncedUpdateTimer;
        return function(ed) {
          $timeout.cancel(debouncedUpdateTimer);
          debouncedUpdateTimer = $timeout(function() {
            return (function(ed) {
              if (ed.isDirty()) {
                ed.save();
                updateView(ed);
              }
            })(ed);
          }, debouncedUpdateDelay);
        };
      })(400);

      function updateView(editor) {
        var content = editor.getContent({format: 'html'}).trim();
        content = $sce.trustAsHtml(content);

        ngModel.$setViewValue(content);
        if (!$rootScope.$$phase) {
          scope.$digest();
        }
      }

      var setupOptions = {
        setup: function(ed) {

          ed.onInit.add( function() {
            $rootScope.$broadcast('TINY_LOADED');
            ngModel.$render();
            ngModel.$setPristine();
            ngModel.$setUntouched();
          });


          ed.onExecCommand.add(function(ed) {
            if (!scope.options.debounce) {
              ed.save();
              updateView(ed);
              return;
            }
            debouncedUpdate(ed);
          });

          ed.onChange.add(function(ed) {
            if (!scope.options.debounce) {
              ed.save();
              updateView(ed);
              return;
            }
            debouncedUpdate(ed);
          });



          ed.onSetContent.add(function(){
            if (!scope.options.debounce) {
              ed.save();
              updateView(ed);
              return;
            }
            debouncedUpdate(ed);
          });


          ed.onRemove.add(function() {
            element.remove();
          });

        },
        format: 'html',
        selector: '#' + attrs.id
      };

      $timeout(function() {
        if (!scope.tinyInstance){
          scope.options = $parse(attrs.dpEditorTinymce)(scope);
          angular.extend(scope.options, setupOptions);
          tinymce.init(scope.options);
        }
      });

      ngModel.$formatters.unshift(function(modelValue) {
        return modelValue ? $sce.trustAsHtml(modelValue) : '';
      });

      ngModel.$parsers.unshift(function(viewValue) {
        return viewValue ? $sce.getTrustedHtml(viewValue) : '';
      });

      ngModel.$render = function() {
        var viewValue = ngModel.$viewValue ?
          $sce.getTrustedHtml(ngModel.$viewValue) : '';
        if (!scope.tinyInstance){
          scope.tinyInstance = tinymce.get(attrs.id);
        }
        if (scope.tinyInstance &&
          scope.tinyInstance.getDoc()
        ) {
          scope.tinyInstance.setContent(viewValue);
        }
      };

      scope.$on('$destroy', function(){
        scope.tinyInstance.destroy();
        tinymce.editors = [];
      });

    }

  }

})();
