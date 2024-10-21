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
      scope.showWhatsappUploadFileResultMessage = false;
      scope.sendWhatsappUploadFileResultMessageText = '';

      const multimediaConstraint = {
        VIDEO: {
          acceptedFileTypes: 'video/mp4',
          maxSise: 10, //Mb
        },
        IMAGE: {
          acceptedFileTypes: 'image/jpeg,image/png,image/jpg',
          maxSise: 5, //Mb
        },
        DOCUMENTS: {
          acceptedFileTypes: 'application/pdf',
          maxSise: 10, //Mb
        },
        TEXT: {
          acceptedFileTypes: '',
          maxSise: 0, //Mb
        }
      };

      scope.statusUploader = 'init';

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
      scope.conversationsLink = whatsappDataservice.getConversationsLink();
      scope.conversationsPlanLink = whatsappDataservice.getConversationsPlanLink();
      scope.headerVariables = [];
      scope.bodyVariables = [];
      scope.automationId = automation.getModel().id;

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
                } else {
                  scope.roomOptions = [];
                }
              });
            }
          } else {
            scope.roomOptions = [];
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
      var iframeRef = null;
      let inputUploadFile = null;
      var interval;
      let initIframeInterval;
      let initInputFileInterval;

      function initIframe() {
        iframeRef = document.getElementById('whatsapp_template_iframe');
        if (iframeRef !== null && scope.selectedComponent.template) { 
          iframeRef.src = scope.selectedComponent.template.publicPreviewUrl || "";
          window.clearInterval(initIframeInterval);
        }
      }

      function initInputFile() {
        inputUploadFile = document.getElementById('wspfileInput');
        if (inputUploadFile !== null) {
          inputUploadFile.addEventListener('change', uploadFileSelect, false);
          window.clearInterval(initInputFileInterval);
        }
      }

      function intInputTel() {
        inputRef = document.getElementById('phone_whatsapp');
        if (inputRef !== null) {
          iti = window.intlTelInput(inputRef, {
            placeholderNumberType: 'MOBILE',
            validationNumberType: 'MOBILE',
            nationalMode: true,
            separateDialCode: false,
            autoPlaceholder: 'aggressive',
            preferredCountries: ['ar', 'mx', 'co', 'es', 'ec', 'cl', 'pe', 'us'],
            initialCountry: 'ar'
          });
          window.clearInterval(interval);
          evaluateName();
          inputRef.addEventListener('countrychange', function() {
            changePhoneNumber(whatsappForm);
          });
        }
      }

      if(scope.selectedComponent != null) {
        interval = window.setInterval(intInputTel, 50);
        initIframeInterval = window.setInterval(initIframe, 50);
        initInputFileInterval = window.setInterval(initInputFile, 50);
      }
      if(scope.selectedComponent.template && scope.selectedComponent.template.id > 0) {
        scope.multimediaType = multimediaConstraint[scope.selectedComponent.template.headerType || 'TEXT'];
      }

      scope.changePhoneNumber = changePhoneNumber;

      scope.openSelectFileModal = ()=> {
        inputUploadFile.click();
      };

      scope.test = function() {
        return scope.phoneOptions.length === 0;
      };

      scope.hasRoomSelected = function () {
        return scope.selectedComponent.room.id > 0;
      };

      scope.hasTemplateSelected = function () {
        return scope.hasRoomSelected &&
          scope.selectedComponent.template &&
          scope.selectedComponent.template.id > 0;
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
        iframeRef.src = '';
        whatsappDataservice.getWhatsappTemplatesByRoom(rawFieldData.id)
          .then(function(templateData){
            if(templateData.success){
              scope.templateOptions = templateData.templates;
            } else {
              scope.templateOptions = [];
            }
          });
      };

      scope.onWhatsappTemplateSelected = function(rawFieldData, oldField) {
        if (oldField && oldField.name === rawFieldData.name) {
          return;
        }
        scope.selectedComponent.template = rawFieldData;
        scope.selectedComponent.template.link = rawFieldData.parameterHeader;
        scope.headerVariables = scope.selectedComponent.template.variables.filter(({type}) => type === 'header');
        scope.bodyVariables = scope.selectedComponent.template.variables.filter(({type}) => type === 'body');
        iframeRef.src = scope.selectedComponent.template.publicPreviewUrl || "";
        scope.multimediaType = multimediaConstraint[scope.selectedComponent.template.headerType || 'TEXT'];
      };

      scope.getOptionLabel = function(id) {
        const field = scope.userFields.filter((field) => field.id === id)[0]
        return (field)? field.label : '';
      };

      scope.onVariableSelected = function(fieldSelected, element, whatsappForm) {
        const index = scope.selectedComponent.template.variables.indexOf(element);
        if(scope.selectedComponent.template.variables[index].field &&
          scope.selectedComponent.template.variables[index].field.id == fieldSelected.id){
          return;
        }
        scope.selectedComponent.template.variables[index].field = fieldSelected;
        whatsappForm.whatsappPhoneNumberTest.$error = false;
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

      function getVariables(array) {
        return array.reduce((previousValue, item) => {
          return [...previousValue].concat((item.field)?[item.field.name]:[]);
        }, []);
      }

      scope.sendWhatsappTest = function(whatsappForm) {
        const headerVariables = getVariables(scope.headerVariables);
        const bodyVariables = getVariables(scope.bodyVariables);
        
        if (scope.selectedComponent.whatsappPhoneNumberTest !== '' && scope.selectedComponent.template &&
          (headerVariables.length + bodyVariables.length) === scope.selectedComponent.template.variables.length 
        ) {
          var data = {
            automationId: scope.automationId,
            phoneNumber: scope.selectedComponent.whatsappPhoneNumberTest,
            templateId: scope.selectedComponent.template.id,
            roomId: scope.selectedComponent.room.id,
            phoneRoom: scope.selectedComponent.room.phoneNumber,
            link: scope.selectedComponent.template.link,
            headerType: scope.selectedComponent.template.headerType,
            headerVariables: headerVariables,
            bodyVariables: bodyVariables
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
        } else {
          whatsappForm.whatsappPhoneNumberTest.$error = {
            'isWhatsappPhoneNumberTestValid': true,
            'variableRequired': true
          };
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

      function uploadFileSelect(e) {
        e.stopPropagation();
        e.preventDefault();
        scope.statusUploader = 'pending';
        const file= e.target.files[0];
        if (file) {
          const maxSize = scope.multimediaType.maxSise;
          if(file.size > maxSize * 1024 * 1024) {
            showWhatsAppFileUploadError($translate.instant('automation_editor.sidebar.whatsapp.upload_fileSize_message_error', {fileSize: maxSize}));
            return;
          }
          const typesAccepted =  scope.multimediaType.acceptedFileTypes.split(',');
          if(typesAccepted.indexOf(file.type) == -1) {
            showWhatsAppFileUploadError($translate.instant('automation_editor.sidebar.whatsapp.upload_file_ext_message_error'));
            return;
          }
          const formData = new FormData();
          formData.append('file', file);
          formData.append('idAutomation', scope.automationId);
          whatsappDataservice.uploadWhatsappFile(formData).then(function(response){
            if(response.data.success) {
              scope.selectedComponent.template.link = response.data.fileUrl;
              scope.selectedComponent.template.publicPreviewUrl = paramReplace(scope.selectedComponent.template.publicPreviewUrl, 'parameterHeader', response.data.fileUrl);
              iframeRef.src = scope.selectedComponent.template.publicPreviewUrl;
              scope.statusUploader = 'init';
            } else {
              switch (response.data.errorCode) {
                case 88: // file is null
                showWhatsAppFileUploadError(translate.instant('automation_editor.sidebar.whatsapp.upload_file_null_message_error'));
                break;
                case 101: // file is too big
                showWhatsAppFileUploadError($translate.instant('automation_editor.sidebar.whatsapp.upload_fileSize_message_error', {fileSize: maxSize}));
                break;
                case 100: // file has invalid extension
                showWhatsAppFileUploadError($translate.instant('automation_editor.sidebar.whatsapp.upload_file_ext_message_error'));
                break;
                default:
                showWhatsAppFileUploadError(translate.instant('automation_editor.sidebar.whatsapp.upload_file_message_error', {fileName: file.name}));
              }
            }
          });
        }
      }

      function showWhatsAppFileUploadError(msgError){
        scope.sendWhatsappUploadFileResultMessageText = msgError;
        scope.showWhatsappUploadFileResultMessage = true;
        scope.statusUploader = 'init';
        scope.$apply();
        $timeout(() => {
          scope.showWhatsappUploadFileResultMessage = false;
        }, SHOW_RESULT_SEND_MESSAGE_TIME_MS);
      }

      function paramReplace(urlString, queryParam, value) {
        const re = new RegExp("[\\?&]" + queryParam + "=([^&#]*)"),
            newString = urlString.replace(re, '&' + queryParam + "=" + value);
        return newString;
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
