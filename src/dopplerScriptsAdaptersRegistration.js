angular
.module('dopplerApp')
.service('unlayerEditorHelper', function() { 
  return new window.dopplerScripts.UnlayerEditorHelper();
});