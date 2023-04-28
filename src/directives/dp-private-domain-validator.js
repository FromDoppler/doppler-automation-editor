(function () {
  'use strict';

  angular
    .module('dopplerApp')
    .directive('dpPrivateDomainValidator', dpPrivateDomainValidator);

  dpPrivateDomainValidator.$inject = ['dkimService'];

  function dpPrivateDomainValidator(dkimService) {
    var directive = {
      restrict: 'A',
      require: 'ngModel',
      link: link,
    };

    return directive;

    function link($scope, element, attr, ngModelCtrl) {
      dkimService.getPublicDomainsList().then(function (response) {
        if (response.data.success) {
          var publicDomains = response.data.publicDomainList;
          var domainExcludeRegex = '';
          angular.forEach(publicDomains, function (domain) {
            domainExcludeRegex += '(' + domain.replace('.', '\\.') + '$)|';
          });
          $scope.domainRegex = new RegExp('^(' + domainExcludeRegex + ')$');

          ngModelCtrl.$validators.isDomainBelongsToOther = function (
            modelValue,
            viewValue
          ) {
            var value = modelValue || viewValue;
            return !$scope.domainRegex.test(value);
          };
        }
      });
    }
  }
})();
