(function() {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .directive('dpEditorPanelCampaign', dpEditorPanelCampaign);

  dpEditorPanelCampaign.$inject = [
    '$rootScope',
    '$translate',
    'automation',
    'AUTOMATION_TYPE',
    'CAMPAIGN_TYPE',
    'CHANGE_TYPE',
    'changesManager',
    'conditionsDataservice',
    'CONTENT_TYPE',
    'settingsService',
    'TEST_OPTION',
    'utils',
    'warningsStepsService'
  ];

  function dpEditorPanelCampaign($rootScope, $translate, automation, AUTOMATION_TYPE, CAMPAIGN_TYPE, CHANGE_TYPE,
    changesManager, conditionsDataservice, CONTENT_TYPE, settingsService, TEST_OPTION, utils, warningsStepsService) {
    var directive = {
      restrict: 'AE',
      templateUrl: 'angularjs/partials/automation/editor/directives/panel/dp-editor-panel-campaign.html',
      link: link
    };

    return directive;

    function link(scope) {
      var reloadAfterCreation = false;
      var selectedCampaignUid = scope.selectedComponent.uid;

      scope.DMARCAcceptedDomain = '';
      scope.listToSend = [{
        value: 0,
        label: $translate.instant('automation_editor.sidebar.campaign_send_test_subscribers_select_placeholder'),
        isBlocked: false,
      }];
      scope.CONTENT_TYPE = CONTENT_TYPE;
      scope.TEST_OPTION = TEST_OPTION;
      scope.REGEX_EMAIL = utils.REGEX_EMAIL;
      scope.REGEX_EMAIL_DKIM = utils.REGEX_EMAIL_DKIM;
      scope.automationType = automation.getModel().automationType ;
      scope.AUTOMATION_TYPE = AUTOMATION_TYPE;
      scope.showInputErrors = {};
      scope.getReadOnlyLabel = automation.getReadOnlyLabel;
      scope.REGEX_SUBSCRIBER_EMAIL = utils.REGEX_SUBSCRIBER_EMAIL;
      scope.smartSubjectEnabled = false;

      scope.$watch('selectedComponent.name', onEmailNameChange);

      if (scope.selectedComponent.campaignType === CAMPAIGN_TYPE.CAMPAIGN_RSS) {
        scope.rss = scope.selectedComponent.rss;
        scope.$watch('selectedComponent.rss', updateRssValue);
      }

      settingsService.getSettings().then(function(response) {
        changesManager.disable();

        if (scope.selectedComponent.socialShares.length === 0) {
          scope.selectedComponent.socialShares = response.socialShares;
        }

        if (response.domainKeyList.length) {
          scope.domainKeyList = response.domainKeyList;
          scope.selectedComponent.idDomainKeySelected = 0;
          scope.selectedComponent.DomainKeyLabel = scope.domainKeyList[0].DomainName;
          scope.domainKey = scope.selectedComponent.DomainKeyLabel;
          scope.selectedComponent.dkimEmail = '';
          if (scope.selectedComponent.fromEmail.length){
            var fromEmail = scope.selectedComponent.fromEmail;
            scope.domainKey = fromEmail.substring(fromEmail.indexOf('@') + 1, fromEmail.length);
            scope.selectedComponent.dkimEmail = fromEmail.substring(0, fromEmail.indexOf('@'));

            var domainKeyData = _.find(scope.domainKeyList, function(item){
              return item.DomainName === scope.domainKey;
            });
            if (domainKeyData) {
              scope.selectedComponent.DomainKeyLabel = domainKeyData.DomainName;
              scope.selectedComponent.idDomainKeySelected = domainKeyData.DomainId;
            } else {
              scope.selectedComponent.fromEmail = scope.selectedComponent.dkimEmail + '@' + scope.selectedComponent.DomainKeyLabel;
              scope.selectedComponent.hasUnsavedChanges = true;
              automation.saveChanges();
            }
          }
          scope.$watch('selectedComponent.idDomainKeySelected', setDkimLabelAndUpdateFromEmail);
          scope.$watch('selectedComponent.fromEmail', updateDkimEmail);
        }
        scope.dmarcDomains = response.dmarcDomains;
        scope.maxSubsInList = response.sendTestMaxSubsInList;
        scope.isIgnoreContactPolicySetupCompleted = response.isIgnoreContactPolicySetupCompleted;


        scope.smartSubjectEnabled = response.smartSubjectEnabled;
        scope.sortedUserFields = response.sortedUserFields;
        scope.idUser = response.idUser;
        scope.industriesList = response.userIndustryInfo.Industries;
        scope.userIndustry = response.userIndustryInfo.UserIndustry;
        changesManager.enable();
      });

      scope.onDkimSelected = function(domainKeyId) {
        var oldDomainKeyId;

        if (domainKeyId === scope.selectedComponent.idDomainKeySelected) {
          return;
        }
        oldDomainKeyId = scope.selectedComponent.idDomainKeySelected;

        changesManager.add({
          type: CHANGE_TYPE.PROPERTY,
          uid: scope.selectedComponent.uid,
          key: 'idDomainKeySelected',
          oldValue: angular.copy(oldDomainKeyId),
          newValue: angular.copy(domainKeyId)
        });

        scope.selectedComponent.idDomainKeySelected = domainKeyId;

        changesManager.disable();
        scope.selectedComponent.hasUnsavedChanges = true;
        changesManager.enable();
        setDkimLabelAndUpdateFromEmail(scope.selectedComponent.idDomainKeySelected);
      };

      function setDkimLabelAndUpdateFromEmail(domainKeyId) {
        if (!!domainKeyId) { // eslint-disable-line no-extra-boolean-cast
          var existingDomainKey = _.find(scope.domainKeyList, function(domainKey) {
            return domainKey.DomainId === domainKeyId;
          });

          scope.selectedComponent.DomainKeyLabel = existingDomainKey ? existingDomainKey.DomainName :
            scope.domainKeyList[0].DomainName;

          changesManager.disable();
          scope.selectedComponent.fromEmail = scope.selectedComponent.dkimEmail + '@' + scope.selectedComponent.DomainKeyLabel;
          changesManager.enable();
        }
      }

      scope.MarkDMARCDomainWarningDisplayed = function() {
        var domain = (scope.campaignForm.fromEmail.$viewValue).match('[^@@]+$')[0];
        scope.selectedComponent.DMARCAcceptedDomain = domain.split('.')[0].toLowerCase();
        scope.selectedComponent.confirmedDomain = domain;
      };

      scope.includedInDmarcDomains = function (domain) {
        return scope.dmarcDomains && scope.dmarcDomains.includes(domain.toUpperCase().trim());
      };

      scope.removePrivateDomainMessage = function(domain) {
        automation.confirmDomain(domain);
        scope.campaignForm.fromEmail.$validate();
        automation.checkCompleted();
      };

      automation.getListsForTest().then(function(response) {
        loadListToSend(response);
        scope.$watch('selectedComponent.idList', updateSelectedList);
      });

      scope.toggleTemplates = function(value) {
        if (value && changesManager.getUnsavedChanges()) {
          automation.setIsProcessing(true);
          automation.saveChanges().then(function() {
            $rootScope.$broadcast('UPDATE_SAVING_STATE');
            automation.setIsProcessing(false);
            if (scope.selectedComponent.thumbnailUrl === '') {
              scope.toggleTemplateView(true, scope.selectedComponent.campaignType);
            } else {
              window.location.href = '/MSEditor/Editor?idCampaign=' + scope.selectedComponent.id;
            }
          }, function() {
            automation.setIsProcessing(false);
          });
        } else if (value && scope.selectedComponent.thumbnailUrl !== '') {
          window.location.href = '/MSEditor/Editor?idCampaign=' + scope.selectedComponent.id;
        } else if (!value) {
          scope.toggleTemplateView(true, scope.selectedComponent.campaignType);
        } else {
          scope.toggleTemplateView(value, scope.selectedComponent.campaignType);
        }
      };

      scope.toggleTinyEditor = function(value) {
        scope.toogleTinyEditorView(value);
      };

      scope.toggleImportHtml = function(value) {
        if (value && scope.selectedComponent.id === 0) {
          automation.setIsProcessing(true);
          automation.saveChanges().then(function() {
            $rootScope.$broadcast('UPDATE_SAVING_STATE');
            automation.setIsProcessing(false);
            scope.toggleImportHtmlView(true);
          }, function() {
            automation.setIsProcessing(false);
          });
        } else {
          scope.toggleImportHtmlView(true);
        }
      };

      scope.selectDomain = function(email) {
        return email && email.length ? email.match('[^@@]+$')[0].toLowerCase() : '';
      };

      scope.sendTestList = function() {
        scope.sendingTest = true;
        automation.saveChanges().then(function() {
          $rootScope.$broadcast('UPDATE_SAVING_STATE');
          automation.sendTestToList(scope.selectedComponent.idList, scope.selectedComponent.id)
            .then(function(response) {
              scope.sendingTest = false;
              if (response.data.length === 0) {
                scope.listTestOk = true;
              } else {
                scope.errorMessageList = response.data;
              }
            });
        });
      };

      scope.sendTestToEmails = function() {
        scope.sendingTest = true;
        automation.saveChanges().then(function() {
          $rootScope.$broadcast('UPDATE_SAVING_STATE');
          automation.sendTestToEmails(scope.selectedComponent.emailList, scope.selectedComponent.id)
            .then(function(response) {
              scope.sendingTest = false;
              if (response.data.length === 0) {
                scope.emailTestOk = true;
              } else {
                scope.errorMessageEmail = response.data;
              }
            });
        });
      };

      scope.removeMessage = function() {
        scope.errorMessageList = '';
        scope.errorMessageEmail = '';
        scope.listTestOk = false;
        scope.emailTestOk = false;
      };

      scope.onListSelected = function(option) {
        utils.assign(scope.selectedComponent, 'idList', option.value);
      };

      scope.inputKeyup = function(event, key) {
        var unprocessableKeys = [8, 9, 13, 16, 17, 18, 20, 27, 37, 38, 39, 40, 91, 93];
        if (_.includes(unprocessableKeys, event.keyCode)) {
          return;
        }
        if (event.currentTarget.value.length === 100 && !scope.showInputErrors[key]) {
          scope.showInputErrors[key] = true;
        } else if (event.currentTarget.value.length < 100 && scope.showInputErrors[key]) {
          scope.showInputErrors[key] = false;
        }
      };

      scope.updatePreheaderCounter = function(event) {
        scope.preheaderCounter = 100 - event.currentTarget.value.length;
      };

      scope.emailNameOnBlur = function () {
        scope.showInputErrors.name = false;

        var currentEmailName = scope.selectedComponent.name;
        if (!currentEmailName) {
          scope.selectedComponent.name = 'Email_' + ++scope.rootComponent.lastEmailIdName;
        }
      };

      function onEmailNameChange(newValue, oldValue) {
        /*we need to do this validation because the watcher detects the change
          between the value of the previously selectedComponent and the new one */
        if (scope.selectedComponent && scope.selectedComponent.uid !== selectedCampaignUid) {
          selectedCampaignUid = scope.selectedComponent.uid;
          hideSmartSubjectAdvise();
          return;
        }
        if (newValue === oldValue || !oldValue || changesManager.isChanging() || !changesManager.isEnabled()
          || !scope.selectedComponent) {
          return;
        }

        changesManager.add({
          type: CHANGE_TYPE.PROPERTY,
          uid: scope.selectedComponent.uid,
          key: 'name',
          oldValue: angular.copy(oldValue),
          newValue: angular.copy(newValue),
          callback: automation.onEmailNameChange
        });

        automation.onEmailNameChange(scope.selectedComponent.uid, newValue);
        scope.selectedComponent.hasUnsavedChanges = true;
        scope.selectedComponent.checkCompleted();
        automation.checkCompleted();
        warningsStepsService.checkWarningStep(scope.selectedComponent);
      }

      function updateSelectedList() {
        if (!scope.selectedComponent) {
          return;
        }

        scope.selectedList = _.find(scope.listToSend, function(option) {
          return scope.selectedComponent.idList === option.value;
        });

        if (!scope.selectedList) {
          if (reloadAfterCreation) {
            automation.getListsForTest().then(function(response) {
              reloadAfterCreation = false;
              loadListToSend(response);
              updateSelectedList();
            });
          } else {
            reloadAfterCreation = true;
            scope.selectedList = scope.listToSend[0];
          }
        }
      }
      
      function loadListToSend(lists) {
        scope.listToSend = _.filter(scope.listToSend, function(list) {
          return list.value === 0;
        });
        for (var i = 0; i < lists.length ; i++) {
          scope.listToSend.push({
            label: lists[i].listName,
            value: lists[i].id,
            isBlocked: lists[i].isBlocked,
          });
        }
      }

      scope.setChanged = function() {
        var rssElement = angular.element(document.querySelector('input[name="rss"]'));

        if (rssElement.val() === scope.selectedComponent.rss) {
          scope.campaignForm.rss.$setValidity('rss', true);
          return;
        }
        if (!rssElement.val()) {
          scope.setNewRssValue('');
          rssElement.val('');
          scope.campaignForm.rss.$setValidity('rss', true);
          return;
        }
        scope.rssLoading = true;
        automation.validateAndAutoCompleteRSS(rssElement.val()).then(function(response) {
          if (response.success === false) {
            scope.campaignForm.rss.$setValidity('rss', false);
            scope.rssLoading = false;
            return;
          }

          scope.setNewRssValue(response.validUrl);
          rssElement.val(response.validUrl);
          scope.campaignForm.rss.$setValidity('rss', true);
          scope.rssLoading = false;
        }, function() {
          scope.campaignForm.rss.$setValidity('rss', false);
          scope.rssLoading = false;
        });
      };

      function updateRssValue(newValue) {
        angular.element(document.querySelector('input[name="rss"]')).val(newValue);
        scope.campaignForm.rss.$setValidity('rss', true);
      }

      function updateDkimEmail(newFromEmail) {
        if (!!newFromEmail) { // eslint-disable-line no-extra-boolean-cast
          scope.selectedComponent.dkimEmail = newFromEmail.indexOf('@') !== -1 ? newFromEmail.substring(0, newFromEmail.indexOf('@')) : '';
        }
      }

      scope.updateFromEmailDkim = function(newDkimEmail) {
        var newFromEmail = !newDkimEmail || !newDkimEmail.length ? '' : newDkimEmail + '@' + scope.selectedComponent.DomainKeyLabel;
        if (scope.selectedComponent.fromEmail !== newFromEmail) {
          scope.selectedComponent.setData({
            fromEmail: newFromEmail
          });
        }
      };

      scope.setNewRssValue = function(value) {
        var selectedComponent = scope.selectedComponent;
        var oldComponentData = JSON.parse(JSON.stringify(selectedComponent.rss));
        selectedComponent.setData({rss: value});
        var newComponentData = JSON.parse(JSON.stringify(value));

        changesManager.add({
          type: CHANGE_TYPE.PROPERTY,
          uid: selectedComponent.uid,
          key: 'rss',
          oldValue: angular.copy(oldComponentData),
          newValue: angular.copy(newComponentData)
        });
        scope.selectedComponent.hasUnsavedChanges = true;
        selectedComponent.checkCompleted();
        automation.checkCompleted();
        warningsStepsService.checkWarningStep(selectedComponent);
      };

      scope.canEdit = function() {
        return !automation.isReadOnly() || automation.isPaused();
      };
      
      scope.isDynamicContent = function() {
        return scope.automationType === AUTOMATION_TYPE.ABANDONED_CART
          || scope.automationType === AUTOMATION_TYPE.VISITED_PRODUCTS
          || scope.automationType === AUTOMATION_TYPE.PENDING_ORDER
          || scope.automationType === AUTOMATION_TYPE.CONFIRMATION_ORDER;
      };

      scope.isSubscriberEmail = function(value) {
        return utils.isSubscriberEmail(value);
      };
      function hideSmartSubjectAdvise() {
        if (scope.showAdvice) {
          scope.showAdvice = false;
        }
      }

      var emojiButtonElement = document.getElementById('emoji-button')

      dopplerScripts.emojiSubject.addons({
        rootElement: emojiButtonElement.closest('.dp-editor-panel-campaign-component'),
        buttonElement: emojiButtonElement,
        inputElement: document.getElementById('subject_property'),
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
    }
  }
})();
