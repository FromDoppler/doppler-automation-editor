(function() {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .directive('dpEditorPanelWhatsapp', dpEditorPanelWhatsapp);

  dpEditorPanelWhatsapp.$inject = [
    'userFieldsDataservice',
    'whatsappDataservice',
    'REGEX',
    'automation',
    'COMPONENT_TYPE',
    'changesManager',
    '$translate',
    '$timeout',
  ];

  function dpEditorPanelWhatsapp(userFieldsDataservice, whatsappDataservice, REGEX, automation, COMPONENT_TYPE, changesManager, $translate, $timeout) {
    var directive = {
      restrict: 'AE',
      templateUrl: 'angularjs/partials/automation/editor/directives/panel/dp-editor-panel-whatsapp.html',
      link: link
    };

    return directive;

    function link(scope) {
      const SHOW_RESULT_SEND_MESSAGE_TIME_MS = 2500;
      const SHOW_MESSAGE_STATUS = {
        SUCCESS: 'success',
        ERROR: 'error',
      };
      const SEND_MESSAGE_TEXT_SUCCESS = $translate.instant('automation_editor.sidebar.whatsapp.send_message_success');
      const SEND_MESSAGE_TEXT_ERROR = $translate.instant('automation_editor.sidebar.whatsapp.send_message_error');
      scope.sendWhatsappMessageResultClass = '';
      scope.showWhatsappSendResultMessage = false;
      scope.sendWhatsappResultMessageText = '';

      var iti = null;
      var whatsappForm = null;
      scope.sendingWhatsappTest = false;
      scope.selectedComponent.touched = false;
      scope.phoneOptions = [];
      scope.showTemplateEmptyWarning = false;

      scope.userFields = userFieldsDataservice.getAllFields();
      scope.roomOptions = undefined;
      scope.templateOptions = undefined;
      scope.REGEX_SMS = REGEX.REGEX_SMS;
      scope.isLoaded = false;
      scope.getReadOnlyLabel = automation.getReadOnlyLabel;


      scope.headerVariables = [];
      scope.bodyVariables = [];

      if(scope.selectedComponent.template && scope.selectedComponent.template.variables.length > 0) {
        scope.headerVariables = scope.selectedComponent.template.variables.filter(({type}) => type === 'header');
        scope.bodyVariables = scope.selectedComponent.template.variables.filter(({type}) => type === 'body');
      }

      scope.$watch('selectedComponent.name', evaluateWhatsappName);

      whatsappDataservice.getWhatsappRooms()
        .then(function(response){
          if(response.success){
            scope.roomOptions = response.rooms;
            if(scope.roomOptions.length > 0 && scope.selectedComponent.room) {
              const roomId = scope.selectedComponent.room.id;
              whatsappDataservice.getWhatsappTemplatesByRoom(roomId)
              .then(function(templateData){
                if(templateData.success){
                  scope.templateOptions = templateData.templates;
                }
              });
            }
          }
        });

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
        inputRef = document.getElementById('phone_whatsapp');
        if (inputRef !== null) {
          iti = window.intlTelInput(inputRef, {
            nationalMode: true,
            separateDialCode: false,
            autoPlaceholder: 'aggressive',
            preferredCountries: ['ar', 'mx', 'co', 'es', 'ec', 'cl', 'pe', 'us'],
            initialCountry: 'ar'
          });
          window.clearInterval(interval);
            changePhoneNumber(whatsappForm);
          evaluateName();
          inputRef.addEventListener('countrychange', function() {
            changePhoneNumber(whatsappForm);
          });
        }
      }
      interval = window.setInterval(applyIntlInput, 50);

      scope.changePhoneNumber = changePhoneNumber;

      scope.test = function() {
        return scope.phoneOptions.length === 0;
      };

      scope.onPhoneTypeSelected = function(rawFieldData, oldField) {
        if (oldField && oldField.name === rawFieldData.name) {
          return;
        }
        scope.selectedComponent.field = rawFieldData;
      };

      scope.onWhatsappRoomSelected = function(rawFieldData, oldField) {
        if (oldField && oldField.name === rawFieldData.name) {
          return;
        }
        scope.selectedComponent.room = rawFieldData;
        scope.showTemplateEmptyWarning = true;
        scope.selectedComponent.template = null;
        whatsappDataservice.getWhatsappTemplatesByRoom(rawFieldData.id)
          .then(function(templateData){
            if(templateData.success){
              scope.templateOptions = templateData.templates;
            }
          });
      };

      scope.onWhatsappTemplateSelected = function(rawFieldData, oldField) {
        if (oldField && oldField.name === rawFieldData.name) {
          return;
        }
        scope.selectedComponent.template = rawFieldData;
        scope.headerVariables = scope.selectedComponent.template.variables.filter(({type}) => type === 'header');
        scope.bodyVariables = scope.selectedComponent.template.variables.filter(({type}) => type === 'body');
        // temporal hardcode fix beplic mock adapt
        scope.selectedComponent.template.content = 
          (rawFieldData.headerText || '').concat('|')
          .concat(rawFieldData.bodyText  || '').concat('|')
          .concat(rawFieldData.footerText  || '');
      };

      scope.onVariableSelected = function(fieldSelected, element) {
        const index = scope.selectedComponent.template.variables.indexOf(element);
        if(scope.selectedComponent.template.variables[index].field &&
          scope.selectedComponent.template.variables[index].field.id == fieldSelected.id){
          return;
        }
        scope.selectedComponent.template.variables[index].field = fieldSelected;
      };

      function evaluateName() {
        if (!scope.selectedComponent.name) {
          scope.selectedComponent.name = COMPONENT_TYPE.WHATSAPP + '_' + scope.rootComponent.lastWhatsappIdName;
        }
      }

      scope.activateBlur = function() {
        if (!scope.selectedComponent.name) {
          scope.rootComponent.isBlur = true;
          setIncrementedNumber();
        }
      };

      function evaluateWhatsappName(newValue, oldValue) {
         if (newValue === oldValue || !oldValue || changesManager.isChanging() || !changesManager.isEnabled()
            || !scope.selectedComponent) {
           return;
         }
         if (!newValue && scope.selectedComponent.isBlur) {
           setIncrementedNumber();
           scope.selectedComponent.name = COMPONENT_TYPE.WHATSAPP + '_' + ++scope.rootComponent.lastWhatsappIdName;
           scope.rootComponent.isBlur = false;
         }
      }

      scope.sendWhatsappTest = function() {
        if (scope.selectedComponent.whatsappPhoneNumberTest !== '' && scope.selectedComponent.template) {
          var data = {
            phoneNumber: scope.selectedComponent.whatsappPhoneNumberTest,
            templateId: scope.selectedComponent.template.id
          };
          scope.sendingWhatsappTest = true;
          whatsappDataservice.sendWhatsappTest(data)
          .then(function(response){
            $timeout(function () { 
              setSendMessageContent('');
            }, SHOW_RESULT_SEND_MESSAGE_TIME_MS );
            setSendMessageContent(response.data.success? SHOW_MESSAGE_STATUS.SUCCESS: SHOW_MESSAGE_STATUS.ERROR);
            scope.sendingWhatsappTest = false;
            scope.selectedComponent.whatsappPhoneNumberTest = '';
          });
        }
      };

      function setSendMessageContent(status) {
        switch (status) {
          case SHOW_MESSAGE_STATUS.ERROR:
            scope.showWhatsappSendResultMessage = true;
            scope.sendWhatsappMessageResultClass = 'dp-wrap-warning';
            scope.sendWhatsappResultMessageText = SEND_MESSAGE_TEXT_ERROR;
            break;
          case SHOW_MESSAGE_STATUS.SUCCESS:
            scope.showWhatsappSendResultMessage = true;
            scope.sendWhatsappMessageResultClass = 'dp-wrap-success';
            scope.sendWhatsappResultMessageText = SEND_MESSAGE_TEXT_SUCCESS;
            break;
          default:
            scope.showWhatsappSendResultMessage = false;
            scope.sendWhatsappMessageResultClass = '';
            scope.sendWhatsappResultMessageText = '';
        }
      }

      function setIncrementedNumber() {
        scope.selectedComponent.name = COMPONENT_TYPE.whatsapp.toUpperCase() + '_' + ++scope.rootComponent.lastWhatsappIdName;
      }

      function changePhoneNumber(whatsappForm) {
        if (whatsappForm) {
          if (iti.getNumber()) {
            scope.selectedComponent.touched = true;
            var isValid = iti.isValidNumber();
            if (isValid) {
              whatsappForm.whatsappPhoneNumberTest.$error = false;
              scope.isWhatsappPhoneNumberTestInvalidByChangeCountry = false;
              scope.selectedComponent.whatsappPhoneNumberTest = iti.getNumber(1);
              scope.selectedComponent.touched = false;
              return;
            }
            evaluateIntlError(iti.getValidationError(), whatsappForm);
          } else {
            whatsappForm.whatsappPhoneNumberTest.$error = {
              'isWhatsappPhoneNumberTestValid': false,
              'required': true
            };
          }
        }
      }

      function evaluateIntlError(errorCode, whatsappForm) {
        switch (errorCode) {
        case 0:
          scope.isWhatsappPhoneNumberTestInvalidByChangeCountry = true;
          whatsappForm.whatsappPhoneNumberTest.$error = {
            'isWhatsappPhoneNumberTestValid': false,
            'required': false
          };
          break;
        case 2:
          scope.isWhatsappPhoneNumberTestInvalidByChangeCountry = false;
          whatsappForm.whatsappPhoneNumberTest.$error = {
            'isWhatsappPhoneNumberTestInvalidTooShort': true,
            'required': false
          };
          break;
        case 3:
          scope.isWhatsappPhoneNumberTestInvalidByChangeCountry = false;
          whatsappForm.whatsappPhoneNumberTest.$error = {
            'isWhatsappPhoneNumberTestInvalidTooLong': true,
            'required': false
          };
          break;
        default:
          scope.isWhatsappPhoneNumberTestInvalidByChangeCountry = false;
          whatsappForm.whatsappPhoneNumberTest.$error = {
            'isWhatsappPhoneNumberTestValid': true,
            'required': false
          };
        }
      }
    }
    
  }
})();
