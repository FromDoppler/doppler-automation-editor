(function () {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .directive('dpEditorPanelCampaignSubject', dpEditorPanelCampaignSubject);

  dpEditorPanelCampaignSubject.$inject = ['$translate', '$timeout'];

  function dpEditorPanelCampaignSubject($translate, $timeout) {
    var directive = {
      templateUrl:
        'angularjs/partials/automation/editor/directives/panel/dp-editor-panel-campaign-subject.html',
      restrict: 'AE',
      link: link,
    };

    return directive;

    function link(scope) {
      scope.showAdvice = false;
      var INDUSTRY_MESSAGE_STATUS = {
        NONE: 'none',
        SUCCESS: 'success',
        WARNING: ' warning',
      };
      var DEBOUNCE_TIME = 200;
      var SHOW_API_ERROR_TIME_MS = 5000;
      var BUTTON_CONFIRM_INDUSTRY_CHANGE_ID = 'btn_set_subject_industry';
      var BUTTON_CONFIRM_TEXT = $translate.instant(
        'automation_editor.sidebar.subject_industry_confirm'
      );
      var INDUSTRY_SAVE_MESSAGE_TEXT_SUCCESS = $translate.instant(
        'automation_editor.sidebar.subject_industry_save_success'
      );
      var TEXT_CHOOSE_INDUSTRY = $translate.instant(
        'automation_editor.sidebar.subject_choose_industry'
      );
      var INDUSTRY_SAVE_MESSAGE_CLASS_SUCCESS = 'dp-wrap-success';
      var INDUSTRY_SAVE_MESSAGE_TEXT_WARNING = $translate.instant(
        'automation_editor.sidebar.subject_industry_save_warning'
      );
      var INDUSTRY_SAVE_MESSAGE_CLASS_WARNING = 'dp-wrap-warning';
      var DEFAULT_INDUSTRY_ID = 20;
      var EMPTY_INDUSTRY_ID = 0;
      var SHOW_INDUSTRY_SAVE_MESSAGE_TIME_MS = 3000;
      var previousSubjectValue = '';
      var lastDynamicSubjectAnalyzerExecution = {};
      var scoreSubjectColor = '#E5E5E5';
      var scoreSubject = 0;
      var scoreSubjectLabels = [
        'noSubject',
        'veryLow',
        'low',
        'medium',
        'high',
        'veryHigh',
      ];

      scope.statusTips = {
        character: 'advice-disabled',
        emoji: 'advice-disabled',
        custom_field: 'advice-disabled',
        special_char: 'advice-disabled',
      };
      scope.keywords = $translate.instant(
        'automation_editor.sidebar.subject_effective_ia_content'
      );
      scope.statusProgressBar = '';
      scope.showSmartSubjectApiError = false;
      scope.$watch('showAdvice', contentUpdate);
      scope.toogleAdvice = function () {
        scope.showAdvice = !scope.showAdvice;
      };

      scope.subjectFocus = function () {
        if (!scope.showAdvice) {
          scope.showAdvice = true;
        }
      };

      scope.subjectUpdate = function () {
        if (previousSubjectValue !== scope.campaignForm.subject.$viewValue) {
          previousSubjectValue = scope.campaignForm.subject.$viewValue;
          onSubjectUpdate();
        }
      };

      var onSubjectUpdate = _.debounce(function () {
        analyzeSubjectHard();
        analyzeSubject();
        // force scope update
        scope.$apply();
      }, DEBOUNCE_TIME);

      function analyzeSubjectHard() {
        var subjectValidationStatus =
          dopplerScripts.staticSubjectAnalyzer.analyze(previousSubjectValue);
        scope.statusTips.character = subjectValidationStatus.character;
        scope.statusTips.emoji = subjectValidationStatus.emoji;
        scope.statusTips.custom_field = subjectValidationStatus.customField;
        scope.statusTips.special_char = subjectValidationStatus.specialChars;
      }

      function contentUpdate() {
        if (scope.showAdvice) {
          resetcontent();
          resetIndustryContent();
          scope.subjectUpdate();
        }
      }

      function resetcontent() {
        previousSubjectValue = '';
        scope.statusTips = {
          character: 'advice-disabled',
          emoji: 'advice-disabled',
          custom_field: 'advice-disabled',
          special_char: 'advice-disabled',
        };
        scope.statusProgressBar = '';
        scoreSubjectColor = '#E5E5E5';
        scoreSubject = 0;
      }

      function resetIndustryContent() {
        scope.lastIndustrySelected = scope.userIndustry;
        scope.showIndustrySelector = false;
        scope.showIndustrySaveSuggestionMessage = false;

        setIndustryMessageContent(
          DEFAULT_INDUSTRY_ID === scope.userIndustry.IdIndustry ||
            EMPTY_INDUSTRY_ID === scope.userIndustry.IdIndustry
            ? INDUSTRY_MESSAGE_STATUS.WARNING
            : INDUSTRY_MESSAGE_STATUS.NONE
        );
        updateSavingIndustryButtonScope(false);
      }

      function analyzeSubject() {
        var requestData = {
          subject: previousSubjectValue,
          id_user: scope.idUser || 0,
          id_industry: scope.userIndustry.IdIndustry || 0,
        };

        var currentExecution = (lastDynamicSubjectAnalyzerExecution = {});
        dopplerScripts.dynamicSubjectAnalyzer
          .analyze(fetch, requestData)
          .then(function (result) {
            if (currentExecution == lastDynamicSubjectAnalyzerExecution) {
              updateDynamicSubjectAnalysisResultUI(result.error, result.data);
            }
          });
      }

      function updateDynamicSubjectAnalysisResultUI(_error, data) {
        if (_error && _error.error != 'No data') {
          console.log('_error', _error);
          if (!scope.smartSubjectApiError) {
            scope.showSmartSubjectApiError = true;
            $timeout(function () {
              scope.showSmartSubjectApiError = false;
            }, SHOW_API_ERROR_TIME_MS);
          }
        }
        scoreSubject = data.score;
        scoreSubjectColor = data.textColor;
        scope.statusProgressBar = 'score-'.concat(data.status);
        scope.keywords =
          data.text === ''
            ? $translate.instant(
                'automation_editor.sidebar.subject_effective_ia_content'
              )
            : '<p class="dp-subject-border dp-subject-token">' +
              data.text +
              '</p>';
        scope.$apply();
      }

      function updateSavingIndustryButtonScope(isSaving) {
        if (isSaving) {
          scope.isSavingIndustry = true;
          scope.buttonConfirmText = '';
          $timeout(function () {
            document.getElementById(BUTTON_CONFIRM_INDUSTRY_CHANGE_ID).focus();
          }, 1);
        } else {
          scope.isSavingIndustry = false;
          scope.buttonConfirmText = BUTTON_CONFIRM_TEXT;
        }
      }

      function setIndustryMessageContent(status) {
        switch (status) {
          case INDUSTRY_MESSAGE_STATUS.WARNING:
            scope.showIndustrySaveMessage = true;
            scope.industrySaveMessageClass =
              INDUSTRY_SAVE_MESSAGE_CLASS_WARNING;
            scope.industrySaveMessageText = INDUSTRY_SAVE_MESSAGE_TEXT_WARNING;
            break;
          case INDUSTRY_MESSAGE_STATUS.SUCCESS:
            scope.showIndustrySaveMessage = true;
            scope.industrySaveMessageClass =
              INDUSTRY_SAVE_MESSAGE_CLASS_SUCCESS;
            scope.industrySaveMessageText = INDUSTRY_SAVE_MESSAGE_TEXT_SUCCESS;
            break;
          default:
            scope.showIndustrySaveMessage = false;
            scope.industrySaveMessageClass = '';
            scope.industrySaveMessageText = '';
        }
      }

      function handleIndustryMessagesVisibilityOnSave(idIndustry, saveSuccess) {
        scope.showIndustrySaveSuggestionMessage = false;
        if (saveSuccess) {
          setIndustryMessageContent(INDUSTRY_MESSAGE_STATUS.SUCCESS);
        }
        $timeout(
          function () {
            if (idIndustry == DEFAULT_INDUSTRY_ID) {
              setIndustryMessageContent(INDUSTRY_MESSAGE_STATUS.WARNING);
            } else {
              setIndustryMessageContent(INDUSTRY_MESSAGE_STATUS.NONE);
            }
          },
          saveSuccess ? SHOW_INDUSTRY_SAVE_MESSAGE_TIME_MS : 1
        );
      }

      scope.getScoreSubjectStyle = function () {
        return { color: scoreSubjectColor };
      };

      scope.getScoreSubjectLabel = function () {
        return $translate.instant(
          'automation_editor.sidebar.subject_score_'.concat(
            scoreSubjectLabels[scoreSubject]
          )
        );
      };

      scope.confirmIndustryChange = function () {
        if (!scope.isSavingIndustry) {
          updateSavingIndustryButtonScope(true);
          dopplerScripts.userIndustry.service
            .save(fetch, {
              id_industry: scope.lastIndustrySelected.IdIndustry,
            })
            .then(function (result) {
              if (result.error) {
                scope.lastIndustrySelected = scope.userIndustry;
                handleIndustryMessagesVisibilityOnSave(
                  scope.lastIndustrySelected.IdIndustry,
                  false
                );
              } else {
                scope.userIndustry = scope.lastIndustrySelected;

                // force subject evaluation with the new user industry id
                onSubjectUpdate();
                handleIndustryMessagesVisibilityOnSave(
                  scope.lastIndustrySelected.IdIndustry,
                  true
                );
              }
            })
            .finally(function () {
              scope.$apply(function () {
                scope.showIndustrySelector = false;
                updateSavingIndustryButtonScope(false);
              });
            });
        }
      };

      scope.onIndustrySelected = function (industrySelected) {
        scope.lastIndustrySelected = industrySelected;
        scope.showIndustrySaveSuggestionMessage =
          industrySelected.IdIndustry === DEFAULT_INDUSTRY_ID;
      };

      scope.clickToChangeIndustry = function () {
        scope.showIndustrySelector = true;
        scope.showIndustrySaveMessage = false;
        scope.showIndustrySaveSuggestionMessage =
          scope.userIndustry.IdIndustry === DEFAULT_INDUSTRY_ID;
      };

      scope.getDropDownLabel = function () {
        if (scope.hasOwnProperty('lastIndustrySelected')) {
          return scope.lastIndustrySelected.Description
            ? scope.lastIndustrySelected.Description
            : TEXT_CHOOSE_INDUSTRY;
        }
        return '';
      };
    }
  }
})();
