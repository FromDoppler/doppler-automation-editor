(function() {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .service('selectedElementsService', selectedElementsService);

  function selectedElementsService() {
    var selectedComponent = null;
    var selectedConditional = null;
    var isTheServiceEnabled = true;
    var componentsElements = {};

    var service = {
      enableService: enableService,
      disableService: disableService,
      getSelectedComponent: getSelectedComponent,
      setSelectedComponent: setSelectedComponent,
      getSelectedConditional: getSelectedConditional,
      setSelectedConditional: setSelectedConditional,
      unsetSelectedComponent: unsetSelectedComponent,
      unsetSelectedConditional: unsetSelectedConditional,
      addComponentElement: addComponentElement,
      getComponentElement: getComponentElement,
      scrollIntoElement: scrollIntoElement,
      scrollIntoProperty: scrollIntoProperty
    };

    return service;


    //Returns the selected component
    function getSelectedComponent() {
      return selectedComponent;
    }

    //Set component as selected
    function setSelectedComponent(component) {
      if (isTheServiceEnabled) {
        selectedComponent = component;
      }
    }

    //Returns the selected component
    function getSelectedConditional() {
      return selectedConditional;
    }

    //Set conditional as selected
    function setSelectedConditional(conditional) {
      selectedConditional = conditional;
    }

    function unsetSelectedComponent() {
      selectedComponent = null;
    }

    function unsetSelectedConditional() {
      selectedConditional = null;
    }

    function enableService() {
      isTheServiceEnabled = true;
    }

    function disableService() {
      isTheServiceEnabled = false;
    }

    function addComponentElement(uid, element) {
      componentsElements[uid] = element;
    }

    function getComponentElement(uid) {
      return componentsElements[uid];
    }

    function scrollIntoElement(uid) {
      if (componentsElements[uid] && !isElementVisibleInCanvas(componentsElements[uid])) {
        componentsElements[uid].scrollIntoView(true);
      }
    }

    function scrollIntoProperty(id) {
      if (id) {
        var element = document.getElementById(id + '_property');
        if (element) {
          element.scrollIntoView(true);
        }
      }
    }

    function isElementVisibleInCanvas(element) {
      var canvasRect = document.querySelector('dp-editor-canvas').getBoundingClientRect();
      var elementRect = element.querySelector('.component--container').getBoundingClientRect();

      return elementRect.top > canvasRect.top && elementRect.bottom < canvasRect.bottom;
    }
  }
})();
