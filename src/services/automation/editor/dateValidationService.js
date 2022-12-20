(function() {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .factory('dateValidation', dateValidation);

  dateValidation.$inject = [
    '$q',
    'settingsService',
    'headerService',
    'automation',
    'changesManager'
  ];

  function dateValidation($q, settingsService, headerService, automation, changesManager) {

    var service = {
      updateDateIfNotValid: updateDateIfNotValid,
      getFullDateinLocalTime: getFullDateinLocalTime,
      isDateExpired: isDateExpired,
      getService: getService,
      isTrialExpired: isTrialExpired
    };

    var settingData = {};
    var headerData = {};

    function getService() {
      var defer = $q.defer();
      var _this = this;
      settingsService.getSettings().then(function (response) {
        settingData = response;
        headerService.getHeaderData().then(function (response) {
          headerData = response;
          defer.resolve(_this);
        });
      });
      return defer.promise;
    }

    function updateDateIfNotValid() {
      var frequency = automation.getModel().initialCondition.frequency;
      if (frequency) {
        getFullDateinLocalTime(frequency.date, frequency.time.hour, frequency.time.minute, frequency.timezone)
          .then(function(fullDate){
            var duration = moment.duration(moment().diff(fullDate));
            if (duration.asMinutes() > 0 || Math.abs(duration.asMinutes()) < 15) {
              var momentFullDate = moment(fullDate).add(duration.asHours(), 'hours');
              var roundedCurrentMinutes = Math.ceil(Math.round(moment(momentFullDate).minute() / 15) * 15);
              if (roundedCurrentMinutes < moment(momentFullDate).minute()) {
                momentFullDate.add(30, 'minutes');
              } else {
                // + 15
                momentFullDate.add(15, 'minutes');
              }
              fullDate = momentFullDate.toDate();
              settingsService.getSettings().then(function(response) {
                var gmtItem = _.find(response.timeZones, function(item) {
                  return item.IdUserTimeZone === frequency.timezone;
                });
                var gmtIncrement = gmtItem.Name.substring(gmtItem.Name.indexOf('GMT') + 3, 7);
                var UTCOffsetHours = new Date().getTimezoneOffset() / 60;
                if (-UTCOffsetHours !== Number(gmtIncrement)) {
                //map date to user selected gmt
                //UTCDate
                  var momentDate = moment(fullDate).add(Number(gmtIncrement), 'hours');
                  //to gmt local
                  momentDate.add(UTCOffsetHours, 'hours');
                  fullDate = momentDate.toDate();
                }
                var roundedMinutes = Math.ceil(Math.round(moment(fullDate).minute() / 15) * 15);
                //just in case round gets to 60
                fullDate = moment(fullDate).minute(roundedMinutes).toDate();
                var newFrequency = {
                  time: {
                    hour: moment(fullDate).hour(),
                    minute: moment(fullDate).minute()
                  },
                  date: fullDate.toISOString()
                };
                changesManager.disable();
                frequency.setData(newFrequency);
                changesManager.enable();
                //update values of date and time into model
                automation.saveChanges();
              });
            }
          });
      }
    }

    function getFullDateinLocalTime(dateString, hour, minute, idTimezone){
      var defer = $q.defer();
      settingsService.getSettings().then(function(response) {
        var fullDate = moment(dateString).toDate();
        fullDate.setHours(hour);
        fullDate.setMinutes(minute);
        var timezones = response.timeZones;
        var gmtItem = _.find(timezones, function(item) {
          return item.IdUserTimeZone === idTimezone;
        });
        var gmtIncrement = gmtItem.Name.substring(gmtItem.Name.indexOf('GMT') + 3, 7);
        var offsetHours = fullDate.getTimezoneOffset() / 60;
        if (-offsetHours !== Number(gmtIncrement)) {
          //UTCDate
          var momentDate = moment(fullDate).add(-Number(gmtIncrement), 'hours');
          //to gmt local
          momentDate.add(-offsetHours, 'hours');
          fullDate = momentDate.toDate();
        }
        defer.resolve(fullDate);

      });
      return defer.promise;
    }

    function isDateExpired(dateString, hour, minute, idTimezone) {
      var defer = $q.defer();
      getFullDateinLocalTime(dateString, hour, minute, idTimezone)
        .then(function(fullDate){
          defer.resolve(!moment().add(15, 'minutes').isBefore(fullDate));
        });
      return defer.promise;
    }

    function isTrialExpired() {
      if (headerData.user.plan.hasOwnProperty('upgradePending') && headerData.user.plan.upgradePending == false) {
          return false;
      }
      var initialCondition = automation.getModel().initialCondition;
      var condition = validInitialConditionByType[initialCondition.type](initialCondition) || false;
      return headerData.user.plan.trialExpired || condition;
    }

    function isNextWeek(day, time) {
      var now = new Date();
      if (day > now.getDay() ||
        (day === now.getDay() && (time.hour > now.getHours() || (time.hour === now.getHours() && time.minute > now.getMinutes())))) {
        return false;
      } // param date < now
      return true;
    }

    function isNextMonth(date, time) {
      var now = new Date();
      if (date > now.getDate() ||
        (date === now.getDate() && (time.hour > now.getHours() || (time.hour === now.getHours() && time.minute > now.getMinutes())))) {
        return false;
      } // param date < now
      return true;
    }

    function getAutomationStartDateByDay(day, time, idTimezone) {
      var startDate = new Date();
      var timeZoneOffeset = -1 * getTimeZoneOffeset(idTimezone) - startDate.getTimezoneOffset();
      day = (day === 0 && startDate.getDay() !== 0) ? 7 : day;
      var _isNextWeek = isNextWeek(day, time);
      startDate.setHours(time.hour);
      startDate.setMinutes(time.minute);
      var distance = (day - startDate.getDay() + (_isNextWeek ? 7 : 0)) % 7;
      startDate.setDate(startDate.getDate() + ((distance === 0 && _isNextWeek) ? 7 : distance));
      return addTimeZoneOffset(startDate, timeZoneOffeset);
    }

    function getAutomationStartDateByDate(date, time, idTimezone) {
      var startDate = new Date();
      var timeZoneOffeset = -1 * getTimeZoneOffeset(idTimezone) - startDate.getTimezoneOffset();
      var _isNextMonth = isNextMonth(date, time);
      startDate.setHours(time.hour);
      startDate.setMinutes(time.minute);
      startDate.setDate(date);
      startDate.setMonth(_isNextMonth ? startDate.getMonth() + 1 : startDate.getMonth());
      return addTimeZoneOffset(startDate, timeZoneOffeset);
    }

    function getTimeZoneOffeset(idTimeZone) {
      var timezoneArrayFilter = settingData.timeZones.filter(function (tz) { return tz.IdUserTimeZone === idTimeZone });
      return timezoneArrayFilter.length === 1 ? timezoneArrayFilter[0].Offset : 0;
    }

    var addTimeZoneOffset = function (dt, tzOffeset) {
      return new Date(dt.getTime() + tzOffeset * 60000);
    }

    var validTrialExpirationDateByDate = function (condition) {
      if (!condition.frequency || condition.sendType === "inmediate") {
        return false;
      }
      var startAt = new Date(condition.frequency.date);
      var timeZoneOffeset = -1 * getTimeZoneOffeset(condition.frequency.timezone) - startAt.getTimezoneOffset();
      startAt.setHours(condition.frequency.time.hour);
      startAt.setMinutes(condition.frequency.time.minute);
      return addTimeZoneOffset(startAt, timeZoneOffeset) > new Date(headerData.user.plan.trialExpirationDate);
    }

    var validTrialExpirationDateByWeekDay = function (condition) {
      var result = condition.frequency.days.some(function (day) {
        return getAutomationStartDateByDay(day, condition.frequency.time, condition.frequency.timezone) > new Date(headerData.user.plan.trialExpirationDate);
      });
      return result;
    }

    var validTrialExpirationDateByMonthDay = function (condition) {
      return getAutomationStartDateByDate(condition.frequency.day, condition.frequency.time, condition.frequency.timezone) > new Date(headerData.user.plan.trialExpirationDate);
    }

    var validInitialConditionByType = {
      dynamic_content: function () {
        return false;
      },
      subscription_list: function () {
        return false;
      },
      site_behavior: function () {
        return false;
      },
      push: function (condition) {
        return validTrialExpirationDateByDate(condition);
      },
      campaign_behavior: function (condition) {
        return validTrialExpirationDateByDate(condition);
      },
      scheduled_date: function (condition) {
        if (!condition.frequency) {
          return false;
        }
        if (condition.frequency.type === "day_week") {
          return validTrialExpirationDateByWeekDay(condition);
        } else if (condition.frequency.type === "day_month") {
          return validTrialExpirationDateByMonthDay(condition);
        }
        return false;
      },
      rss_to_email: function (condition) {
        if (!condition.frequency) {
          return false;
        }
        if (condition.frequency.type === "day_week") {
          return validTrialExpirationDateByWeekDay(condition);
        } else if (condition.frequency.type === "day_month") {
          return validTrialExpirationDateByMonthDay(condition);
        }
        return false;
      }
    }

    return service;
  }
})();
