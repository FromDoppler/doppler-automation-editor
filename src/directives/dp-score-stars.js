(function() {
  'use strict';

  angular
    .module('dopplerApp')
    .directive('dpScoreStars', [dpScoreStars]);

  function dpScoreStars() {

    var directive = {
      restrict: 'E',
      link: link,
      templateUrl: 'angularjs/partials/scoring/scoringStars.html',
      scope: {
        totalStars: '=',
        fullStars: '='
      }
    };

    return directive;

    function link(scope, elem, attrs) {
      scope.$watch(attrs.totalStars, function() {
        scope.repeatTotalStars = scope.totalStars ? Array(scope.totalStars - scope.fullStars) : Array(0);
        scope.repeatFullStars = Array(scope.fullStars);
      });
    }
  }
})();
