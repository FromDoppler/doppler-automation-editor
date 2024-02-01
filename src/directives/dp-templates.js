(function() {
  'use strict';

  angular
    .module('dopplerApp')
    .directive('dpTemplates', dpTemplates);

  dpTemplates.$inject = [
    '$q',
    '$location',
    '$rootScope',
    '$translate',
    'automation',
    'changesManager',
    'ModalService',
    'selectedElementsService',
    'settingsService',
    'templatesService',
    'AUTOMATION_TYPE',
    'CONTENT_TYPE',
    'EMAIL_EDITOR_TYPE'
  ];

  function dpTemplates($q, $location, $rootScope, $translate, automation, changesManager, ModalService,
    selectedElementsService, settingsService, templatesService, AUTOMATION_TYPE, CONTENT_TYPE, EMAIL_EDITOR_TYPE) {

    var directive = {
      restrict: 'E',
      controller: controller,
      scope: {
        privatesDescription: '@',
        publicsDescription: '@',
        selectButton: '=',
        disableMenu: '=',
        allTemplates: '='
      },
      templateUrl: 'angularjs/partials/templates/dp-templates.html'
    };

    return directive;

    function controller($scope) {
      $scope.categoryFilter = $location.search().category ? $location.search().category.toLowerCase() : '';
      $scope.user = mainMenuData.user;
      $translate.use(mainMenuData.user.lang);
      $scope.templates = [];
      $scope.isLoading = false;
      // Take care about isPublicTemplatesActive and categoryFilter behavior: they are not
      // updated in a synchronized way.
      $scope.isPublicTemplatesActive = $scope.allTemplates || !!$scope.categoryFilter;
      $scope.dateFormat = mainMenuData.user.lang === 'es' ? 'dd/MM/yyyy' : 'MM/dd/yyyy';
      $scope.selectedTemplateForCreate = false;
      $scope.isLoadingTemplates = false;
      $scope.EMAIL_EDITOR_TYPE = EMAIL_EDITOR_TYPE;

      $scope.inAutomationMode = function() { return $scope.allTemplates; };
      $scope.inTemplatesSectionMode = function() { return !$scope.allTemplates; };
      $scope.inTemplateCreationMode = function() { return $scope.inTemplatesSectionMode() && $scope.isPublicTemplatesActive; };
      $scope.inTemplateChoosingMode = function() { return $scope.inTemplatesSectionMode() && !$scope.isPublicTemplatesActive; };

      settingsService.getSettings().then(function(response) {
        $scope.settings = response;
      });
      var allTemplatesAreLoaded = false;
      var howManyTemplates = 9;
      var pageStart = 0;
      var urlRandomTimeParam = new Date().getTime();
      var isLoadingPreview = false;
      var defaultCategorySelected = 0;

      var redirectToEditorCampaign = function (idCampaign, editorType) {
        window.location.href = templatesService.getEditorCampaignUrl(idCampaign, editorType);
      }

      if (!$scope.categoryFilter && $location.search().automationType){
        switch ($location.search().automationType) {
        case AUTOMATION_TYPE.VISITED_PRODUCTS:
          $scope.categoryFilter = 'product retargeting';
          break;
        case AUTOMATION_TYPE.ABANDONED_CART:
          $scope.categoryFilter = 'abandoned cart';
            break;
          case AUTOMATION_TYPE.PENDING_ORDER:
            $scope.categoryFilter = 'pending payment';
            break;
          case AUTOMATION_TYPE.CONFIRMATION_ORDER:
            $scope.categoryFilter = 'successful payment';
            break;
        default:
          $scope.categoryFilter = '';
        }
      }

      $scope.isLoading = true;
      if ($scope.isPublicTemplatesActive) {
        getCategoriesPublicTemplates();
      } else {
        getTemplates(0, true);
      }
      
      $scope.getInfiniteScrollElement = function() {
        const automationType = $location.search().automationType;
        if (
            automationType === AUTOMATION_TYPE.VISITED_PRODUCTS ||
            automationType === AUTOMATION_TYPE.ABANDONED_CART ||
            automationType === AUTOMATION_TYPE.PENDING_ORDER ||
            automationType === AUTOMATION_TYPE.CONFIRMATION_ORDER
          ) {
          return 'editorTemplateDynamic';
        } else {
          return 'editorTemplate';
        }
      };

      function getTemplates(categoryId, privateTemplates) {
        if ($scope.isLoadingTemplates) {
          return;
        }
        $scope.isLoadingTemplates = true;
        return templatesService.getTemplates(pageStart, howManyTemplates, categoryId,
          $scope.allTemplates, privateTemplates)
          .then(function(result) {
            $scope.templates = $scope.templates.concat(result);
            pageStart += 1;
            if (result.length < howManyTemplates) {
              allTemplatesAreLoaded = true;
            }

            // This code removes "My Templates" section when user don't have any.
            // -2 it's the default value for "My Templates" section.
            var listOfMyTemplates = $scope.templates.filter(function(val) {
              return val.CategoryId === -2;
            });
            if (!listOfMyTemplates.length && $scope.categories) {
              $scope.categories = $scope.categories.filter(function(val) {
                return val.IdTemplateCategory !== -2;
              });
            }
          })
          .finally(function() {
            $scope.isLoading = false;
            $scope.isLoadingTemplates = false;

            $scope.isCampaignsAvailable = isCampaignsAvailable();
          });
      }

      function isCampaignsAvailable() {
        return mainMenuData.isCampaignsAvailable;
      }

      function resetTemplates() {
        pageStart = 0;
        allTemplatesAreLoaded = 0;
        $scope.templates = [];
        $scope.isLoading = true;
      }

      function getCategoriesPublicTemplates() {
        var allCategories = '';
        $translate.onReady().then(function(){
          allCategories = { IdTemplateCategory: 0, Name: $translate.instant('all_categories') };
        });

        $scope.categories = [];
        templatesService.getCategoriesPublicTemplates()
          .then(function(result) {
            var resultOrderByName = dopplerScripts.utils.orderByCriteria(result, 'Name');
            result = dopplerScripts.utils.moveItemToFirstPosition(resultOrderByName, 2, 'IdTemplateCategory')
            $scope.categories = dopplerScripts.utils.moveItemToFirstPosition(result, 1, 'IdTemplateCategory');
            if ($scope.allTemplates) {
              $scope.categories.push({ IdTemplateCategory: -2, Name: $translate.instant('templates_title')});
            }
            $scope.categories.unshift(allCategories);
            $scope.categorySelected = { IdTemplateCategory: $scope.categories[0].IdTemplateCategory };
            if ($scope.categoryFilter){
              var category = _.find(result, function(cat){
                return cat.NameToFilter && cat.NameToFilter === $scope.categoryFilter;
              });
              if (category) {
                $scope.categorySelected = { IdTemplateCategory: category.IdTemplateCategory };
              }
            }
            getTemplates($scope.categorySelected.IdTemplateCategory, false);

          });
      }

      $scope.viewPrivateTemplates = function() {
        resetTemplates();
        $scope.isPublicTemplatesActive = false;
        getTemplates(0, true);
      };

      $scope.createTemplate = function() {
        $scope.isPublicTemplatesActive = true;
        resetTemplates();
        getTemplates(defaultCategorySelected, false);
        if ($scope.categories === undefined) {
          getCategoriesPublicTemplates();
        } else {
          $scope.categorySelected = { IdTemplateCategory: $scope.categories[0].IdTemplateCategory };
        }
      };

      $scope.filterPublicTemplates = function() {
        resetTemplates();
        if ($scope.categorySelected.IdTemplateCategory === -2) {
          getTemplates(0, true);
        } else {
          getTemplates($scope.categorySelected.IdTemplateCategory, false);
        }
      };

      $scope.renameTemplate = function(template) {
        ModalService.showModal({
          templateUrl: 'angularjs/partials/shared/modalWithInput.html',
          controller: 'ModalWithInputCtrl',
          inputs: {
            data: {
              title: $translate.instant('templates_rename_popup.title', { name: template.Name }),
              description: $translate.instant('templates_rename_popup.description'),
              buttonCancelLabel: $translate.instant('button_cancel'),
              buttonPrimaryLabel: $translate.instant('templates_rename_popup.button_primary'),
              buttonPrimaryClass: 'button--primary button--small',
              fieldValue: template.Name,
              required: true,
              maxlength: 50
            }
          }
        }).then(function(modal) {
          modal.close.then(function(response) {
            if (response.isConfirmed && response.name) {
              templatesService.renameTemplate(template.IdTemplate, response.name)
                .then(function() {
                  resetTemplates();
                  getTemplates(0, true);
                });
            }
          });
        });
      };

      $scope.duplicateTemplate = function(template) {
        var fieldValue = $translate.instant('templates_duplicate_popup.name', { name: template.Name });
        fieldValue = fieldValue.substring(0, 50);
        ModalService.showModal({
          templateUrl: 'angularjs/partials/shared/modalWithInput.html',
          controller: 'ModalWithInputCtrl',
          inputs: {
            data: {
              title: $translate.instant('templates_duplicate_popup.title', { name: template.Name }),
              description: $translate.instant('templates_duplicate_popup.description'),
              buttonCancelLabel: $translate.instant('button_cancel'),
              buttonPrimaryLabel: $translate.instant('templates_duplicate_popup.button_primary'),
              buttonPrimaryClass: 'button--primary button--small',
              fieldValue: fieldValue,
              required: true,
              maxlength: 50
            }
          }
        }).then(function(modal) {
          modal.close.then(function(response) {
            if (response.isConfirmed && response.name) {
              templatesService.duplicateTemplate(template.IdTemplate, response.name)
                .then(function() {
                  resetTemplates();
                  getTemplates(0, true);
                });
            }
          });
        });
      };

      $scope.deleteTemplate = function(template) {
        ModalService.showModal({
          templateUrl: 'angularjs/partials/shared/modalYesOrNo.html',
          controller: 'ModalYesOrNoCtrl',
          inputs: {
            data: {
              title: $translate.instant('templates_delete_popup.title', { name: template.Name }),
              description: $translate.instant('templates_delete_popup.description'),
              buttonCancelLabel: $translate.instant('button_cancel'),
              buttonPrimaryLabel: $translate.instant('templates_delete_popup.button_primary'),
              buttonPrimaryClass: 'button--delete button--small'
            }
          }
        }).then(function(modal) {
          modal.close.then(function(response) {
            if (response) {
              templatesService.deleteTemplate(template.IdTemplate)
                .then(function() {
                  resetTemplates();
                  getTemplates(0, true);
                });
            }
          });
        });
      };

      $scope.formatDate = function(jsonDate) {
        var re = /-?\d+/;
        var m = re.exec(jsonDate);
        var dateOut = new Date(parseInt(m[0]));
        return dateOut;
      };

      function showPreviewModal(template, html) {
        ModalService.showModal({
          templateUrl: 'angularjs/partials/shared/preview.html',
          controller: 'PreviewCtrl',
          inputs: {
            data: {
              templateId: template.IdTemplate,
              isPublic: $scope.isPublicTemplatesActive,
              html: html
            }
          }
        });
      }

      $scope.openPreview = function(template) {
        if (template.previewHtml) {
          showPreviewModal(template, template.previewHtml);
        } else if (!isLoadingPreview) {
          isLoadingPreview = true;
          templatesService.getPreviewTemplate(template.IdTemplate, $scope.isPublicTemplatesActive)
            .then(function(htmlResult) {
              showPreviewModal(template, htmlResult.data);
              template.previewHtml = htmlResult.data;
              isLoadingPreview = false;
            });
        }
      };

      $scope.getEditTemplateUrl = function(id, editorType) {
        return templatesService.getEditorTemplateUrl(id, editorType);
      };

      $scope.getCreateCampaignFromTemplateUrl = function(id, editorType) {
        return templatesService.getCampaignCreationFromTemplateUrl(id, editorType);
      };

      $scope.viewOnline = function(url) {
        if (mainMenuData.user.plan.planType !== 'free'){
          window.open(url, '_blank');
        }
      };

      $scope.closeMenu = function(template) {
        if (template.isMenuOpen) {
          template.isMenuOpen = false;
        }
      };

      $scope.selectTemplate = function(id, editorType) {
        if (!$scope.selectedTemplateForCreate) {
          $scope.selectedTemplateForCreate = true;
          templatesService.createTemplateFromPublicAndRedirect(id, editorType, function(error) {
            console.error("Error on createTemplateFromPublicAndRedirect", error);
            $scope.selectedTemplateForCreate = false;
          });
        }
      };

      $scope.getNoCacheUrl = function(imageUrl) {
        return imageUrl + '?' + urlRandomTimeParam;
      };

      $scope.onScroll = function() {
        if (allTemplatesAreLoaded) {
          return $q.reject();
        }
        if ($scope.isPublicTemplatesActive) {
          return getTemplates($scope.categorySelected ? $scope.categorySelected.IdTemplateCategory : 0, false);
        }
        return getTemplates(0, true);

      };

      $scope.useTemplateAsIs = function(template) {
        var selectedComponent = selectedElementsService.getSelectedComponent();

        setLocationWithIdCampaign(false, function() {
          if (!templatesService.tryToRedirectToSetCampaignFromTemplateIfUnlayerAndContinue(
            template.IdTemplate,
            template.EditorType,
            selectedComponent.id))
          {
            automation.saveTemplateContent(selectedComponent.id, template.IdTemplate).then(function() {
              setCampaignThumbnail(selectedComponent);
              $rootScope.$broadcast('TEMPLATES.CLOSE_TEMPLATES_VIEW');
            });
          }
        });
      };

      var setLocationWithIdCampaign = function(redirectToTemplates, callback) {
        var selectedComponent = selectedElementsService.getSelectedComponent();
        var newParams = {
          'idScheduledTask': automation.getModel().id,
          'idCampaign': selectedComponent.id,
        };

        if (redirectToTemplates) {
          newParams.redirectToTemplates = 'true';
        }

        $location.search(newParams);
        $location.replace();

        // setTimeout to update $location before executing the code
        setTimeout(callback, 0);
      }

      $scope.newAutomationCampaign = function(template) {
        var selectedComponent = selectedElementsService.getSelectedComponent();

        // This block is to allow history.back() to template selection
        // redirectToTemplates is not set because the campaign already has a thumbnail set.
        // See https://makingsense.atlassian.net/browse/DE-942
        setLocationWithIdCampaign(false, function() {
          if (!templatesService.tryToRedirectToSetCampaignFromTemplateIfUnlayerAndEdit(
            template.IdTemplate,
            template.EditorType,
            selectedComponent.id))
          {
            // This block is to allow history.back() to template selection
            // it works with MSEditor but not with Unlayer.
            // See https://makingsense.atlassian.net/browse/DE-942
            setLocationWithIdCampaign(true, function() {
              automation.saveTemplateContent(selectedComponent.id, template.IdTemplate).then(function () {
                setCampaignThumbnail(selectedComponent);
                //we need to call to saveChanges to save the generated thumbnailUrl in the model
                return automation.saveChanges().then(function (response) {
                  $rootScope.$broadcast('UPDATE_SAVING_STATE');
                  redirectToEditorCampaign(selectedComponent.id, template.EditorType);
                });
              });
            });
          }
        });
      };

      function setCampaignThumbnail(selectedComponent) {
        var data = {
          contentType: CONTENT_TYPE.TEMPLATE,
          hasUnsavedChanges: true,
          thumbnailUrl: $scope.settings.urlBase + '/Users/' + $scope.settings.idUser + '/Campaigns/' + selectedComponent.id + '/' + selectedComponent.id + '.png?' + Math.random().toString().split('.')[1]
        };
        selectedComponent.setData(data);
        automation.saveChanges().then(function() {
          $rootScope.$broadcast('UPDATE_SAVING_STATE');
          changesManager.enable();
        });
      }
    }
  }
})();
