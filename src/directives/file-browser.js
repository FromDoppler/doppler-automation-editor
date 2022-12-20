(function() {
  'use strict';

  angular
    .module('dopplerApp')
    .factory('readFile', function($window, $q) {
      function readFile(file) {
        var deferred = $q.defer(),
          reader = new $window.FileReader();

        reader.onload = function(ev) {
          var content = ev.target.result;
          deferred.resolve(content);
        };

        reader.readAsDataURL(file);
        return deferred.promise;
      }

      return readFile;
    })
    .directive('fileBrowser', fileBrowser);

  function fileBrowser(readFile) {

    var directive = {
      template: '<input type="file" style="display: none;" accept="{{accept}}"/>' +
        '<ng-transclude></ng-transclude>',
      transclude: true,
      scope: {
        maxSize: '=?',
        error: '=',
        file: '=',
        accept: '=?'
      },
      link: link
    };

    return directive;

    function link(scope, element) {
      var fileInput = element.children('input[file]');
      fileInput.on('change', function(event) {
        var file = event.target.files[0];
        scope.error = false;
        if (file && scope.maxSize >= file.size || !scope.maxSize) {
          readFile(file).then(function() {
            scope.file = file;
            scope.$emit('onSelectedFile', {file: file});
          });
        } else {
          scope.error = true;
          scope.$apply();
        }
      });

      element.on('click', function() {
        fileInput[0].click();
      });
    }

  }

})();
