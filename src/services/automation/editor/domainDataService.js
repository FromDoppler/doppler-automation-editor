(function() {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .service('domainDataService', domainDataService);

  domainDataService.$inject = [
    '$http'
  ];

  function domainDataService($http) {
    var service = {
      isValidDomain: isValidDomain,
      sendEmail: sendEmail,
      isValidCode: isValidCode
    };

    return service;

    function isValidDomain(domain) {
      var validationUrl = '/Automation/Automation/ValidatePrivateDomain';
      return $http.get(validationUrl, {
        params: {
          domain: domain
        }
      });
    }

    function sendEmail(domain) {
      var validationUrl = '/Automation/Automation/SendPrivateDomainEmail';
      return $http.get(validationUrl, {
        params: {
          email: domain
        }
      });
    }

    function isValidCode(code, email) {
      var validationUrl = '/Automation/Automation/IsValidCode';
      return $http.get(validationUrl, {
        params: {
          code: code,
          email: email
        }
      });
    }
  }
})();
