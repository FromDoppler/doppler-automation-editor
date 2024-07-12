(function() {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .directive('dpEditorPanelWhatsapp', dpEditorPanelWhatsapp);

  dpEditorPanelWhatsapp.$inject = [
    'userFieldsDataservice',
    'REGEX',
    'automation',
    'COMPONENT_TYPE',
    'changesManager',
    'settingsService'
  ];

  function dpEditorPanelWhatsapp(userFieldsDataservice, REGEX, automation, COMPONENT_TYPE, changesManager, settingsService) {
    var directive = {
      restrict: 'AE',
      templateUrl: 'angularjs/partials/automation/editor/directives/panel/dp-editor-panel-whatsapp.html',
      link: link
    };

    return directive;

    function link(scope) {
      var iti = null;
      var whatsappForm = null;
      scope.sendingWhatsappTest = false;
      scope.selectedComponent.touched = false;
      scope.phoneOptions = [];
      scope.roomOptions = [];
      scope.templateOptions = [];
      scope.REGEX_SMS = REGEX.REGEX_SMS;
      scope.isLoaded = false;
      scope.getReadOnlyLabel = automation.getReadOnlyLabel;

      scope.$watch('selectedComponent.name', evaluateWhatsappName);

      scope.roomOptions = [
        {
          id: 1,
          name: 'Sala 1',
          phoneNumber: '+1111'
        },
        {
          id: 2,
          name: 'Sala 2',
          phoneNumber: '+1112'
        },
        {
          id: 3,
          name: 'Sala 3',
          phoneNumber: '+1113'
        }
      ];

      scope.templateOptions = [
        {
          id: 1,
          roomId: 1,
          name: 'Plantilla 1',
          content: '<div><strong>Plantilla 1</strong><p>contenido plantilla 1</p></div>'
        },
        {
          id: 2,
          roomId: 1,
          name: 'Plantilla 2',
          content: '<div><strong>Plantilla 2</strong><p>contenido plantilla 2</p></div>'
        },
        {
          id: 3,
          roomId: 1,
          name: 'Plantilla 3',
          content: '<div><strong>Plantilla 3</strong><p>contenido plantilla 3</p></div>'
        },
        {
          id: 4,
          roomId: 2,
          name: 'Plantilla 4',
          content: '<div><strong>Plantilla 4</strong><p>contenido plantilla 4</p></div>'
        },
        {
          id: 5,
          roomId: 2,
          name: 'Plantilla 5',
          content: '<div><strong>Plantilla 5</strong><p>Hola {{{1}}}</p></div>',
          variables: [
            {
              VariableId: 1,
              name: 'nombre',
              field: {
                  "IdField": 319,
                  "Name": "Nombre",
                  "Embed": "[[[first_name]]]",
                  "SampleValue": "FIRST_NAME",
                  "DataType": 2,
                  "IsPrivate": false,
                  "IsBasicField": true,
                  "IsReadOnly": false,
                  "PermissionText": ""
              }
            }
          ]
        },
      ];

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

      scope.charactersCountChange = function(value) {
        scope.charactersCount = value ? value.length : 0;
        scope.WhatsappPartsCount = value ? getWhatsappPartsCount(scope.selectedComponent.WhatsappText) : 0;
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
        //filter templatesOption
      };

      scope.onWhatsappTemplateSelected = function(rawFieldData, oldField) {
        if (oldField && oldField.name === rawFieldData.name) {
          return;
        }
        scope.selectedComponent.template = rawFieldData;
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

      scope.sendWhatsappTest = function(whatsappForm) {
        console.log('send Whatsapp Test ')
      };

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
