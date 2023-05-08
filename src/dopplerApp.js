function setIENoCaching($httpProvider) {
  // Initialize get if not there
  if (!$httpProvider.defaults.headers.get) {
    $httpProvider.defaults.headers.get = {};
  }

  // Enables Request.IsAjaxRequest() in ASP.NET MVC
  $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';

  // Disable IE ajax request caching
  $httpProvider.defaults.headers.get['If-Modified-Since'] = "Sat, 01 Jan 2000 00:00:00 GMT";
  //IIS Respects RFC standard for date, it gives bad request 400 when this header date is in wrong format
}
angular.module('interceptorModule', []).service('httpInterceptor', ['$rootScope', function ($rootScope) {
  var service = this;

  function isAccessingRestrictedArea(response) {
    return window.top.location.pathname.split('/')[1].toLowerCase() === response.config.url.split('/')[1].toLowerCase();
  }

  service.response = function (response) {
    //Redirect url to SignIn in Automation when unauthorized
    if (response.data.success === false && response.data.errorMsg === 'unauthorized' && isAccessingRestrictedArea(response)) {
      window.top.location = response.data.redirectUrl || $rootScope.loginUrl;
    } else if (response.data.success === false && response.data.errorMsg !== 'unauthorized') {
      console.log("Unexpected error");
    } else if (typeof response.data === 'string' && /window\.top\.location='[^']+';/.test(response.data)) { //Redirect url to SignIn when unauthorized
      window.top.location = $rootScope.loginUrl + '?redirect=' + window.location.pathname + window.location.search;
    }
    return response;
  };
}]);

import { automation_en_translations } from './i18n/automation-dicc-en.js';
import { automation_es_translations } from './i18n/automation-dicc-es.js';

angular.module('dopplerApp', ['pascalprecht.translate', 'ngSanitize', 'interceptorModule', 'angularModalService', 'ngMessages', 'dopplerApp.controlPanel', 'dopplerApp.automation', 'dopplerApp.templates', 'dopplerApp.lists', 'dopplerApp.forms'])
.config(['$httpProvider', '$translateProvider', '$locationProvider', function ($httpProvider, $translateProvider, $locationProvider) {
  setIENoCaching($httpProvider);
  $httpProvider.interceptors.push('httpInterceptor');
  $locationProvider.html5Mode({ 
    enabled: true,
    requireBase: false,
    rewriteLinks: false
  });

  $translateProvider
  .translations('en', automation_en_translations)
  .translations('es', automation_es_translations)
  .useSanitizeValueStrategy('escapeParameters');
  if (typeof(mainMenuData) !== 'undefined'){
    $translateProvider.preferredLanguage(mainMenuData.user.lang);
  }
}]);
