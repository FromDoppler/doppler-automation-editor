(function() {
  'use strict';

  angular
    .module('dopplerApp')
    .controller('HeaderCtrl', HeaderCtrl);

  HeaderCtrl.$inject = [
    '$scope',
    '$rootScope',
    'headerService',
    'ModalService',
    '$translate',
    'taskService',
    '$attrs',
    '$timeout'
  ];

  function HeaderCtrl($scope, $rootScope, headerService, ModalService, $translate, taskService, $attrs, $timeout) {
    //this var should be in the rootscope to be loaded before controller does
    $rootScope.loaded = true;
    $scope.isUserMenuOpen = false;
    $scope.notificationOpened = false;

    function planTypeByIdUserType(idUserType) {
      var planName = '';
      switch (idUserType) {
      case '1': planName = 'free'; break;
      case '2': planName = 'monthly-deliveries'; break;
      case '3': planName = 'prepaid'; break;
      case '4': planName = 'subscribers'; break;
      case '5': planName = 'agencies'; break;
      case '6': planName = 'agencies'; break;
      case '7': planName = 'demo'; break;
      case '8': planName = 'agencies'; break;
      default: planName = 'free'; break;
      }
      return planName;
    }

    activate();

    function activate() {
      headerService.getHeaderData($attrs.domain).then(function(response){
        $scope.data = response;
        $rootScope.user = $scope.data.user;
        $rootScope.user.plan.planType = planTypeByIdUserType($rootScope.user.plan.planType);
        $rootScope.loginUrl = $scope.data.loginUrl;
        $rootScope.$broadcast('user_logged');
        if ($attrs.forceselected){
          var event = document.createEvent('Event');
          event.initEvent('header_loaded', true, true);
          var selectedMenu = eval($attrs.forceselected);
          var menu = _.find($scope.data.nav, function(elem){
            return elem.idHTML === selectedMenu.parentIdHtml;
          });
          if (menu){
            menu.isSelected = true;
            var subMenu = _.find(menu.subNav, function(subElem){
              return subElem.idHTML === selectedMenu.childIdHtml;
            });
            if (subMenu){
              subMenu.isSelected = true;
            }
          }
          $timeout(function(){
            window.dispatchEvent(event);
          });
        }
        $translate.use($scope.data.user.lang);
        if (!$scope.data.user.clientManager && !$scope.data.user.plan.buttonUrl) {
          headerService.getUpgradePlanData($scope.data.user.plan.isSubscribers === 'true' ? 4 : 2, $scope.data.urlBase)
            .then(function (result) {
              var filtered = _.filter(result.ClientTypePlans, function (val) {
                return $scope.data.user.plan.isSubscribers === 'true' ? val.SubscribersQty > $scope.data.user.plan.maxSubscribers : val.EmailQty > $scope.data.user.plan.maxSubscribers;
              });
              result.ClientTypePlans = filtered;
              $scope.model = result;
            });
        }

      });
    }

    $scope.closeMenu = function() {
      if ($scope.isUserMenuOpen) {
        $scope.isUserMenuOpen = !$scope.isUserMenuOpen;
      }
    };

    $scope.toggleMenu = function() {
      $scope.isUserMenuOpen = !$scope.isUserMenuOpen;
    };

    $scope.openPopup = function(action) {
      if (action === 'validateSubscribersPopup') {
        return ModalService.showModal({
          templateUrl: 'angularjs/partials/shared/modalMaxSubscribers.html',
          controller: 'ModalSendMaxSubscribersEmailCtrl',
          inputs: { data: { urlbase: $scope.data.urlBase }}
        })
          .then(function(modal) {
            modal.close.then(function(response) {
              if (response) {
                //change to next Alert
                $scope.data.alert = $scope.data.alert.nextAlert;
              }
            });
          });
      } else if (action === 'updatePlanPopup') {
        return ModalService.showModal({
          templateUrl: 'angularjs/partials/shared/modalUpgradePlan.html',
          controller: 'ModalUpgradePlanCtrl',
          inputs: {
            data: {
              title: $scope.model.ClientTypePlans.length === 0 ? $translate.instant('modal_upgrade_plan.title_top_plan') : $translate.instant('modal_upgrade_plan.title'),
              description: $scope.model.ClientTypePlans.length === 0 ? '' : $translate.instant('modal_upgrade_plan.subtitle_upgrade_plan'),
              buttonLabel: $scope.model.ClientTypePlans.length === 0 ? $translate.instant('button_send') : $translate.instant('modal_upgrade_plan.button_update'),
              maxlength: 140,
              idUserType: $scope.data.user.plan.isSubscribers === 'true' ? 4 : 2,
              urlbase: $scope.data.urlBase,
              model: $scope.model
            }
          }
        }).then(function (modal) {
          modal.close.then(function (response) {
            if (response) {
              $scope.data.user.isLastPlanRequested = true;
            }
          });
        });
      }
      else if (action === 'closeModal') {
        headerService.acceptButtonAction($scope.data.urlBase);
        $scope.data.alert = false;
      }
    };

    $scope.showPopup = function() {
      ModalService.showModal({
        templateUrl: 'angularjs/partials/automation/siteBehaviorModal.html',
        controller: 'ModalYesOrNoCtrl',
        inputs: { data: {} }
      })
        .then(function(modal) {
          modal.close.then(function(response) {
            if (response) {
              taskService.activateSiteBehavior()
                .then(function(){
                  ModalService.showModal({
                    templateUrl: 'angularjs/partials/automation/siteBehaviorDomainsModal.html',
                    controller: 'ModalYesOrNoCtrl',
                    inputs: { data: {} }
                  });
                });
            }
          });
        });
    };
  }

})();
