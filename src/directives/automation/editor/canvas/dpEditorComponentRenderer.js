(function () {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .directive('dpEditorComponentRenderer', dpEditorComponentRenderer);

  dpEditorComponentRenderer.$inject = [
    '$compile',
    'automation',
    'changesManager',
    'CHANGE_TYPE',
    'selectedElementsService',
    'goToService',
    'COMPONENT_TYPE',
  ];

  function dpEditorComponentRenderer(
    $compile,
    automation,
    changesManager,
    CHANGE_TYPE,
    selectedElementsService,
    goToService,
    COMPONENT_TYPE
  ) {
    var directive = {
      link: link,
      restrict: 'E',
      scope: {
        branch: '=',
        component: '=',
        parentUid: '=',
      },
      templateUrl:
        'angularjs/partials/automation/editor/directives/canvas/dp-editor-component-renderer.html',
    };

    return directive;

    function link(scope, element) {
      // Compile directive using shape markup and scope, passing "component" as value in the scope.
      if (scope.component) {
        var component = $compile(scope.component.markup)(scope);
        element.children().append(component);
        element.bind('mouseenter', showBorderAndToolbar);
        element.bind('mouseleave', onMouseleave);
        component.bind('click', onElementClicked);
        selectedElementsService.addComponentElement(
          scope.component.uid,
          element[0]
        );
      }

      function componentTypeIs(component, type) {
        return component && component.type === type;
      }

      function isOnGotoSelection() {
        if (automation.isReadOnly()) {
          return false;
        }

        var previousSelectedComponent =
          selectedElementsService.getSelectedComponent();

        // the previous one is a "goto"
        return componentTypeIs(
          previousSelectedComponent,
          COMPONENT_TYPE.GOTO_STEP
        );
      }

      function processGotoSelection() {
        var previousSelectedComponent =
          selectedElementsService.getSelectedComponent();

        if (
          isOnGotoSelection() &&
          previousSelectedComponent &&
          scope.component
        ) {
          // create line and the assign
          var newLine = goToService.drawGoToLineBetweenComponents({
            sourceComponentUid: previousSelectedComponent.uid,
            targetComponentUid: scope.component.uid,
            applyGotoSelectionStyle: true,
          });

          goToService.removeGotoLine(previousSelectedComponent.uid);

          previousSelectedComponent.line = newLine;
          previousSelectedComponent.goto = scope.component.uid;
          goToService.addGotoLine(
            previousSelectedComponent.uid,
            previousSelectedComponent
          );

          scope.$apply();
        }
      }

      scope.removeComponent = function () {
        var index = automation.getComponentIndex(
          scope.component,
          scope.component.parentUid,
          scope.branch
        );
        automation.deleteComponent(scope.component, scope.branch);

        changesManager.add({
          type: CHANGE_TYPE.DELETE_COMPONENT,
          component: scope.component,
          index: index,
          branch: scope.branch,
        });
      };

      function isComponentAvailableToBeConnected(currentComponentUi) {
        var gotoComponent = selectedElementsService.getSelectedComponent();
        if (!gotoComponent || !gotoComponent.gotoComponentsAvailables) {
          return false;
        }

        for (
          var i = 0;
          i < gotoComponent.gotoComponentsAvailables.length;
          i++
        ) {
          var component = gotoComponent.gotoComponentsAvailables[i].component;
          if (component && component.uid == currentComponentUi) {
            return true;
          }
        }

        return false;
      }

      function mustToSelectCurrentComponentClickedAfterTreatGotoSelection() {
        // click dpEditorComponentRenderer (when includes dpEditorCondition), but click on dpEditorCondition is being treated there
        if (
          isOnGotoSelection() &&
          componentTypeIs(scope.component, COMPONENT_TYPE.CONDITION)
        ) {
          goToService.unmarkAllComponentsInGotoSelection([
            'goto-target-available',
            'goto-target-unavailable',
            'goto-connected',
            'dp-tooltip-container',
          ]);
          return true;
        } else if (
          isOnGotoSelection() &&
          !componentTypeIs(scope.component, COMPONENT_TYPE.CONDITION) &&
          !componentTypeIs(scope.component, COMPONENT_TYPE.GOTO_STEP)
        ) {
          // the target box to go was selected
          if (!isComponentAvailableToBeConnected(scope.component.uid)) {
            return false;
          }

          goToService.unmarkAllComponentsInGotoSelection(['goto-connected']);

          processGotoSelection();

          // identify components ids to mark like connected
          var idsToMarkInSelection = [];
          idsToMarkInSelection.push(scope.component && scope.component.uid);
          var previousSelectedComponent =
            selectedElementsService.getSelectedComponent();
          idsToMarkInSelection.push(
            previousSelectedComponent && previousSelectedComponent.uid
          );

          goToService.markComponentsInGotoSelection(
            idsToMarkInSelection,
            true,
            ['goto-connected']
          );

          return false;
        }

        return true;
      }

      function onElementClicked(event) {
        if (!mustToSelectCurrentComponentClickedAfterTreatGotoSelection()) {
          event.stopImmediatePropagation();
          return;
        }

        selectedElementsService.setSelectedComponent(scope.component);
        automation.toggleCollapsePanel(false);
        event.stopImmediatePropagation();
      }

      function showBorderAndToolbar() {
        element[0].classList.add('border-toolbar');

        if (
          isOnGotoSelection() &&
          !componentTypeIs(scope.component, COMPONENT_TYPE.CONDITION) &&
          !componentTypeIs(scope.component, COMPONENT_TYPE.GOTO_STEP) &&
          isComponentAvailableToBeConnected(scope.component.uid)
        ) {
          goToService.markComponentInGotoSelection(
            scope.component && scope.component.uid,
            true,
            ['goto-possible-connection']
          );
        }
      }

      function onMouseleave() {
        element[0].classList.remove('border-toolbar');

        if (
          isOnGotoSelection() &&
          !componentTypeIs(scope.component, COMPONENT_TYPE.CONDITION) &&
          !componentTypeIs(scope.component, COMPONENT_TYPE.GOTO_STEP) &&
          isComponentAvailableToBeConnected(scope.component.uid)
        ) {
          goToService.markComponentInGotoSelection(
            scope.component && scope.component.uid,
            false,
            ['goto-possible-connection']
          );
        }
      }

      scope.$on('$destroy', function () {
        element.unbind('mouseenter', showBorderAndToolbar);
        element.unbind('mouseleave', onMouseleave);
        component.unbind('click', onElementClicked);
      });
    }
  }
})();
