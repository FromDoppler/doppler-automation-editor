(function () {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .factory('goToService', goToService);

  goToService.$inject = [
    'warningsStepsService',
  ];

  function goToService(warningsStepsService) {
    var GOTO_SELECTION_OPTS = {
      startPlug: 'disc',
      endPlug: 'arrow2',
      size: 2,
      startPlugSize: 2,
      endPlugSize: 2,
      startSocket: 'bottom',
      endSocket: 'top',
      color: 'rgba(1, 114, 203, 0.7)',
      startPlugColor: '#0172CB',
      endPlugColor: '#0172CB',
      startSocketGravity: [0, 300],
      endSocketGravity: [0, -300],
      dash: false,
    };

    var DEFAULT_LINE_OPTS = {
      startPlug: 'disc',
      endPlug: 'arrow2',
      size: 1,
      startPlugSize: 3,
      endPlugSize: 3,
      startSocket: 'bottom',
      endSocket: 'top',
      color: '#999',
      startPlugColor: '#999',
      endPlugColor: '#999',
      startSocketGravity: [0, 300],
      endSocketGravity: [0, -300],
      dash: false
    };

    var goToComponents = {};

    var service = {
      drawGoToLine: drawGoToLine,
      applyGotoSelectionStyle: applyGotoSelectionStyle,
      applyDefaultStyle: applyDefaultStyle,
      addGotoLine: addGotoLine,
      updateLinePosition: updateLinePosition,
      removeGotoLine: removeGotoLine,
      removeGotoLineByTarget: removeGotoLineByTarget,
      setAllGotoLinesWithDefaultStyle: setAllGotoLinesWithDefaultStyle,
      markComponentInGotoSelection: markComponentInGotoSelection,
      markComponentsInGotoSelection: markComponentsInGotoSelection,
      unmarkAllComponentsInGotoSelection: unmarkAllComponentsInGotoSelection,
      removeAllGotoLinesButSavingComponentsRegistration: removeAllGotoLinesButSavingComponentsRegistration,
      regenerateGotoLinesFromComponentsRegistration: regenerateGotoLinesFromComponentsRegistration,
      drawGoToLineBetweenComponents: drawGoToLineBetweenComponents,
    };
    return service;

    function drawGoToLine(lineObject) {
      var options = lineObject.applyGotoSelectionStyle ? GOTO_SELECTION_OPTS : DEFAULT_LINE_OPTS;
      var line = new LeaderLine(lineObject.sourceElement, lineObject.targetElement, options);
      return line;
    }

    function drawGoToLineBetweenComponents(lineSetup) {
      if (lineSetup.sourceComponentUid && lineSetup.targetComponentUid) {
        var sourceElementId = '#component_'.concat(lineSetup.sourceComponentUid);
        var targetElementId = '#component_'.concat(lineSetup.targetComponentUid);
        return drawGoToLine({
          sourceElement: document.querySelector(sourceElementId).getElementsByClassName('component')[0],
          targetElement: document.querySelector(targetElementId).getElementsByClassName('component')[0],
          applyGotoSelectionStyle: lineSetup.applyGotoSelectionStyle,
        });
      }
      return null;
    }

    function applyGotoSelectionStyle(line) {
      return line.setOptions(GOTO_SELECTION_OPTS);
    }

    function applyDefaultStyle(line) {
      return line.setOptions(DEFAULT_LINE_OPTS);
    }

    function addGotoLine(id, gotoComponent) {
      goToComponents[id] = gotoComponent;
    }

    function updateLinePosition() {
      for (var key in goToComponents) {
        if (goToComponents[key].line) {
          goToComponents[key].line.position();
        }
      }
    }

    function removeGotoLine(id) {
      if (!goToComponents[id]) return;
      if (goToComponents[id].line) {
        goToComponents[id].line.remove();
        goToComponents[id].line = null;
      }
      delete goToComponents[id];
    }

    function removeGotoLineByTarget(id) {
      //valide if exist a goTo line with target at the removed component
      for (var key in goToComponents) {
        if (goToComponents[key].goto == id) {
          goToComponents[key].goto = 0;
          goToComponents[key].checkCompleted();
          warningsStepsService.checkWarningStep(goToComponents[key]);
          removeGotoLine(goToComponents[key].uid);
        }
      }
    }

    function setAllGotoLinesWithDefaultStyle() {
      for (var key in goToComponents) {
        if (goToComponents[key].line) {
          goToComponents[key].line = applyDefaultStyle(goToComponents[key].line);
        }
      }
    }

    function unmarkAllComponentsInGotoSelection(classesToRemove) {
      var components = document.querySelectorAll('.component');
      for (var i = 0; i < components.length; i++) {
        var component = components[i];
        if (component) {
          classesToRemove.forEach(function (c) {
            component.classList.remove(c);
          });
        }
      }

      // set default style to all lines
      setAllGotoLinesWithDefaultStyle();
    }

    function markComponentInGotoSelection(elementUid, hasToMark, classes) {
      if (!elementUid) {
        return;
      }

      var targetElementId = '#component_'.concat(elementUid);
      var component = document.querySelector(targetElementId).getElementsByClassName('component')[0];
      if (component) {
        if (hasToMark) {
          classes.forEach(function (c) {
            component.classList.add(c);
          });
        } else {
          classes.forEach(function (c) {
            component.classList.remove(c);
          });
        }
      }
    }

    function markComponentsInGotoSelection(componentsIds, hasToMark, classes) {
      for (var i = 0; i < componentsIds.length; i++) {
        var componentId = componentsIds[i];
        if (componentId) {
          markComponentInGotoSelection(componentId, hasToMark, classes);
        }
      }
    }

    function removeAllGotoLinesButSavingComponentsRegistration() {
      for (var key in goToComponents) {
        if (goToComponents[key].line) {
          goToComponents[key].line.remove();
          goToComponents[key].line = null;
        }
      }
    }

    function regenerateGotoLinesFromComponentsRegistration() {
      for (var key in goToComponents) {
        var goToComponent = goToComponents[key];
        if (goToComponent && goToComponent.goto) {
          goToComponent.line = drawGoToLineBetweenComponents({
            sourceComponentUid: goToComponent.uid,
            targetComponentUid: goToComponent.goto,
          });
        }
      }
    }
  }
})();
