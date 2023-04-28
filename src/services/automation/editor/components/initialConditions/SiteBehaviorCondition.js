(function () {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .factory('SiteBehaviorCondition', [
      'BaseInitialConditionComponent',
      'TIMES_BACK_AUTOMATION',
      'TIME_UNIT',
      'CONDITION_OPERATOR',
      'DOMAIN_STATUS',
      'MAX_HOURS_VERIFICATION',
      'MAX_DAYS_VERIFICATION',
      'MAX_MINUTES_VERIFICATION',
      'MAX_WEEKS_VERIFICATION',
      function (
        BaseInitialConditionComponent,
        TIMES_BACK_AUTOMATION,
        TIME_UNIT,
        CONDITION_OPERATOR,
        DOMAIN_STATUS,
        MAX_HOURS_VERIFICATION,
        MAX_DAYS_VERIFICATION,
        MAX_MINUTES_VERIFICATION,
        MAX_WEEKS_VERIFICATION
      ) {
        function SiteBehaviorCondition(data) {
          this.domains = [];
          this.verificationTime;
          this.timeUnit = TIME_UNIT.HOURS;
          this.timesBackAutomation = TIMES_BACK_AUTOMATION.ONE_TIME;
          this.operator = CONDITION_OPERATOR.OR;

          // Inherited constructor.
          BaseInitialConditionComponent.call(this, data);
        }

        // Prototype inherence from BaseInitialConditionComponent.
        SiteBehaviorCondition.prototype = Object.create(
          BaseInitialConditionComponent.prototype
        );
        SiteBehaviorCondition.prototype.markup =
          '<dp-editor-site-behavior-condition component="component"></dp-editor-site-behavior-condition>';
        SiteBehaviorCondition.prototype.panelTemplate =
          '<div dp-editor-panel-site-behavior-condition class="dp-editor-panel-site-behavior-condition"></div>';

        SiteBehaviorCondition.prototype.checkCompleted = function () {
          var isCompleted = true;

          if (this.domains.length) {
            _.each(this.domains, function (domain) {
              if (
                !domain.url ||
                !domain.url.length ||
                domain.url.indexOf('?') > -1 ||
                domain.status !== DOMAIN_STATUS.VERIFIED ||
                domain.idDomain === 0
              ) {
                isCompleted = false;
              }
            });
            var onlyUrls = this.domains.map(function (object) {
              return object['url'];
            });
            if (_.uniq(onlyUrls, false).length < this.domains.length) {
              isCompleted = false;
            }
          } else {
            isCompleted = false;
          }

          if (
            this.domains &&
            (this.domains.length > 1 ||
              (this.domains.length === 1 && this.domains[0].visitedTimes > 1))
          ) {
            isCompleted =
              isCompleted &&
              isVerificationTimeValid(this.timeUnit, this.verificationTime);
          }

          this.completed = isCompleted;
        };

        SiteBehaviorCondition.prototype.setData = function (data) {
          BaseInitialConditionComponent.prototype.setData.call(this, data);
          if (data.hasOwnProperty('domains')) {
            var domains = this.domains;
            _.each(data.domains, function (item) {
              domains.push(item);
            });
          }

          if (data.hasOwnProperty('timesBackAutomation')) {
            this.timesBackAutomation = data.timesBackAutomation;
          }
          if (data.hasOwnProperty('verificationTime')) {
            this.verificationTime = data.verificationTime;
          }
          if (data.hasOwnProperty('operator')) {
            this.operator = data.operator;
          }
          if (data.hasOwnProperty('timeUnit')) {
            this.timeUnit = data.timeUnit;
          }
          this.checkCompleted.call(this);
        };

        SiteBehaviorCondition.prototype.getPropertiesToWatch = function () {
          return [
            'domains',
            'timesBackAutomation',
            'verificationTime',
            'timeUnit',
            'operator',
          ];
        };

        function isVerificationTimeValid(timeUnit, verificationTime) {
          return (
            verificationTime >= 0 &&
            Number.isInteger(parseInt(verificationTime)) &&
            ((timeUnit === TIME_UNIT.HOURS &&
              verificationTime <= MAX_HOURS_VERIFICATION) ||
              (timeUnit === TIME_UNIT.DAYS &&
                verificationTime <= MAX_DAYS_VERIFICATION) ||
              (timeUnit === TIME_UNIT.MINUTES &&
                verificationTime <= MAX_MINUTES_VERIFICATION) ||
              (timeUnit === TIME_UNIT.WEEKS &&
                verificationTime <= MAX_WEEKS_VERIFICATION))
          );
        }

        return SiteBehaviorCondition;
      },
    ]);
})();
