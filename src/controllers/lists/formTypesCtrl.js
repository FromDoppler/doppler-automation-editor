(function() {
  'use strict';

  angular
    .module('dopplerApp.forms')
    .controller('FormTypesCtrl', FormTypesCtrl);

  FormTypesCtrl.$inject = [
    '$scope',
    '$location',
    '$translate',
    '$window',
    'FORM_TYPE'
  ];

  function FormTypesCtrl($scope, $location, $translate, $window, FORM_TYPE) {
    var urlParams = $location.search();

    $scope.FORM_TYPE = FORM_TYPE;
    $scope.isLoading = true;
    $scope.isNewFeature = [$scope.FORM_TYPE.WHATSAPP];

    $translate.onReady()
      .then(function() {
        $scope.isLoading = false;
      });

    $scope.goToFormEditor = function(idFormType) {
      urlParams.idFormType = idFormType;
      var params = new URLSearchParams(urlParams);
      $window.location.href = '/MSFormsEditor/Editor?' + params.toString();
    };
  }
})();
