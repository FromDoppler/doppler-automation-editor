(function () {
  'use strict';

  angular.module('dopplerApp').directive('tooltip', tooltip);

  function tooltip() {
    var directive = {
      restrict: 'A',
      link: link,
    };

    return directive;

    function link(scope, element) {
      element[0].parentElement.addEventListener('mousemove', function (e) {
        //find X & Y coodrinates
        var xy = getEventOffsetXY(e);
        element[0].style.top = xy[1] + 'px';
        element[0].style.left = xy[0] + 10 + 'px';
      });

      function getEventOffsetXY(evt) {
        if (evt.offsetX !== null) {
          return [evt.offsetX, evt.offsetY];
        }

        var obj = evt.target || evt.srcElement;
        setPageTopLeft(obj);
        return [evt.clientX - obj.pageLeft, evt.clientY - obj.pageTop];
      }

      function setPageTopLeft(o) {
        var top = 0,
          left = 0,
          obj = o;

        while (o.offsetParent) {
          left += o.offsetLeft;
          top += o.offsetTop;
          o = o.offsetParent;
        }

        obj.pageTop = top;
        obj.pageLeft = left;
      }
    }
  }
})();
