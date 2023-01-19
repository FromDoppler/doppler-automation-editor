(function() {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .service('headerService', headerService);

  headerService.$inject = [
    '$http',
    '$q'
  ];

  function headerService($http, $q) {

    var service = {
      getHeaderData: getHeaderData,
      getMaxSubscribersData: getMaxSubscribersData,
      getUpgradePlanData: getUpgradePlanData,
      saveMaxSubscribersData: saveMaxSubscribersData,
      sendEmailUpgradePlan: sendEmailUpgradePlan,
      acceptButtonAction: acceptButtonAction
    };

    return service;


    // get all header data
    function getHeaderData(domain) {
      if (typeof(mainMenuData) !== 'undefined'){
        var deferred = $q.defer();
        deferred.resolve(mainMenuData);
        return deferred.promise;
      } else { //eslint-disable-line
        // TODO: avoid this request (it is happening in Reports)
        return $q(function(resolve, reject) {
          var xhr = new XMLHttpRequest(); //eslint-disable-line no-undef
          xhr.open('GET', domain + 'Header/GetHeaderData', true);
          xhr.processData = false;
          xhr.contentType = false;
          xhr.crossDomain = true;
          xhr.withCredentials = true;
          xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
              if (xhr.status >= 200 && xhr.status < 400) {
                var data = angular.fromJson(xhr.responseText);
                resolve(data);
              } else {
                // Handle error case
                reject('error');
              }
            }
          };
          xhr.send();
        });
      }
    }


    function getMaxSubscribersData(domain) {

      return $q(function(resolve, reject) {
        var xhr = new XMLHttpRequest(); //eslint-disable-line no-undef
        xhr.open('GET', domain + 'SendMaxSubscribersEmail/GetMaxSubscribersData', true);
        xhr.processData = false;
        xhr.contentType = false;
        xhr.crossDomain = true;
        xhr.withCredentials = true;
        xhr.onreadystatechange = function() {
          if (xhr.readyState === 4) {
            if (xhr.status >= 200 && xhr.status < 400) {
              var data = angular.fromJson(xhr.responseText);
              resolve(data.data);
            } else {
              // Handle error case
              reject('error');
            }
          }
        };
        xhr.send();

      });


      //TODO: return to angular when CORS issue is resolved
      //return $http.get(domain + "SendMaxSubscribersEmail/GetMaxSubscribersData", { withCredentials: true }).then(function (response) {
      //  return response.data.data;
      //});
      // GET request

    }

    function saveMaxSubscribersData(model, domain) {
      return $q(function(resolve, reject) {
        var xhr = new XMLHttpRequest(); //eslint-disable-line no-undef
        xhr.open('POST', domain + 'SendMaxSubscribersEmail/SendEmailPopup', true);
        xhr.crossDomain = true;
        xhr.withCredentials = true;
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        //akamai fix for post
        xhr.setRequestHeader('Content-Length', '0');
        xhr.onreadystatechange = function() {
          if (xhr.readyState === 4) {
            if (xhr.status >= 200 && xhr.status < 400) {
              resolve();
            } else {
              // Handle error case
              reject('error');
            }
          }
        };
        xhr.send(JSON.stringify(model));

      });

      //TODO: return to angular when CORS issue is resolved
      //return $http.post(domain +'SendMaxSubscribersEmail/SendEmailPopup', {
      //  maxSubscribersModel: model
      //});
    }

    function getUpgradePlanData(idUserType, domain) {

      return $q(function(resolve, reject) {
        var xhr = new XMLHttpRequest(); //eslint-disable-line no-undef
        xhr.open('GET', domain + 'SendUpgradePlanContactEmail/GetUpgradePlanData?idUserType=' + idUserType, true);
        xhr.processData = false;
        xhr.contentType = false;
        xhr.crossDomain = true;
        xhr.withCredentials = true;
        xhr.onreadystatechange = function() {
          if (xhr.readyState === 4) {
            if (xhr.status >= 200 && xhr.status < 400) {
              var data = angular.fromJson(xhr.responseText);
              resolve(data.data);
            } else {
              // Handle error case
              reject('error');
            }
          }
        };
        xhr.send();

      });

      //TODO: return to angular when CORS issue is resolved
      //return $http.get(domain + "SendUpgradePlanContactEmail/GetUpgradePlanData", {
      //  params : {
      //    idUserType : idUserType
      //  }
      //}).then(function(response){
      //  return response.data.data;
      //});
    }

    function sendEmailUpgradePlan(model, domain) {
      return $q(function(resolve, reject) {
        var xhr = new XMLHttpRequest(); //eslint-disable-line no-undef
        xhr.open('POST', domain + 'SendUpgradePlanContactEmail/UpgradePlan', true);
        xhr.crossDomain = true;
        xhr.withCredentials = true;
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onreadystatechange = function() {
          if (xhr.readyState === 4) {
            if (xhr.status >= 200 && xhr.status < 400) {
              var data = angular.fromJson(xhr.responseText);
              resolve(data);
            } else {
              // Handle error case
              reject('error');
            }
          }
        };
        xhr.send(JSON.stringify(model));

      });
      //TODO: return to angular when CORS issue is resolved
      //return $http.post(domain + 'SendUpgradePlanContactEmail/SendEmailUpgradePlan', {
      //  upgradePlanContactModel: model
      //});
    }
  }

  function acceptButtonAction(domain) {

      var xhr = new XMLHttpRequest(); //eslint-disable-line no-undef
      xhr.open('POST', domain + 'AccountPreferences/AcceptButtonAction', true);
      xhr.crossDomain = true;
      xhr.withCredentials = true;
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      //akamai fix for post
      xhr.setRequestHeader('Content-Length', '0');
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status >= 200 && xhr.status < 400) {
            resolve();
          } else {
            // Handle error case
            reject('error');
          }
        }
      };
      xhr.send();
    //TODO: return to angular when CORS issue is resolved
    //return $http.post(domain + 'SendUpgradePlanContactEmail/SendEmailUpgradePlan', {
    //  upgradePlanContactModel: model
    //});
  }
})();
