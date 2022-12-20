(function() {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .directive('dpEditorImportHtml', dpEditorImportHtml);

  dpEditorImportHtml.$inject = [
    '$interpolate',
    '$rootScope',
    '$translate',
    'automation',
    'changesManager',
    'CHANGE_TYPE',
    'CONTENT_TYPE',
    'selectedElementsService',
    'warningsStepsService'
  ];

  function dpEditorImportHtml($interpolate, $rootScope, $translate, automation, changesManager, CHANGE_TYPE,
    CONTENT_TYPE, selectedElementsService, warningsStepsService) {
    var directive = {
      restrict: 'E',
      templateUrl: 'angularjs/partials/automation/editor/directives/dp-editor-import-html.html',
      controller: ['$scope', controller]
    };

    return directive;

    function controller($scope) {
      var selectedEmail = selectedElementsService.getSelectedComponent();
      $scope.htmlContent = '';
      automation.getHtmlContent(selectedEmail.id).then(function(htmlResult) {
        $scope.htmlContent = htmlResult;
      });
      $scope.isDynamicAutomation = ($scope.rootComponent.automationType === 'abandoned_cart'
        || $scope.rootComponent.automationType === 'visited_products'
        || $scope.rootComponent.automationType === 'confirmation_order')
        && selectedEmail.id === $scope.rootComponent.children[0].id;
      var templateDragAndDropMessage = '<span class="changing-message {{dragAndDropClass}}">{{dragAndDropMessage}}</span>';
      $scope.updateUploadedFileStatus = function(value, fileName, errorMessage, htmlContent) {
        $scope.progressArrowClass = '';
        switch (value) {
        // ready to drag file
        case 1:
          $scope.progressBarClass = 'ready';
          $scope.progressTrackClass = 'ready';
          $scope.progressIconClass = 'ready';
          $scope.isButtonEnabled = false;
          $scope.updateDragAndDropMessage($translate.instant('automation_editor.import_file.drag_text'), '');
          $scope.updateDropButton(true, $translate.instant('automation_editor.import_file.drag_button'));
          break;
        // proccessing
        case 2:
          $scope.progressBarClass = 'processing';
          $scope.progressIconClass = 'ready';
          $scope.progressArrowClass = 'arrow-progress';
          $scope.updateDragAndDropMessage($translate.instant('automation_editor.import_file.importing', {
            fileName: $scope.cropFile(fileName, 50)
          }), '');
          $scope.updateDropButton(false);
          break;
        // uploaded successfuly
        case 3:
          $scope.progressBarClass = 'success';
          $scope.progressTrackClass = 'success';
          $scope.progressIconClass = 'success';
          $scope.isButtonEnabled = true;
          $scope.updateDragAndDropMessage($translate.instant('automation_editor.import_file.imported', {
            fileName: $scope.cropFile(fileName, 50)
          }), '');
          $scope.updateDropButton(true, $translate.instant('automation_editor.import_file.drag_button_imported'));
          $scope.updateHtmlPreviewContainer(true, htmlContent);
          break;
        // uploaded with errors
        case 4:
          $scope.progressBarClass = 'error';
          $scope.progressTrackClass = 'error';
          $scope.progressIconClass = 'error';
          $scope.updateDragAndDropMessage(errorMessage, 'error');
          $scope.uploadedFileHadErrors = true;
          $scope.updateDropButton(true, $translate.instant('automation_editor.import_file.drag_button_imported_error'));
          $scope.updateHtmlPreviewContainer(false);
          break;
        // dragging over
        case 5:
          $scope.progressBarClass = 'dragging';
          $scope.progressTrackClass = 'dragging';
          $scope.progressIconClass = 'dragging';
          break;
        // dragging leave
        case 6:
          $scope.progressBarClass = 'ready';
          $scope.progressTrackClass = 'ready';
          $scope.progressIconClass = 'ready';
          break;
        default:
          throw new Error('Unknown file status.');
        }
      };

      $scope.updateDragAndDropMessage = function(dragAndDropMessage, dragAndDropClass) {
        var miniScope = {
          dragAndDropMessage: dragAndDropMessage,
          dragAndDropClass: dragAndDropClass
        };
        $scope.dragAndDropMessage = $interpolate(templateDragAndDropMessage)(miniScope);
      };

      $scope.updateDropButton = function(isVisible, value) {
        $scope.showDragAndDropButton = isVisible;
        if (isVisible) {
          $scope.dragAndDropButtonValue = value;
        }
      };

      $scope.updateHtmlPreviewContainer = function(isVisible, htmlContent) {
        $scope.showHtmlPreview = isVisible;
        $scope.htmlContent = isVisible ? htmlContent : '';
      };

      $scope.goToHelp = function(e) {
        e.preventDefault();
        e.stopPropagation();
        var url;
        switch ($scope.rootComponent.automationType) {
        case 'abandoned_cart':
          url = 'automation_editor.import_file.abandoned_cart_tip_link_url';
          break; 
        case 'visited_products':
          url = 'automation_editor.import_file.visited_products_tip_link_url';
          break;
        default:
          url = 'automation_editor.import_file.help_url';
        }
        window.open($translate.instant(url), '_blank');
      };

      $scope.confirmImportedHtml = function() {
        automation.saveCampaign(selectedEmail, $scope.htmlContent).then(function(response) {
          var data = {
            contentType: CONTENT_TYPE.IMPORT,
            hasUnsavedChanges: true,
            innerHTML: '',
            thumbnailUrl: response.previewUrl + '?' + Math.random().toString().split('.')[1]
          };

          changesManager.disable();
          // TO DO: enable undo/redo when we have all contents ready for this.

          // changesManager.add({
          //   type: CHANGE_TYPE.IMPORT_HTML,
          //   uid: selectedEmail.uid,
          //   parentUid: selectedEmail.parentUid,
          //   oldValue: {
          //     contentType: selectedEmail.contentType,
          //     hasUnsavedChanges: true,
          //     innerHTML: selectedEmail.innerHTML,
          //     thumbnailUrl: selectedEmail.thumbnailUrl
          //   },
          //   newValue: {
          //     contentType: CONTENT_TYPE.IMPORT,
          //     hasUnsavedChanges: true,
          //     innerHTML: $scope.htmlContent,
          //     thumbnailUrl: data.thumbnailUrl
          //   }
          // });

          selectedEmail.setData(data);
          //If we don't use undo redo, we need to call checkCompleted and checkWarningStep manually
          selectedEmail.hasUnsavedChanges = true;
          selectedEmail.checkCompleted();
          automation.checkCompleted();
          warningsStepsService.checkWarningStep(selectedEmail);

          automation.saveChanges().then(function() {
            $rootScope.$broadcast('UPDATE_SAVING_STATE');
            changesManager.enable();
          });
          $scope.toggleImportHtmlView(false);
        });
      };

      $scope.updateUploadedFileStatus(1);

      if (selectedEmail.thumbnailUrl !== '' && selectedEmail.contentType === CONTENT_TYPE.IMPORT) {
        $scope.updateDropButton(true, $translate.instant('automation_editor.import_file.drag_button_imported'));
        $scope.updateHtmlPreviewContainer(true, $scope.htmlContent);
      } else {
        $scope.updateHtmlPreviewContainer(false);
      }

      $scope.dropzoneConfig = {
        'options': {
          'url': '/AutomationMFE/Content/SubmitFile?idCampaign=' + selectedEmail.id.toString() + '&validateDynamicContent=' + $scope.isDynamicAutomation,
          'maxFiles': 1,
          'addReomveLinks': true,
          'paramName': 'fileName',
          'maxFilesize': 50,
          'createImageThumbnails': false,
          'maxThumbnailFilesize': 0,
          'dictMaxFilesExceeded': $translate.instant('automation_editor.import_file.error_max_files'),
          'dictFileTooBig': $translate.instant('automation_editor.import_file.error_file_size').replace('fileSize', '{{maxFilesize}}'),
          'forceFallback': false,

          'init': function() {
            $scope.myDropzone = this;

            $scope.cancelUpload = function(e) {
              e.preventDefault();
              e.stopPropagation();
              $scope.myDropzone.removeAllFiles(true);
            };

            $scope.cropFile = function(text, nbrChars) {
              var n = text.length;
              var result = text;

              if (n > nbrChars) {
                var split = result.split('.');
                result = split[0].substring(0, nbrChars - 6) + '...' + split[1];
              }
              return result;
            };

            $scope.drawProgress = function(percent) {
              if (isNaN(percent)) {
                return;
              }
              percent = parseFloat(percent);
              // Alot of the code below is inspired by a project I came across
              // online. I've saddly lost a reference to it. Do you know where
              // this might have come from?
              var bar = document.getElementsByClassName('progress-radial-bar')[0];
              var α = percent * 360;
              var π = Math.PI;
              var w = 63;

              if (α >= 360) {
                α = 359.999;
              }

              var r = (α * π / 180);
              var x = Math.sin(r) * w;
              var y = Math.cos(r) * -w;
              var mid = (α > 180) ? 1 : 0;
              var animBar = 'M 0 0 v -%@ A %@ %@ 1 '.replace(/%@/gi, w) + mid + ' 1 ' + x + ' ' + y + ' z';

              bar.setAttribute('d', animBar);
            };

            $scope.resetProgress = function() {
              $scope.drawProgress(0.0);
            };
          },

          'fallback': function() {
          }
        },

        'eventHandlers': {
          'success': function(file, response) {
            if (response.success) {
              $scope.$apply($scope.updateUploadedFileStatus(3, file.name.toString(), '', response.Content));
            } else {
              $scope.$apply($scope.updateUploadedFileStatus(4, file.name.toString(), response.errorMessage));
            }
          },
          'error': function(file, errorMsg, xhr) {
            if (file.status === 'canceled') {
              //back to default screen
              $scope.$apply($scope.updateUploadedFileStatus(1));
              $scope.$apply($scope.updateHtmlPreviewContainer(false));
              $scope.resetProgress();
            } else if (file.status === 'error' && xhr !== undefined && xhr.status === 500) {
              //session expired
              location.reload();
            } else {
              $scope.$apply($scope.updateUploadedFileStatus(4, file.name.toString(), errorMsg));
            }
          },
          'complete': function() {
            $scope.myDropzone.removeAllFiles(true);
          },
          'addedfile': function() {
            $scope.$apply($scope.updateUploadedFileStatus(1));
          },
          'dragover': function() {
            $scope.$apply($scope.updateUploadedFileStatus(5));
          },
          'dragleave': function() {
            $scope.$apply($scope.updateUploadedFileStatus(6));
          },
          'uploadprogress': function(file, progress) {
            var progressDec = progress / 100;
            if (progressDec <= 0.9) {
              $scope.drawProgress(progressDec);
            }
          },
          'processing': function(file) {
            $scope.resetProgress();
            $scope.$apply($scope.updateUploadedFileStatus(2, file.name.toString()));
          }
        }
      };
    }
  }
})();
