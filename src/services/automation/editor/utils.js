(function() {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .service('utils', utils);

  function utils() {
    var lastUid = 0;
    // This Regex validation is replicated from Doppler.Transversal.Classes.Constants.EmailRegEx
    var REGEX_EMAIL = /^(\(\w+\))?([a-zA-Z0-9_+\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-ñÑ]+\.)+))([a-zA-Z]{2,16})$/; // eslint-disable-line
    var REGEX_EMAILS_COMMA_SEPARATED = /^([\w+-.%]+@[\w-.]+\.[A-Za-z]+)(, ?[\w+-.%]+@[\w-.]+\.[A-Za-z]+)*$/i;
    var REGEX_EMAIL_DKIM = /^([a-zñ\d[\]])(\.?([\wñ&/~\-+\][]+))+$/i; // eslint-disable-line
    var REGEX_NUMBER = /^\s*(\+|-)?((\d+((\.|\,)\d+)?)|((\.|\,)\d+))\s*$/; // eslint-disable-line
    var REGEX_SUBSCRIBER_EMAIL = /^(\(\w+\))?([a-zA-Z0-9_+\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,16})$/i; // eslint-disable-line
    var REGEX_CC_VISA = /^4([0-9]{12}|[0-9]{15})$/i;
    var REGEX_CC_MASTER = /^5[1-5][0-9]{14}$/i;
    var REGEX_CC_AMERICAN = /^3(4|7)[0-9]{13}$/i;
    var REGEX_CC_NONE = /[^\w\W]$/i;
    var REGEX_CUIT = /^(20|23|24|27|30|33|34)(\D)?[0-9]{8}(\D)?[0-9]{1}$/i;
    var REGEX_RFC = /^([A-ZÑ&]{3,4}) ?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])) ?(?:- ?)?([A-Z\d]{2})([A\d])$/i;
    var service = {
      assign: assign,
      newUid: newUid,
      updateLastUid: updateLastUid,
      getDeepValue: getDeepValue,
      getUrlQueryParam: getUrlQueryParam,
      isValidPath: isValidPath,
      isEmail: isEmail,
      REGEX_EMAIL: REGEX_EMAIL,
      REGEX_EMAILS_COMMA_SEPARATED: REGEX_EMAILS_COMMA_SEPARATED,
      REGEX_EMAIL_DKIM: REGEX_EMAIL_DKIM,
      REGEX_NUMBER: REGEX_NUMBER,
      REGEX_SUBSCRIBER_EMAIL: REGEX_SUBSCRIBER_EMAIL,
      REGEX_CC_VISA: REGEX_CC_VISA,
      REGEX_CC_MASTER: REGEX_CC_MASTER,
      REGEX_CC_AMERICAN: REGEX_CC_AMERICAN,
      REGEX_CC_NONE: REGEX_CC_NONE,
      REGEX_CUIT: REGEX_CUIT,
      REGEX_RFC: REGEX_RFC,
      isSubscriberEmail: isSubscriberEmail,
      validateCuit: validateCuit,
      validateNit: validateNit,
      validateRfc: validateRfc,
      formatValidRfc: formatValidRfc,
      getCCMonths: getCCMonths,
      getCCYears: getCCYears,
      isValidExpDate: isValidExpDate,
      getIdentificationLengthRange: getIdentificationLengthRange
    };

    return service;

    function assign(object, property, value) {
      if (typeof property === 'string') {
        if (property.split(',').length > 1) {
          var propArr = property.split(',');
          _.each(propArr, function(prop) {
            return assign(object, prop, value[prop]);
          });
        } else {
          return assign(object, property.split('.'), value);
        }
      } else if (property.length === 1 && value !== undefined) {
        return object[property[0]] = value;
      } else if (property.length === 0) {
        return object;
      } else {
        return assign(object[property[0]], property.slice(1), value);
      }
    }

    function getDeepValue(object, path) {
      var paths = path.split('.');
      var value = object;

      for (var i = 0; i < paths.length; ++i) {
        if (!value[paths[i]]) {
          return null;
        }
        value = value[paths[i]];
      }

      return value;
    }

    function newUid() {
      return ++lastUid;
    }

    function updateLastUid(uid) {
      if (uid > lastUid) {
        lastUid = uid;
      }
    }

    function getUrlQueryParam(location, param) {
      var search = location.search();
      if (search.hasOwnProperty(param)) {
        return search[param];
      }
    }

    function isValidPath(object, strPath) {
      return !!_.has(object, strPath);
    }

    function isEmail(value) {
      return REGEX_EMAIL.test(value);
    }

    function isSubscriberEmail(value) {
      return REGEX_SUBSCRIBER_EMAIL.test(value);
    }

    function validateCuit(value) {
      if (!value) {
        return true;
      }

      if (!REGEX_CUIT.test(value)) {
        return false;
      }

      var mult = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
      var total = 0;
      for (var i = 0; i < mult.length; i++) {
        total += parseInt(value[i]) * mult[i];
      }
      var mod = total % 11;
      var digit = mod === 0 ? 0 : mod === 1 ? 9 : 11 - mod;

      return digit === parseInt(value[10]);
    }

    function validateNit(value) {
      if (!value || value.length > 16){
        return false;
      }
      // takes in account nits up to 16 characters

      var multiplier = [3, 7, 13, 17, 19, 23, 29, 37, 41, 43, 47, 53, 59, 67, 51];
      var total = 0;
      var lastElement = value.length - 2; 
      for (var i = 0; i < value.length - 1; i++) {
        total += parseInt(value[lastElement - i]) * multiplier[i];
      }
      var mod = total % 11;
      var digit = mod >= 2 ? 11 - mod : mod;

      return digit === parseInt(value[value.length - 1]);
    }

    function validateRfc(value) {
      if (!value) {
        return true;
      }

      var rfcValue = value.trim().toUpperCase();
      var rfcMatched = rfcValue.match(REGEX_RFC);

      if (!rfcMatched) {
        return false;
      }

      var digit = rfcMatched.pop();
      var rfcWithoutDigit = rfcMatched.slice(1).join('');
      var len = rfcWithoutDigit.length;
      var dictionary = '0123456789ABCDEFGHIJKLMN&OPQRSTUVWXYZ Ñ';
      var index = len + 1;

      var sum = len === 12 ? 0 : 481;

      for (var i = 0; i < len; i++) {
        sum += dictionary.indexOf(rfcWithoutDigit.charAt(i)) * (index - i);
      }

      var mod = 11 - sum % 11;
      var expectedDigit = mod === 11 ? '0' : mod === 10 ? 'A' : mod.toString();

      var rfc = formatValidRfc(value);

      if ((digit !== expectedDigit) && (rfc !== 'XAXX010101000')) {
        return false;
      }

      return rfc;
    }

    function formatValidRfc(value) {
      return value ? value.match(REGEX_RFC) ? value.match(REGEX_RFC).slice(1).join('') : null : null;
    }

    function getCCMonths() {
      var months = [];
      for (var i = 1; i <= 12; i++) {
        months.push({id: i, name: i.toString()});
      }
      return months;
    }

    function getCCYears() {
      var years = [];
      var fullYear = new Date().getFullYear();
      var nextYear = fullYear;
      for (var i = 0; i < 20; i++) {
        years.push({id: nextYear, name: nextYear.toString()});
        nextYear += 1;
      }
      return years;
    }

    function isValidExpDate(now, month, year) {
      var today = now;
      var expDate = new Date(year, month, 0);
      return today <= expDate;
    }

    function getIdentificationLengthRange(idIdentificationType) {
      switch (idIdentificationType) {
      case 'DNI':
        return {min: 7, max: 8};
      case 'CI':
        return {min: 1, max: 9};
      case 'LC':
        return {min: 6, max: 7};
      case 'LE':
        return {min: 6, max: 7};
      case 'Otro':
        return {min: 5, max: 20};
      default:
        return {min: 5, max: 20};
      }
    }
  }
})();
