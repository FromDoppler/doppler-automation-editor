(function () {
  'use strict';

  angular.module('onImageErrorSrc', []).directive('dpOnErrorSrc', dpOnErrorSrc);

  dpOnErrorSrc.$inject = ['$timeout', '$compile', '$translate'];

  function dpOnErrorSrc($timeout, $compile, $translate) {
    var directive = {
      link: link,
      restrict: 'A',
    };

    return directive;

    function addEye(scope, element) {
      var container = angular.element(
        "<div class='async-preview--container'></div>"
      );
      var eye = angular.element(
        '<img class="async-preview-eye" ng-src="../../../img/asyncPreview/eye-icon-big.svg" />'
      );
      var text = angular.element(
        '<span class="async-preview-text">' +
          $translate.instant('image_placeholder_text') +
          '</span>'
      );
      container.append(eye);
      container.append(text);
      $compile(container)(scope);
      element.after(container);
    }

    function removeEye(element) {
      var children = element.parent().children();
      angular.forEach(children, function (value) {
        if (value.className.indexOf('async-preview--container') !== -1) {
          value.innerHTML = '';
        }
      });
    }

    function link(scope, element, attrs) {
      if (attrs.poll !== undefined) {
        scope.setImageAndRemovePlaceholder = function () {
          var ticks = new Date().getTime();
          if (scope.originalThumbnailUrl.indexOf('?') !== -1) {
            attrs.$set('src', scope.originalThumbnailUrl + ticks);
          } else {
            attrs.$set('src', scope.originalThumbnailUrl + '?' + ticks);
          }
          if (attrs.showEye !== undefined) {
            removeEye(element);
          }
        };
        scope.pollingOptions = {
          pollUrl: '',
          returnWhenRequestFound: true,
          finishOKFunction: scope.setImageAndRemovePlaceholder,
          isConditionMetFunction: undefined,
          errorHandlerFunction: function () {
            throw new Error('error on poll');
          },
          checkDopplerFileThumbnail: true,
        };
        scope.isOngoningPull = false;
        scope.originalThumbnailUrl = '';
      }

      attrs.$observe('src', function (newSrc) {
        if (newSrc !== attrs.dpOnErrorSrc && scope.isOngoningPull) {
          scope.isOngoningPull = false;
          scope.pollingOptions.pollUrl = '';
        }
      });

      /*poll function on polling.js*/
      element.bind('error', function () {
        if (attrs.src !== attrs.dpOnErrorSrc) {
          //on error just once
          if (attrs.poll !== undefined && !scope.isOngoningPull) {
            if (scope.pollingOptions.pollUrl.length === 0) {
              var indexParam = attrs.src.indexOf('?');
              if (indexParam !== -1) {
                scope.pollingOptions.pollUrl = attrs.src.slice(0, indexParam);
              } else {
                scope.pollingOptions.pollUrl = attrs.src;
              }
            }
            scope.originalThumbnailUrl = attrs.src;
            scope.isOngoningPull = true;
            poll(scope.pollingOptions); //eslint-disable-line no-undef
            if (attrs.showEye !== undefined) {
              addEye(scope, element);
            }
          }
          attrs.$set('src', attrs.dpOnErrorSrc);
        }
      });
    }
  }
})();
