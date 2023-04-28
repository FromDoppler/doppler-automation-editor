(function () {
  'use strict';

  angular.module('dopplerApp.automation.editor').factory('SiteBehavior', [
    '$injector',
    'BaseConditional',
    'DOMAIN_STATUS',
    'DUPLICATE_STATE',
    'settingsService',
    function (
      $injector,
      BaseConditional,
      DOMAIN_STATUS,
      DUPLICATE_STATE,
      settingsService
    ) {
      function SiteBehavior(data) {
        BaseConditional.call(this, data);
        this.domain = {
          idDomain: 0,
          url: '',
          status: DOMAIN_STATUS.PENDING,
          visitedPage: true,
          visitedTimes: 1,
        };

        this.event;

        if (data) {
          this.setData(data);
        }
      }

      // Prototype inherence from BaseInitialConditionComponent.

      SiteBehavior.prototype = Object.create(BaseConditional.prototype);

      SiteBehavior.prototype.checkCompleted = function () {
        var isCompleted = true;

        if (
          !this.domain.url ||
          !this.domain.url.length ||
          this.domain.url.indexOf('?') > -1 ||
          this.domain.status !== DOMAIN_STATUS.VERIFIED ||
          this.domain.idDomain === 0 ||
          (this.duplicate !== DUPLICATE_STATE.FALSE &&
            this.duplicate !== DUPLICATE_STATE.ORIGIN)
        ) {
          isCompleted = false;
        }

        this.completed = isCompleted;
      };

      SiteBehavior.prototype.isEqual = function (conditional) {
        var isEqual =
          !!this.domain &&
          !!conditional.domain &&
          this.domain.url.toLowerCase() ===
            conditional.domain.url.toLowerCase();
        return isEqual;
      };

      SiteBehavior.prototype.setData = function (data) {
        BaseConditional.prototype.setData.call(this, data);
        if (data.hasOwnProperty('domain')) {
          var domains = settingsService.getLoadedData().domains;
          this.domain = findDomain(data.domain, domains);
        }

        if (data.hasOwnProperty('event')) {
          this.event = data.event;
        }

        this.checkCompleted.call(this);
      };

      SiteBehavior.prototype.getPropertiesToWatch = function () {
        return ['domain'];
      };

      function findDomain(actualDomain, domains) {
        var existDomain = _.find(domains, function (domain) {
          return actualDomain && actualDomain.idDomain === domain.IdDomain;
        });
        actualDomain.status = !existDomain
          ? DOMAIN_STATUS.ERROR
          : existDomain.Status;
        return actualDomain;
      }

      return SiteBehavior;
    },
  ]);
})();
