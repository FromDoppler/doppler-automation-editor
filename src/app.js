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


// Declare app level module which depends on views, and core components
var app = angular.module("dopplerApp.automation.editor", [
  'ui.router',
  'pascalprecht.translate',
]);

app.config(['$translateProvider', '$locationProvider', '$stateProvider', '$urlRouterProvider',
 function($translateProvider, $locationProvider,
  $stateProvider, $urlRouterProvider) {

  angular.lowercase = angular.$$lowercase;  
  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false,
   // rewriteLinks: false
  });


  $translateProvider
  .useStaticFilesLoader({
    files: [{
     prefix: '/i18n/shared/general-',
     suffix: '.json'
  },{
      prefix: 'http://localhost:8000/i18n/automation/automationGrid-',
      suffix: '.json'
    },
   {
     prefix: '/i18n/templates/template-',
     suffix: '.json'
   },
  {
    prefix: '/i18n/automation/automationReportsTask-',
    suffix: '.json'
  },
  {
    prefix: 'http://localhost:8000/i18n/automation/automationEditor-',
    suffix: '.json'
  },
  {
    prefix: '/i18n/forms/formsGrid-',
    suffix: '.json'
  },
  {
    prefix: '/i18n/controlPanel/controlPanelSiteTracking-',
    suffix: '.json'
  },
  {
    prefix: '/i18n/controlPanel/controlPanelSubscribersScoring-',
    suffix: '.json'
  },
  {
    prefix: '/i18n/controlPanel/landingPagesDomains-',
    suffix: '.json'
  },
  {
    prefix: '/i18n/controlPanel/vtexIntegration-',
    suffix: '.json'
  },
  {
    prefix: '/i18n/controlPanel/zohoCrmIntegration-',
    suffix: '.json'
  },
  {
    prefix: '/i18n/forms/formsIntegrate-',
    suffix: '.json'
  },
  {
    prefix: '/i18n/forms/formTypes-',
    suffix: '.json'
  },
  {
    prefix: '/i18n/subscribers/addMassiveSubscribers-',
    suffix: '.json'
  },
  {
    prefix: '/i18n/controlPanel/prestashop-',
    suffix: '.json'
   },
   {
    prefix: '/i18n/controlPanel/magentoIntegration-',
    suffix: '.json'
   },
   {
    prefix: '/i18n/controlPanel/wooCommerceIntegration-',
    suffix: '.json'
   },
   {
    prefix: '/i18n/controlPanel/smsSettings-',
    suffix: '.json'
   },
   {
    prefix: '/i18n/controlPanel/billingInformation-',
    suffix: '.json'
   },
   {
     prefix: '/i18n/controlPanel/tiendanubeIntegration-',
    suffix: '.json'
   },
   {
    prefix: '/i18n/controlPanel/easycommerceIntegration-',
    suffix: '.json'
   },
   {
     prefix: '/i18n/controlPanel/bmwCrmIntegration-',
    suffix: '.json'
   },
   {
     prefix: '/i18n/controlPanel/mercadoLibreIntegration-',
    suffix: '.json'
   },
   {
     prefix: '/i18n/controlPanel/mercadoShopsIntegration-',
    suffix: '.json'
   },
   {
     prefix: '/i18n/controlPanel/miTiendaIntegration-',
     suffix: '.json'
   },
   {
     prefix: '/i18n/controlPanel/rfmSettings-',
     suffix: '.json'
   }
   ]
  })
  .useSanitizeValueStrategy('escapeParameters');

  var lang = typeof(mainMenuData) !== 'undefined' ? mainMenuData.user.lang : 'es'
  $translateProvider.preferredLanguage(lang);

  $stateProvider
  .state('Home', {
    url : '/home',
    templateUrl: 'automation/automation.html',
    controller : "HomeCtrl"
  })

   $urlRouterProvider.otherwise("/home");


}]);

app.controller('HomeCtrl', function() {});
