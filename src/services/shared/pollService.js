(function() {
  'use strict';

  angular
    .module('dopplerApp')
    .factory('pollService', pollService);

  function pollService() {
    var service = {
      poll: poll
    };

    return service;

    /**
     * Do polling for an url until is found (200 status). Calls are done by GET. 
     *
     * @param {Object} pollRequest - Polling options.
     * @param {String} pollRequest.pollUrl - Polling url.
     * @param {Boolean} pollRequest.returnWhenRequestFound - Finish polling when request state is found.
     * @param {Function} pollRequest.finishOKFunction - Function to execute when result is ok.
     * @param {Function} pollRequest.isConditionMetFunction - Function to evaluate return data, if returnWhenRequestFound is false.
     * @param {Function} pollRequest.errorHandlerFunction - Function to handle any errors.
     * @param {Function} pollRequest.interval - Amount of time to call again, set to 8s by default.
     * @param {Boolean} pollRequest.checkDopplerFileThumbnail - if exists prefixes the url with local server method to avoid mixed content error from dopplerfiles http
     * @param {Int} pollRequest.nbrMaxCalls - Optional, if set limit up to max of x calls to server, in case there was an error with the generation.
     */
    function poll(pollRequest) {
      var interval = pollRequest.interval || 8000;
      pollRequest.nbrMaxCalls = pollRequest.nbrMaxCalls || 100;
      if (pollRequest.checkDopplerFileThumbnail != undefined)
        pollRequest.pollUrl = "/DopplerUtils/CheckThumbnailResponse?imgUrl=" + pollRequest.pollUrl;
      (function iterate() {
        var xhttp, responseData;
        xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
          if (this.readyState == 4) {
            if (pollRequest.returnWhenRequestFound) {
              if (this.status == 200) {
                pollRequest.finishOKFunction();
              }
              else if (this.readyState == 4 && this.status != 200 && pollRequest.nbrMaxCalls-- > 0 ) //not found
                setTimeout(iterate, interval);
              else //if not reachable stop
                pollRequest.errorHandlerFunction();
            }
            else {//TODO: this hasn't been tested, would be the functionality to poll and do something with the request data.
              if (this.status == 200) {
                if (pollRequest.isConditionMetFunction(this.responseText))
                  pollRequest.finishOKFunction(this.responseText);
                else
                  setTimeout(iterate, interval);
              }
              else
                pollRequest.errorHandlerFunction();
            }
          }
        };
        xhttp.open("GET", pollRequest.pollUrl, true);
        xhttp.send();
      })();
    }
  }
})();
