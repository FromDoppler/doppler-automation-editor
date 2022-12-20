(function () {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .directive('dpEditorPanelGoto', dpEditorPanelGoto);

  dpEditorPanelGoto.$inject = [
    '$translate',
    'automation',
    'goToService',
    'COMPONENT_TYPE'
  ];

  function dpEditorPanelGoto($translate, automation, goToService, COMPONENT_TYPE) {
    var directive = {
      restrict: 'AE',
      templateUrl: 'angularjs/partials/automation/editor/directives/panel/dp-editor-panel-goto.html',
      link: link
    };

    return directive;

    function link(scope) {
      var goToSelectionIndex = 0;
      var gotoComponentsUnavailables = [];
      scope.selectedComponent.gotoComponentsAvailables = [];

      goToService.unmarkAllComponentsInGotoSelection(['goto-connected', 'goto-target-available', 'goto-target-unavailable', 'dp-tooltip-container']);
      loadComponentsToInteract();
      markComponentsAvailables();
      markComponentsUnavailables();
      scope.gotoComponents = getComponentList();

      //identify components ids to mark like connected (source and possible target)
      var idsToMarkInSelection = [];
      idsToMarkInSelection.push(scope.selectedComponent && scope.selectedComponent.uid);
      if (scope.selectedComponent && scope.selectedComponent.line) {
        scope.selectedComponent.line = goToService.applyGotoSelectionStyle(scope.selectedComponent.line);
        idsToMarkInSelection.push(scope.selectedComponent.goto);
      }
      goToService.markComponentsInGotoSelection(idsToMarkInSelection, true, ['goto-connected']);

      scope.gotoSelected = function (value) {
        if (value !== scope.selectedComponent.goto) {
          goToService.unmarkAllComponentsInGotoSelection(['goto-connected', 'goto-possible-connection']);

          goToService.removeGotoLine(scope.selectedComponent.uid);
          scope.selectedComponent.line = goToService.drawGoToLineBetweenComponents({
            sourceComponentUid: scope.selectedComponent.uid,
            targetComponentUid: value,
            applyGotoSelectionStyle: true,
          });
          goToService.addGotoLine(scope.selectedComponent.uid, scope.selectedComponent);

          goToService.markComponentInGotoSelection(scope.selectedComponent.uid, true, ['goto-connected']);
          goToService.markComponentInGotoSelection(value, true, ['goto-connected']);
        }
        scope.selectedComponent.goto = value;
        scope.dropDownLabel = getUidComponentLabel(value);
      };

      scope.getDropDownLabel = function () {
        return (scope.selectedComponent && scope.selectedComponent.goto) ? getUidComponentLabel(scope.selectedComponent.goto) : $translate.instant('automation_editor.canvas.goto_step_placeholder');
      }

      function addGoToSelectionIndexToComponent(componentUid, goToSelectionIndex) {
        document.querySelector('#component_'.concat(componentUid)).getElementsByClassName("uid-label-component")[0].innerText = goToSelectionIndex;
      }

      function getComponentList() {
        var componentList = [];
        var availablesComponentList = scope.selectedComponent.gotoComponentsAvailables;
        for (var i = 0; i < availablesComponentList.length; i++) {
          componentList.push({
            value: availablesComponentList[i].component.uid,
            label: getLabelComponent(availablesComponentList[i])
          });
          addGoToSelectionIndexToComponent(availablesComponentList[i].component.uid, availablesComponentList[i].goToSelectionIndex);
        }
        return componentList;
      }

      function getLabelComponent(item) {
        var imagePath = "../images/automation-".concat(item.component.type).concat(".svg");
        var imgTag = "<img class='dropdown-image' src='".concat(imagePath).concat("'/>");
        var spanUidTag = "<span class='dropdown-uid-label'>".concat(item.goToSelectionIndex).concat(".</span>");
        var componentName = item.component.name && item.component.name.length > 0 ? item.component.name :
          $translate.instant('automation_editor.canvas.'.concat(item.component.type).concat("_icon"));
        var spanNameTag = "<span class='dropdown-name-label'>".concat(componentName).concat("</span>");
        return imgTag.concat(spanUidTag).concat(spanNameTag);
      }

      function getUidComponentLabel(uid) {
        var availablesComponentList = scope.selectedComponent.gotoComponentsAvailables;
        var result = _.find(availablesComponentList, function (item) {
          return item.component.uid == uid
        });
        return getLabelComponent(result);
      }

      function loadComponentsToInteract() {
        setComponentAvailability(automation.getModel().children, scope.selectedComponent.uid);
      }

      function setComponentAvailability(components, from, index) {
        var index = index || 0;
        var value = false;
        var isArray = Array.isArray(components);
        if (isArray && components.length === 0) return true;
        var component = components[index];
        if (component.type == "condition") { //if both branch has available components the condition is a available component too
          var positive = setComponentAvailability(component.positiveSiblings, from);
          var negative = setComponentAvailability(component.negativeSiblings, from);
          value = positive && negative;
        }
        else if (index == components.length - 1) { //end node
          value = component.uid != from && !isGotoComponentDefined(component);
        }
        else { //if the next is an available component, this is an available component too
          value = setComponentAvailability(components, from, index + 1);
        }
        if (value && component.type !== COMPONENT_TYPE.GOTO_STEP) {
          goToSelectionIndex++;
          scope.selectedComponent.gotoComponentsAvailables.push({ component: component, goToSelectionIndex: goToSelectionIndex });
        }
        else {
          gotoComponentsUnavailables.push(component);
        }
        return value;
      }

      function isGotoComponentDefined(component) {
        return component.type === COMPONENT_TYPE.GOTO_STEP && component.goto > 0;
      }

      function markComponentsAvailables() {
        var availablesComponentList = scope.selectedComponent.gotoComponentsAvailables;
        for (var i = 0; i < availablesComponentList.length; i++) {
          goToService.markComponentInGotoSelection(availablesComponentList[i].component.uid, true, ['goto-target-available']);
        }
      }

      function markComponentsUnavailables() {
        //mark initial condition
        document.querySelector('.initial-step--container').classList.add('goto-target-unavailable');
        var unavailablesComponentList = gotoComponentsUnavailables;
        for (var i = 0; i < unavailablesComponentList.length; i++) {
          goToService.markComponentInGotoSelection(unavailablesComponentList[i].uid, true, ['goto-target-unavailable', 'dp-tooltip-container']);
        }
        goToService.markComponentInGotoSelection(scope.selectedComponent.uid, false, ['goto-target-unavailable', 'dp-tooltip-container']);
      }

    }
  }
})();
