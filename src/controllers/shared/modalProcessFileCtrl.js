(function () {
  'use strict';

  angular
    .module('dopplerApp')
    .controller('ModalProcessFileCtrl', ModalProcessFileCtrl);

  ModalProcessFileCtrl.$inject = [
    '$scope',
    'close',
    '$rootScope',
    'importService',
    '$translate',
    '$timeout',
  ];

  function ModalProcessFileCtrl(
    $scope,
    close,
    $rootScope,
    importService,
    $translate,
    $timeout
  ) {
    $rootScope.processed = false;
    $rootScope.noFileUploaded = true;
    $scope.processing = false;
    $scope.processingError = false;
    $scope.processedFile = true;

    var importState = {
      READY: 1,
      PROCESSING: 2,
      SUCCESS: 3,
      ERROR: 4,
      DRAG_OVER: 5,
      DRAG_LEAVE: 6,
    };

    $scope.close = function (result) {
      close(result);
    };

    $scope.DRAG_AND_DROP_MESSAGE =
      "<span class='changing-message' ng-class='dragAndDropMsgClass'>dragAndDropMessage</span>";

    $scope.goToHelp = function (e) {
      e.preventDefault();
      e.stopPropagation();
      window.open($translate.instant('modal_process_file.helpLink'), '_blank');
    };

    $scope.updateDragAndDropMessage = function (value) {
      $scope.dragAndDropMessage = $scope.DRAG_AND_DROP_MESSAGE.replace(
        'dragAndDropMessage',
        value
      );
    };

    $scope.updateDropButton = function (isVisible, value) {
      $scope.displayDropButton = isVisible;
      if (isVisible) {
        $scope.dropButtonValue = value;
      }
    };

    $scope.processFile = function () {
      $scope.myDropzone.processQueue();
      $scope.processing = true;
    };

    $scope.updateUploadedFileStatus = function (value, fileName, errorMessage) {
      $scope.progressArrowClass = '';
      switch (value) {
        // ready to drag file
        case importState.READY:
          $scope.progressBarClass = 'ready';
          $scope.progressTrackClass = 'ready';
          $scope.progressIconClass = 'ready';
          $scope.dragAndDropMsgClass = '';
          $scope.updateDropButton(
            true,
            $translate.instant('modal_process_file.dropButton_ready')
          );
          $scope.updateDragAndDropMessage(
            $translate.instant('modal_process_file.dropMessage_ready')
          );
          break;
        // proccessing
        case importState.PROCESSING:
          $scope.progressBarClass = 'processing';
          $scope.progressIconClass = 'ready';
          $scope.progressArrowClass = 'arrow-progress';
          $scope.dragAndDropMsgClass = '';
          $scope.updateDropButton(false);
          $scope.updateDragAndDropMessage(
            $translate.instant('modal_process_file.dropMessage_importing', {
              fileName: $scope.cropFile(fileName, 50),
            })
          );
          break;
        // uploaded successfuly
        case importState.SUCCESS:
          $scope.progressBarClass = 'success';
          $scope.progressTrackClass = 'success';
          $scope.progressIconClass = 'success';
          $scope.dragAndDropMsgClass = '';
          $scope.updateDropButton(
            true,
            $translate.instant('modal_process_file.dropButton_imported')
          );
          $scope.updateDragAndDropMessage(
            $translate.instant('modal_process_file.dropMessage_imported', {
              fileName: $scope.cropFile(fileName, 50),
            })
          );
          break;
        // uploaded with errors
        case importState.ERROR:
          $scope.progressBarClass = 'error';
          $scope.progressTrackClass = 'error';
          $scope.progressIconClass = 'error';
          $scope.dragAndDropMsgClass = 'error';
          $scope.processingError = true;
          $scope.updateDropButton(
            true,
            $translate.instant(
              'modal_process_file.dropButton_importedWithError'
            )
          );
          $scope.updateDragAndDropMessage(errorMessage);
          break;
        // dragging over
        case importState.DRAG_OVER:
          $scope.progressBarClass = 'dragging';
          $scope.progressTrackClass = 'dragging';
          $scope.progressIconClass = 'dragging';
          break;
        // dragging leave
        case importState.DRAG_LEAVE:
          $scope.progressBarClass = 'ready';
          $scope.progressTrackClass = 'ready';
          $scope.progressIconClass = 'ready';
          break;
        default:
          throw new Error('Unknown file status cannot be parsed.');
      }
    };
    $scope.updateUploadedFileStatus(1);
    $scope.dropzoneConfig = {
      options: {
        url: '/Lists/MasterSubscriber/SubmitFile',
        maxFiles: 1,
        addRemoveLinks: false,
        paramName: 'fileName',
        maxFilesize: 5,
        createImageThumbnails: false,
        maxThumbnailFilesize: 0,
        dictMaxFilesExceeded: $translate.instant(
          'modal_process_file.errorMessage_maxFiles'
        ),
        dictFileTooBig: $translate
          .instant('modal_process_file.errorMessage_fileSize')
          .replace('fileSize', '{{maxFilesize}}'),
        dictInvalidFileType: $translate.instant(
          'modal_process_file.import_dragAndDrop_InvalidFileType'
        ),
        forceFallback: false,
        autoProcessQueue: false,
        acceptedFiles: '.csv, .txt, .zip',

        init: function () {
          $scope.myDropzone = this;

          $scope.cancelUpload = function (e) {
            e.preventDefault();
            e.stopPropagation();
            $scope.myDropzone.removeAllFiles(true);
          };

          $scope.cropFile = function (text, nbrChars) {
            var n = text.length;
            var result = text;

            if (n > nbrChars) {
              var split = result.split('.');
              result = split[0].substring(0, nbrChars - 6) + '...' + split[1];
            }
            return result;
          };

          $scope.drawProgress = function (percent) {
            if (isNaN(percent)) {
              return;
            }
            percent = parseFloat(percent);
            // Alot of the code below is inspired by a project I came across
            // online. I've saddly lost a reference to it. Do you know where
            // this might have come from?
            var bar = document.getElementsByClassName('progress-radial-bar')[0],
              α = percent * 360,
              π = Math.PI,
              w = 63;

            if (α >= 360) {
              α = 359.999;
            }

            var r = (α * π) / 180,
              x = Math.sin(r) * w,
              y = Math.cos(r) * -w,
              mid = α > 180 ? 1 : 0,
              animBar =
                'M 0 0 v -%@ A %@ %@ 1 '.replace(/%@/gi, w) +
                mid +
                ' 1 ' +
                x +
                ' ' +
                y +
                ' z';

            bar.setAttribute('d', animBar);
          };

          $scope.resetProgress = function () {
            $scope.drawProgress(0.0);
          };
        },

        fallback: function () {},
      },

      eventHandlers: {
        success: function (file, response) {
          if (response.success === true || response.errorMessage.length === 0) {
            $rootScope.noFileUploaded = false;
            $rootScope.processed = true;
            $scope.$apply(
              $scope.updateUploadedFileStatus(
                3,
                file.name.toString(),
                '',
                response.Content
              )
            );
          } else {
            $scope.$apply(
              $scope.updateUploadedFileStatus(
                4,
                file.name.toString(),
                response.errorMessage
              )
            );
          }
        },
        error: function (file, errorMsg, xhr) {
          if (file.status === 'canceled') {
            /*back to default screen*/
            $scope.$apply($scope.updateUploadedFileStatus(1));
            $scope.resetProgress();
          } else if (
            file.status === 'error' &&
            xhr !== undefined &&
            xhr.status === 500
          ) {
            /*session expired*/
            location.reload();
          } else {
            $scope.$apply(
              $scope.updateUploadedFileStatus(4, file.name.toString(), errorMsg)
            );
          }
        },
        complete: function () {
          $scope.myDropzone.removeAllFiles(true);
        },
        addedfile: function (file) {
          if ($scope.myDropzone.files.length > 1) {
            var first = $scope.myDropzone.files[0];
            $scope.myDropzone.removeFile(first);
          }
          $scope.processing = false;
          $scope.$apply($scope.updateUploadedFileStatus(1));
          $scope.updateDragAndDropMessage(
            $translate.instant('modal_process_file.selected_file', {
              fileName: $scope.cropFile(file.name, 50),
            })
          );
          $rootScope.noFileUploaded = false;
          $scope.updateDropButton(
            true,
            $translate.instant('modal_process_file.dropButton_imported')
          );
          $scope.$digest();
          $rootScope.$digest();
          $scope.processedFile = false;
        },
        dragover: function () {
          $scope.$apply($scope.updateUploadedFileStatus(5));
        },
        dragleave: function () {
          $scope.$apply($scope.updateUploadedFileStatus(6));
        },
        uploadprogress: function (file, progress) {
          var progressDec = progress / 100;
          if (progressDec <= 0.9) {
            $scope.drawProgress(progressDec);
          } else {
            $scope.$apply(
              $scope.updateUploadedFileStatus(3, file.name.toString(), '', '')
            );
          }
        },
        processing: function (file) {
          $scope.resetProgress();
          //when changing dropzone mode, progress does not work 'autoProcessQueue': false,
          if (!$scope.processedFile) {
            $timeout(function () {
              $scope.$apply(
                $scope.updateUploadedFileStatus(2, file.name.toString())
              );
            }, 100);
            $scope.processedFile = true;
          }
        },
      },
    };
  }
})();
