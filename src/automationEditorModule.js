var app = angular.module('dopplerApp.automation.editor', ['ngAnimate', 'ui.bootstrap', 'ui.router', 'dp-dropzone']);

 app.config(['$stateProvider', '$locationProvider', function ($stateProvider, $locationProvider) {
//   var helloState = {
//     name: 'home',
//     ///   AutomationMFE/home
//     url: '/AutomationMFE/home',
//     template: '<h3>hello world!</h3>'
//   }

//   var aboutState = {
//     name: 'about',
//     url: '/AutomationMFE/about',
//     template: '<h3>Its the UI-Router hello world app!</h3>'
//   }

//   $stateProvider.state(helloState);
//   $stateProvider.state(aboutState);

//   $stateProvider.state('index', { ///AutomationMFE/EditorConfig?idScheduledTask
//     // url: '/Automation/EditorConfig?idTaskType?idScheduledTask?idCampaign?redirectToTemplates',
//     //http://localhost:52191/Automation/EditorConfig?idScheduledTask=10131&automationType=scheduled_task
//     //url: '/AutomationMFE/EditorConfig?idScheduledTask?idCampaign?redirectToTemplates',
//     url: '/AutomationMFE/EditorConfig',
//     reloadOnSearch : false,
//     //templateUrl: 'angularjs/partials/automation/editor/index.html',
//     template: '<div>aca viene</div>',
//     resolve: {
//       automationData: ['$stateParams', 'automation', '$translate','settingsService', '$q', function($stateParams, automation, $translate, settingsService, $q) {
//         console.log('index state', $stateParams.idScheduledTask)
//         var idTaskType = $stateParams.idTaskType;
//         var idScheduledTask = $stateParams.idScheduledTask;
//         var idCampaign = $stateParams.idCampaign;
//         return $q.all([$translate.onReady(), settingsService.getSettings()]).then(function() {
//           return automation.load(idTaskType, idScheduledTask, idCampaign);
//         });
//       }]
//     },
//     controller: ['$scope', 'automationData', 'AUTOMATION_STATE', 'AUTOMATION_TYPE', 'automation', '$stateParams', '$location', 'selectedElementsService', 'changesManager', '$window', '$q', 'automationLocaleService', 'LIST_SELECTION_STATE', 'AUTOMATION_COMPLETED_STATE', '$rootScope', 'DOMAINS_SELECTION_STATE',
//         function($scope, automationData, AUTOMATION_STATE, AUTOMATION_TYPE, automation, $stateParams, $location, selectedElementsService, changesManager, $window, $q, automationLocaleService, LIST_SELECTION_STATE, AUTOMATION_COMPLETED_STATE, $rootScope, DOMAINS_SELECTION_STATE) {
//       var urlParams = $location.search();
//       var defaultNamePromise;

//       $scope.automationData = automationData.data;
//       $scope.AUTOMATION_TYPE = AUTOMATION_TYPE;
//       $scope.LIST_SELECTION_STATE = LIST_SELECTION_STATE;
//       $scope.listSelectionState = LIST_SELECTION_STATE.NONE;
//       $scope.DOMAINS_SELECTION_STATE = DOMAINS_SELECTION_STATE;
//       $scope.domainsSelectionState = DOMAINS_SELECTION_STATE.HIDING;
//       $scope.showCreateListTemplate = false;
//       $scope.showTemplates = false;
//       $scope.isDynamicAutomation = automationData.data.automationType === AUTOMATION_TYPE.ABANDONED_CART
//                                 || automationData.data.automationType === AUTOMATION_TYPE.VISITED_PRODUCTS
//                                 || automationData.data.automationType === AUTOMATION_TYPE.PENDING_ORDER
//                                 || automationData.data.automationType === AUTOMATION_TYPE.CONFIRMATION_ORDER;
//       $scope.showTinyEditor = false;
//       $scope.showAutomationTypes = automationData.data.automationType === AUTOMATION_TYPE.NONE;
//       $scope.isProcessing = automation.getIsProcessing;
//       $scope.isAutomationActive = automation.getIsAutomationActive;

//       automationLocaleService.setLocale();

//       if($scope.automationData.state === AUTOMATION_STATE.ACTIVE) {
//         changesManager.disable();
//       }

//       $scope.saveAndRedirect = function(path) {
//         if ($scope.showAutomationTypes) {
//           $window.location.href = path;
//         } else {
//           if(!$scope.rootComponent.name) {
//             defaultNamePromise = $scope.onBlurBreadcrum('');
//           } else {
//             defaultNamePromise = $q(function(resolve, reject) {
//               resolve();
//             })
//           }
//           var hasErrors = automationHasErrors(automation.getIsFlowComplete());
//           automation.setIsProcessing(true);
//           defaultNamePromise.then(function() {
//             if((changesManager.getUnsavedChanges() && $scope.rootComponent.state !== AUTOMATION_STATE.ACTIVE)
//               || hasErrors) {
//               if (hasErrors) {
//                 $scope.rootComponent.state = AUTOMATION_STATE.DRAFT;
//                 $window.location.href = path;
//               }
//               automation.saveChanges().then(function(response) {
//                 $window.location.href = path;
//               }, function(error) {
//                 automation.setIsProcessing(false);
//               });
//             } else {
//               $window.location.href = path;
//             }
//           })
//         }

//       };

//       $scope.toggleListSelection = function(state, listTitle, listSubtitle) {
//         $scope.listTitle = listTitle;
//         $scope.listSubtitle = listSubtitle;
//         $scope.listSelectionState = state;
//       };

//       $scope.toggleDomainsSelection = function (state) {
//         $scope.domainSelectionState = state;
//       };

//       $scope.toggleImportHtmlView = function(value) {
//         $scope.showImportHtml = value;
//       };

//       $scope.toogleTinyEditorView = function(value) {
//         $scope.showTinyEditor = value;
//       }

//       $scope.toggleCreateListTemplate = function(value) {
//         $scope.showCreateListTemplate = value;
//       };

//       $scope.toggleTemplateView = function(value, type) {
//         $scope.showTemplates = value;
//         $scope.isDynamicAutomation = type === AUTOMATION_TYPE.ABANDONED_CART ||
//           type === AUTOMATION_TYPE.VISITED_PRODUCTS ||
//           type === AUTOMATION_TYPE.PENDING_ORDER ||
//           type === AUTOMATION_TYPE.CONFIRMATION_ORDER;
//         automationData.data.automationType = $scope.isDynamicAutomation ? type : null;
//       };

//       $scope.toggleTypesView = function(value) {
//         $scope.showAutomationTypes = value;
//       };

//       $scope.$on('TEMPLATES.CLOSE_TEMPLATES_VIEW', function() {
//         $scope.toggleTemplateView(false);
//       });

//       $scope.loadInitialPanel = function(event) {
//         if (!event.isImmediatePropagationStopped()) {
//           selectedElementsService.unsetSelectedComponent();
//         }
//       }

//       function automationHasErrors(isFlowComplete) {
//         return isFlowComplete === AUTOMATION_COMPLETED_STATE.WITH_DELETED_FIELDS ||
//         isFlowComplete === AUTOMATION_COMPLETED_STATE.WITH_SITE_TRACKING_DISABLED ||
//         isFlowComplete === AUTOMATION_COMPLETED_STATE.WITH_DELETED_DOMAIN ||
//         isFlowComplete === AUTOMATION_COMPLETED_STATE.WITH_NON_VERIFIED_DOMAIN ||
//         isFlowComplete === AUTOMATION_COMPLETED_STATE.WITH_NON_REGISTERED_DOMAIN ||
//         isFlowComplete === AUTOMATION_COMPLETED_STATE.WITH_DEMO_EXPIRED ||
//         isFlowComplete === AUTOMATION_COMPLETED_STATE.WITH_NON_INTEGRATION;
//       }

//       if(urlParams && urlParams.idCampaign) {
//         $scope.$evalAsync(function() {
//           campaignComponent = automation.getEmailComponentById(parseInt(urlParams.idCampaign));
//           if(campaignComponent) {
//             selectedElementsService.setSelectedComponent(campaignComponent);
//             /*Add save with unsaved changes in true because need in paused automation*/
//             var selectedComponent = selectedElementsService.getSelectedComponent();
//             selectedComponent.hasUnsavedChanges = true;
//             selectedComponent.checkCompleted();
//             automation.checkCompleted();
//             automation.saveChanges().then(function() {
//               $rootScope.$broadcast('UPDATE_SAVING_STATE');
//             });
//           }
//           $location.search('idCampaign', null);
//           $location.replace();
//         });

//         if(urlParams.redirectToTemplates) {
//           $scope.toggleTemplateView(true);
//           $location.search('redirectToTemplates', null);
//           $location.replace();
//         }
//       }
//     }]
//   });
 }]);