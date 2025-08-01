(function () {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .directive('dpEditorPanelEmojisAddons', ['$translate', '$timeout', dpEditorPanelEmojisAddons]);

  function dpEditorPanelEmojisAddons($translate, $timeout) {
    return {
      restrict: 'E',
      scope: {
        inputTarget: '=?'
      },
      template: `
        <button
          type="button"
          aria-controls="dp-menu-emojis"
          type="button"
        >
          <img src="/img/icons/emoji.svg" alt="Emoji" />
        </button>
      `,
      link: function(scope, element) {
        $timeout(() => {
          const buttonElement = element[0].querySelector('button');
          const rootElement = buttonElement.closest('.form--container');

          // Find the closest input or textarea within the wrapper
          const inputElement = scope.inputTarget || buttonElement.closest('.content-wrapper')?.querySelector('input, textarea');

          if (!rootElement || !inputElement) {
            console.warn('dpEditorPanelEmojisAddons: No se encontró el root o input element');
            return;
          }

           // Initialize the emoji picker
          dopplerScripts.emojiSubject.addons({
            rootElement: rootElement,
            buttonElement: buttonElement,
            inputElement: inputElement,
            categoriesTranslation: {
              categories: {
                smileys: $translate.instant('automation_editor.sidebar.campaign_subject_emojis.emojis_categories.Emoji_Category_Faces_Emotions'),
                people: $translate.instant('automation_editor.sidebar.campaign_subject_emojis.emojis_categories.Emoji_Category_People_Body'),
                animals: $translate.instant('automation_editor.sidebar.campaign_subject_emojis.emojis_categories.Emoji_Category_Animals_Nature'),
                food: $translate.instant('automation_editor.sidebar.campaign_subject_emojis.emojis_categories.Emoji_Category_Food_Drinks'),
                activities: $translate.instant('automation_editor.sidebar.campaign_subject_emojis.emojis_categories.Emoji_Category_Activities'),
                travel: $translate.instant('automation_editor.sidebar.campaign_subject_emojis.emojis_categories.Emoji_Category_Travel'),
                objects: $translate.instant('automation_editor.sidebar.campaign_subject_emojis.emojis_categories.Emoji_Category_Objects'),
                symbols: $translate.instant('automation_editor.sidebar.campaign_subject_emojis.emojis_categories.Emoji_Category_Symbols'),
                flags: $translate.instant('automation_editor.sidebar.campaign_subject_emojis.emojis_categories.Emoji_Category_Flags')
              }
            }
          });

        });
      }
    }
  }
})();
