(function () {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .service('actionsDataservice', actionsDataservice);

  function actionsDataservice() {
    var actionComponents = [];

    var service = {
      setEmailReference: setEmailReference,
      isEmailReferenced: isEmailReferenced,
      deleteEmailReference: deleteEmailReference,
    };

    return service;

    function setEmailReference(actionUid, emailUid) {
      actionComponents[actionUid] = emailUid;
    }

    function isEmailReferenced(emailUid) {
      return !!_.find(actionComponents, function (uid) {
        return uid === emailUid;
      });
    }

    function deleteEmailReference(actionUid) {
      delete actionComponents[actionUid];
    }
  }
})();
