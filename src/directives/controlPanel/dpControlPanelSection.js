(function() {
  'use strict';

  angular
    .module('dopplerApp')
    .directive('dpControlPanelSection', dpControlPanelSection);

  dpControlPanelSection.$inject = [
    '$translate'
  ];

  function dpControlPanelSection( $translate ) {
    var directive = {
      restrict: 'E',
      scope: {
        type: '@'
      },
      templateUrl: 'angularjs/partials/controlPanel/directives/dp-control-panel-section.html',
      link: link
    };

    return directive;

    function link($scope) {
      $translate.onReady().then(function() {
        if ($scope.type === 'DKIM') {
          $scope.title = $translate.instant('control_panel.dkim.title');
          $scope.subtitle = $translate.instant('control_panel.dkim.subtitle');
          $scope.link = $translate.instant('control_panel.dkim.subtitle_link');
          $scope.linkText = $translate.instant('control_panel.dkim.subtitle_link_text');
        }
        $scope.controlPanelLoaded = true;
      });

    }
  }
})();
