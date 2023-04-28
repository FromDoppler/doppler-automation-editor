(function () {
  'use strict';

  angular.module('dopplerApp').controller('PreviewCtrl', PreviewCtrl);

  PreviewCtrl.$inject = ['$scope', 'close', 'data', '$timeout'];

  function PreviewCtrl($scope, close, data, $timeout) {
    $scope.close = close;
    $scope.isPreviewLoading = true;
    $scope.iframeLoadedCallBack = function () {
      document.getElementById('preview-html').contentDocument.body.innerHTML =
        data.html;
      $timeout(function () {
        $scope.isPreviewLoading = false;
      });
    };
  }
})();
