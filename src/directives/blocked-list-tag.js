(function() {
  angular
    .module('dopplerApp')
    .directive('blockedListTag', blockedListTag);

  function blockedListTag() {
    var directive = {
      restrict: 'AE',
      templateUrl: 'angularjs/partials/shared/blocked-list-tag.html'
    };

    return directive;
  }
})();
