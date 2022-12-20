(function() {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .service('emailLinksDataservice', emailLinksDataservice);

  function emailLinksDataservice() {
    var linksByEmail = {};
    var service = {
      addEmailComponentReference: addEmailComponentReference,
      findLink: findLink,
      getLinksByEmail: getLinksByEmail,
      updateEmailComponentLinks: updateEmailComponentLinks,
      updateLinksId: updateLinksId
    };

    return service;

    function addEmailComponentReference(emailUid) {
      if (!linksByEmail[emailUid]) {
        linksByEmail[emailUid] = [];
      }
    }

    function findLink(emailUid, idLink) {
      return _.find(linksByEmail[emailUid], function(link) {
        return link.idLink === idLink;
      });
    }

    function getLinksByEmail() {
      return linksByEmail;
    }

    function updateEmailComponentLinks(emailUid, links) {
      linksByEmail[emailUid] = links;
    }

    function updateLinksId(emailUid, linksData) {
      _.each(linksData, function(linkData) {
        var link = _.find(linksByEmail[emailUid], function(item) {
          return item.idLink === linkData.oldIdLink;
        });
        link.idLink = linkData.idLink;
      });
    }
  }
})();
