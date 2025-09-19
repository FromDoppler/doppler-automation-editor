(function() {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .directive('dpEditorPanelPush', dpEditorPanelPush);

  dpEditorPanelPush.$inject = [
    'automation',
    'REGEX',
    'settingsService',
    'pushService'
  ];

  function dpEditorPanelPush(automation, REGEX, settingsService, pushService) {
    var directive = {
      restrict: 'AE',
      templateUrl: 'angularjs/partials/automation/editor/directives/panel/dp-editor-panel-push.html',
      link: link
    };

    return directive;

    function link(scope) {
      scope.hasExcededCredits = false;

      pushService.GetPushNotificationSettings()
        .then(function(res) {
        scope.hasExcededCredits = res.hasExcededCredits;
      });

      scope.automationId = automation.getModel().id;
      settingsService.getSettings().then(function(response) {
        scope.idUser = response.idUser;
      });

      scope.acceptedFileTypes = 'image/jpeg, image/png, image/jpg';
      scope.statusUploader = 'init';

      scope.hideExcededCreditsMessage = function () {
        scope.hasExcededCredits = false;
      }

      function saveImagePush() {
        var formData = new FormData();
        formData.append('file', scope.imageFile);
        formData.append('idUser', scope.idUser);
        formData.append('idAutomation', scope.automationId);
        pushService.UploadPushImage(formData)
          .then(function(res) {
            scope.progressCounter = 100;
            scope.statusUploader = 'success';
            scope.selectedComponent.pushMessageImageUrl = res.imageUrl;
            scope.thumbnailUrl = res.thumbnailUrl;
          })
          .catch(function(e) {
            scope.statusUploader = 'error';
            console.log('error:', e);
          });
      }
      
      function progressCounter() {
        scope.progressCounter = 0;
        var progressInterval = setInterval(
          function() {
            scope.progressCounter++;
            scope.$apply();
            if (scope.progressCounter > 90) {
              clearInterval(progressInterval);
            }
          }, 1);
      }

      function uploadImageSelect(e) {
        e.stopPropagation();
        e.preventDefault();
        progressCounter();
        scope.imageFile = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
        if (scope.imageFile) {
          scope.statusUploader = 'pending';
          var reader = new FileReader();
          reader.onload = function(e) {
            scope.selectedComponent.imageSrc = e.target.result;
          };
          reader.readAsDataURL(scope.imageFile);
          saveImagePush();
        } else {
          scope.statusUploader = 'init';
        }
      }
           
      function dragOverUploader(e) { 
        e.stopPropagation();
        e.preventDefault(); 
        e.dataTransfer.dropEffect = 'copy'; 
      }
      
      scope.clearUploader = function() {
        scope.selectedComponent.pushMessageImageUrl = null;
        scope.selectedComponent.imageSrc = null;
        scope.imageFile = null;
        scope.thumbnailUrl = null;
        scope.statusUploader = 'init';
      };
      
      scope.openSelectFileModal = function() {
        document.getElementById('fileInput').click();
      };

      var fileInput = document.getElementById('fileInput');
      var containerUploader = document.getElementById('containerUploader');
      
      fileInput.addEventListener('change', uploadImageSelect, false); 
      containerUploader.addEventListener('dragover', dragOverUploader, false); 
      containerUploader.addEventListener('drop', uploadImageSelect, false); 
      
      scope.selectedComponent.touched = false;
      scope.getReadOnlyLabel = automation.getReadOnlyLabel;
      scope.charactersCountTitle = scope.selectedComponent.pushMessageTitle ? scope.selectedComponent.pushMessageTitle.length : 0;
      scope.charactersCountBody = scope.selectedComponent.pushMessageBody ? scope.selectedComponent.pushMessageBody.length : 0;
      scope.regexpHttps = REGEX.STRICT_START_HTTPS;
      scope.regexpUrl = REGEX.URL_WITH_SUBFOLDERS_HTTPS_ONLY;

      scope.charactersCountTitleChange = function(value) {
        scope.charactersCountTitle = value ? value.length : 0;
      };

      scope.charactersCountBodyChange = function(value) {
        scope.charactersCountBody = value ? value.length : 0;
      };

      var clearLinkErrors = function() {
        scope.invalidUrl = false;
        scope.invalidHttpsStart = false;
      }

      scope.clearErrorsOnEmptyLink = function() {
        return (scope.selectedComponent.pushMessageOnClickLink !== "") || clearLinkErrors();
      }
      
      scope.validationLinkUrl = (function() {
        return {
          test: function(url) {
            clearLinkErrors();
            if (!scope.regexpHttps.test(url)) {
                scope.invalidHttpsStart = true;
              } else if (!scope.regexpUrl.test(url)) {
                scope.invalidUrl = true;  
              } else {
                return true;  
            }
            return false;
          }
        };
      })();
      
    }
  }
})();
