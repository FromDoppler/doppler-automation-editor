(function() {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .directive('dpEditorPanelSms', dpEditorPanelSms);

  dpEditorPanelSms.$inject = [
    'userFieldsDataservice',
    'REGEX',
    'automation',
    'COMPONENT_TYPE',
    'changesManager',
    'settingsService'
  ];

  function dpEditorPanelSms(userFieldsDataservice, REGEX, automation, COMPONENT_TYPE, changesManager, settingsService) {
    var directive = {
      restrict: 'AE',
      templateUrl: 'angularjs/partials/automation/editor/directives/panel/dp-editor-panel-sms.html',
      link: link
    };

    return directive;

    function link(scope) {
      var iti = null;
      var smsForm = null;
      scope.sendingSmsTest = false;
      scope.selectedComponent.touched = false;
      scope.phoneOptions = [];
      scope.charactersCount = scope.selectedComponent.smsText ? scope.selectedComponent.smsText.length : 0;
      scope.smsPartsCount = scope.selectedComponent.smsText ? getSmsPartsCount(scope.selectedComponent.smsText) : 0;
      scope.REGEX_SMS = REGEX.REGEX_SMS;
      scope.isLoaded = false;
      scope.getReadOnlyLabel = automation.getReadOnlyLabel;
      scope.hasColombiaCodeSmsActive = settingsService.getLoadedData().hasColombiaCountryCodeSmsActive;
      scope.$watch('selectedComponent.name', evaluateSmsName);

      userFieldsDataservice.getPhoneCustoms()
        .then(function(data){
          scope.isLoaded = true;
          scope.phoneOptions = data;
          if (data.length === 1 && scope.selectedComponent) {
            scope.selectedComponent.field = scope.phoneOptions[0];
          }

        });
      
      var inputRef = null;
      var interval;

      function applyIntlInput() {
        inputRef = document.getElementById('phone_sms');
        if (inputRef !== null) {
          iti = window.intlTelInput(inputRef, {
            nationalMode: true,
            separateDialCode: false,
            autoPlaceholder: 'aggressive',
            preferredCountries: ['ar', 'mx', 'co', 'es', 'ec', 'cl', 'pe', 'us'],
            initialCountry: 'ar'
          });
          window.clearInterval(interval);
          changePhoneNumber(smsForm);
          evaluateName();
          inputRef.addEventListener('countrychange', function() {
            changePhoneNumber(smsForm);
          });
        }
      }
      interval = window.setInterval(applyIntlInput, 50);

      scope.changePhoneNumber = changePhoneNumber;

      scope.test = function() {
       
        return scope.phoneOptions.length === 0;
      };

      scope.charactersCountChange = function(value) {
        scope.charactersCount = value ? value.length : 0;
        scope.smsPartsCount = value ? getSmsPartsCount(scope.selectedComponent.smsText) : 0;
      };

      scope.onPhoneTypeSelected = function(rawFieldData, oldField) {
        if (oldField && oldField.name === rawFieldData.name) {
          return;
        }
        scope.selectedComponent.field = rawFieldData;
      };

      function getSmsPartsCount(smsText) {
        if (smsText.length >= 70) {
          for (var i = 0; i < smsText.length; i++) {
            if (REGEX.REGEX_SMS_STRING.indexOf(smsText.charAt(i)) === -1 &&
              REGEX.REGEX_SMS_GSM_EXTENDED_STRING.indexOf(smsText.charAt(i)) === -1) {
              return Math.ceil(smsText.length / 67);
            }
          }
        }
        return 1;
      }

      function evaluateName() {
        if (!scope.selectedComponent.name) {
          scope.selectedComponent.name = COMPONENT_TYPE.SMS.toUpperCase() + '_' + scope.rootComponent.lastSmsIdName;
        }
      }

      scope.activateBlur = function() {
        if (!scope.selectedComponent.name) {
          scope.rootComponent.isBlur = true;
          setIncrementedNumber();
        }
      };

      function evaluateSmsName(newValue, oldValue) {
        if (newValue === oldValue || !oldValue || changesManager.isChanging() || !changesManager.isEnabled()
           || !scope.selectedComponent) {
          return;
        }
        if (!newValue && scope.selectedComponent.isBlur) {
          setIncrementedNumber();
          scope.selectedComponent.name = COMPONENT_TYPE.SMS.toUpperCase() + '_' + ++scope.rootComponent.lastSmsIdName;
          scope.rootComponent.isBlur = false;
        }
      }

      scope.sendSmsTest = function(smsForm) {
        var data = {
          message: scope.selectedComponent.smsText,
          phoneNumber: scope.selectedComponent.smsPhoneNumberTest,
          idScheduledTask: automation.getModel().id
        };
        if (smsForm.$valid) {
          scope.sendingSmsTest = true;

          // TODO: fix errors handling
          userFieldsDataservice.sendSmsTest(data).then(function(response) {
            if (response.data.ErrorCode) {
              switch (response.data.ErrorCode) {
              case 254:
                scope.isSmsPhoneNumberTestInvalidByChangeCountry = false;
                smsForm.smsPhoneNumberTest.$error = {
                  'isSmsPhoneNumberTestValid': true,
                  'required': false,
                  'funds': false,
                  'genericPhone': false,
                  'countryNotActive': false,
                  smsLimitsReached: false
                };
                break;
              case 256:
                scope.isSmsPhoneNumberTestInvalidByChangeCountry = false;
                scope.countryUsed = iti.getSelectedCountryData().name;
                smsForm.smsPhoneNumberTest.$error = {
                  'isSmsPhoneNumberTestValid': false,
                  'required': false,
                  'funds': false,
                  'genericPhone': false,
                  'countryNotActive': true,
                  smsLimitsReached: false
                };
                break;
              case 257:
                scope.isSmsPhoneNumberTestInvalidByChangeCountry = false;
                smsForm.smsPhoneNumberTest.$error = {
                  'isSmsPhoneNumberTestValid': false,
                  'required': false,
                  'funds': true,
                  'genericPhone': false,
                  'countryNotActive': false,
                  smsLimitsReached: false
                };
                break;
              case 260:
                scope.isSmsPhoneNumberTestInvalidByChangeCountry = false;
                smsForm.smsPhoneNumberTest.$error = {
                  'isSmsPhoneNumberTestValid': false,
                  'required': false,
                  'funds': false,
                  'genericPhone': false,
                  'countryNotActive': false,
                  smsLimitsReached: true
                };
                break;
              default:
                scope.isSmsPhoneNumberTestInvalidByChangeCountry = false;
                smsForm.smsPhoneNumberTest.$error = {
                  'isSmsPhoneNumberTestValid': false,
                  'required': false,
                  'funds': false,
                  'genericPhone': true,
                  'countryNotActive': false
                };
              }
            }
            scope.sendingSmsTest = false;
            scope.selectedComponent.smsPhoneNumberTest = '';
          });
        }
      };

      function setIncrementedNumber() {
        scope.selectedComponent.name = COMPONENT_TYPE.SMS.toUpperCase() + '_' + ++scope.rootComponent.lastSmsIdName;
      }

      function changePhoneNumber(smsForm) {
        if (smsForm) {
          if (iti.getNumber()) {
            scope.selectedComponent.touched = true;
            var isValid = iti.isValidNumber();
            if (isValid) {
              smsForm.smsPhoneNumberTest.$error = false;
              scope.isSmsPhoneNumberTestInvalidByChangeCountry = false;
              scope.selectedComponent.smsPhoneNumberTest = iti.getNumber(1);
              scope.selectedComponent.touched = false;
              return;
            }
            evaluateIntlError(iti.getValidationError(), smsForm);
          } else {
            smsForm.smsPhoneNumberTest.$error = {
              'isSmsPhoneNumberTestValid': false,
              'required': true
            };
          }
        }
      }

      function evaluateIntlError(errorCode, smsForm) {
        switch (errorCode) {
        case 0:
          scope.isSmsPhoneNumberTestInvalidByChangeCountry = true;
          smsForm.smsPhoneNumberTest.$error = {
            'isSmsPhoneNumberTestValid': false,
            'required': false
          };
          break;
        case 2:
          scope.isSmsPhoneNumberTestInvalidByChangeCountry = false;
          smsForm.smsPhoneNumberTest.$error = {
            'isSmsPhoneNumberTestInvalidTooShort': true,
            'required': false
          };
          break;
        case 3:
          scope.isSmsPhoneNumberTestInvalidByChangeCountry = false;
          smsForm.smsPhoneNumberTest.$error = {
            'isSmsPhoneNumberTestInvalidTooLong': true,
            'required': false
          };
          break;
        default:
          scope.isSmsPhoneNumberTestInvalidByChangeCountry = false;
          smsForm.smsPhoneNumberTest.$error = {
            'isSmsPhoneNumberTestValid': true,
            'required': false
          };
        }
      }
    }
  }
})();
