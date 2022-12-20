(function() {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .directive('dpEditorHtmlEditorSlider', dpEditorHtmlEditorSlider);

  dpEditorHtmlEditorSlider.$inject = [
    '$rootScope',
    'automation',
    'changesManager',
    'CONTENT_TYPE',
    'selectedElementsService',
    'userFieldsDataservice',
    'warningsStepsService'
  ];

  function dpEditorHtmlEditorSlider($rootScope, automation, changesManager, CONTENT_TYPE, selectedElementsService,
    userFieldsDataservice, warningsStepsService) {
    var directive = {
      restrict: 'E',
      templateUrl: 'angularjs/partials/automation/editor/directives/dp-editor-html-editor-slider.html',
      link: link
    };

    return directive;

    function link(scope) {
      var selectedEmail = selectedElementsService.getSelectedComponent();
      scope.isLoading = true;
      scope.customFields = userFieldsDataservice.getAllFields();

      if (selectedEmail.id === 0) {
        automation.saveChanges().then(function() {
          $rootScope.$broadcast('UPDATE_SAVING_STATE');
          automation.getHtmlContent(selectedEmail.id).then(function(htmlResult) {
            scope.html.val = htmlResult;
          });
        });
      } else {
        automation.getHtmlContent(selectedEmail.id).then(function(htmlResult) {
          scope.html.val = htmlResult;
        });
      }
      scope.html = {};
      /*eslint-disable */
      scope.tinyOptions = {
        mode: 'exact',
        elements: 'editorTextarea',
        theme: 'advanced',
        plugins: 'imagemanager,style,layer,table,save,advhr,advimage,emotions,imgmap,inlinepopups,contextmenu,paste,directionality,fullpage,fullscreen,noneditable,visualchars',

        convert_urls: false,
        relative_urls: false,
        remove_script_host: false,
        apply_source_formatting: true,

        theme_advanced_buttons1: 'code,|,fullscreen,|,bold,italic,underline,|,justifyleft,justifycenter,justifyright,justifyfull,|,formatselect,fontselect,fontsizeselect',
        theme_advanced_buttons2: 'cut,copy,paste,pastetext,pasteword,|,search,replace,|,bullist,numlist,|,outdent,indent,blockquote,|,undo,redo,|,link,unlink,image,imgmap,cleanup,|,insertdate,inserttime,preview,|,forecolor,backcolor',
        theme_advanced_buttons3: 'tablecontrols,|,hr,removeformat,visualaid,|,sub,sup,|,charmap,emotions,iespell,advhr',
        theme_advanced_buttons4: 'newdocument,|,insertlayer,moveforward,movebackward,absolute,|,styleprops,spellchecker,|,cite,abbr,acronym,del,ins,attribs,|,visualchars,nonbreaking,blockquote,pagebreak,|,insertfile|,ltr,rtl',
        theme_advanced_toolbar_location: 'top',
        theme_advanced_toolbar_align: 'left',

        theme_advanced_path: false,
        auto_resize: false,
        width: 1000,
        height: 500,
        visual: false,

        //Eliminates p issue for mails
        force_br_newlines: false,
        force_p_newlines: true,
        forced_root_block: 'div',
        convert_newlines_to_brs: true,
        remove_redundant_brs: false,
        remove_linebreaks: false,
        invalid_elements: 'p'
      };
      /*eslint-enable */
      scope.$on('TINY_LOADED', function(){
        scope.isLoading = false;
        scope.$apply();
      });

      scope.addFieldToEditor = function(text) {
        tinymce.get('editorTextarea').execCommand('mceInsertContent', false, text);
      };

      scope.saveTinyEditorContent = function() {
        automation.saveTinyEditorContent(selectedEmail.id, scope.html.val).then(function(response) {
          var data = {
            contentType: CONTENT_TYPE.TINY_EDITOR,
            hasUnsavedChanges: true,
            thumbnailUrl: response.thumbnailUrl + '?' + Math.random().toString().split('.')[1]
          };

          changesManager.disable();
          // TO DO: enable undo/redo when we have all contents ready for this.

          // changesManager.add({
          //   type: CHANGE_TYPE.HTML,
          //   uid: selectedComponent.uid,
          //   parentUid: selectedComponent.parentUid,
          //   oldValue: {
          //     contentType: selectedComponent.contentType,
          //     hasUnsavedChanges: true,
          //     innerHTML: selectedComponent.innerHTML,
          //     thumbnailUrl: selectedComponent.thumbnailUrl
          //   },
          //   newValue: {
          //     contentType: CONTENT_TYPE.TINY_EDITOR,
          //     hasUnsavedChanges: true,
          //     innerHTML: scope.html.val,
          //     thumbnailUrl: url
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
          scope.toogleTinyEditorView(false);
        });
      };

      scope.validHTML = function(html){
        return html && html.length && html.match(/<body[^>]*>([^<]*(?:(?!<\/?body)<[^<]*)*)<\/body\s*>/i).length;
      };
    }
  }
})();
