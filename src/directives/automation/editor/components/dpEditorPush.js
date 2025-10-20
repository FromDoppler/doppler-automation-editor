(function() {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .directive('dpEditorPush', dpEditorPush);

  dpEditorPush.$inject = ['settingsService', '$translate'];

  function dpEditorPush(settingsService, translate) {
    var directive = {
      restrict: 'E',
      scope: {
        branch: '=',
        component: '='
      },
      templateUrl: 'angularjs/partials/automation/editor/directives/components/dp-editor-push.html',
      link: link
    };

    return directive;

    function link(scope) {
      let domains= [];
      const btn_label =  translate.instant('automation_editor.sidebar.push_button_content');
      settingsService.getSettings().then(function(response) {
        domains = response.domains.filter(domain =>
          scope.component.domains.some(selected => 
            selected.IdDomain === domain.IdDomain)
        );
      });
      
      scope.getLabelAction = function (index) {
        const item = scope.component.pushActions && scope.component.pushActions[index];
        if (!item) return (btn_label + ' ' + (index + 1));

        const { label, icon } = item;
        const text = label || btn_label + ' ' + (index + 1);
        const img = icon
          ? `<img src="${icon}" alt="">`
          : '';

        return (img + text);
      };

      scope.getPushIconUrl = function() {
        const defaultIconPath = '';
        if(!scope.component.pushPreferLargeImage && scope.component.pushMessageImageUrl.length > 0) {
          return scope.component.pushMessageImageUrl;
        }
        if(domains.length > 0) {
          const REGEX_URL = /^https:\/\/.+\..+/;
          const firstWithValidIcon = domains.find(d => d.icon && REGEX_URL.test(d.icon));
          return firstWithValidIcon || defaultIconPath;
        }
        return defaultIconPath
      }
    }
  }
})();
