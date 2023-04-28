(function () {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .directive('dpEditorHtmlPreview', dpEditorHtmlPreview);

  dpEditorHtmlPreview.$inject = ['$compile'];

  function dpEditorHtmlPreview($compile) {
    var directive = {
      link: link,
      restrict: 'E',
      scope: {
        content: '=',
        url: '@',
      },
    };

    return directive;

    function link(scope, element, attrs) {
      var iframe = document.createElement('iframe');
      // Create a "class" attribute
      iframe.setAttributeNode(document.createAttribute('ng-nicescroll'));
      // Create a "class" attribute
      var attOptions = document.createAttribute('nice-option');
      attOptions.value =
        '{iframeautoresize: true,autohidemode: false, background: "#DCDCDC", cursorcolor: "#7F7F7F", cursorborder: 0, railalign: "center", zindex: 99999}';
      iframe.setAttributeNode(attOptions);

      if (scope.url !== undefined) {
        iframe.src = scope.url;
      }
      // set container class
      if (attrs.previewclass !== undefined) {
        var att = document.createAttribute('class');
        att.value = attrs.previewclass;
        iframe.setAttributeNode(att);
      }

      iframe.onload = function () {
        if (scope.url === undefined) {
          this.contentDocument.body.innerHTML = scope.content;
        }
      };

      var element0 = element[0];
      element0.appendChild(iframe);
      if (scope.content !== undefined) {
        scope.$watch('content', function () {
          var idocument = iframe.contentDocument;
          idocument.open();
          idocument.write(
            '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"   "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">'
          );
          idocument.write('<html>');
          idocument.write('<head></head>');
          idocument.write("<body style='margin:0px'></body>");
          idocument.write('</html>');
          idocument.close();
          idocument.body.innerHTML = scope.content;
        });
      }

      $compile(iframe)(scope);
    }
  }
})();
