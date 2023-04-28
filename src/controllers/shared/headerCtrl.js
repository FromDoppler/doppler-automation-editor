(function () {
  'use strict';

  angular.module('dopplerApp').controller('HeaderCtrl', HeaderCtrl);

  HeaderCtrl.$inject = [
    '$scope',
    '$rootScope',
    'headerService',
    'ModalService',
    '$translate',
    'taskService',
    '$attrs',
    '$timeout',
  ];

  function HeaderCtrl(
    $scope,
    $rootScope,
    headerService,
    ModalService,
    $translate,
    taskService,
    $attrs,
    $timeout
  ) {
    //this var should be in the rootscope to be loaded before controller does
    $rootScope.loaded = true;

    function planTypeByIdUserType(idUserType) {
      var planName = '';
      switch (idUserType) {
        case '1':
          planName = 'free';
          break;
        case '2':
          planName = 'monthly-deliveries';
          break;
        case '3':
          planName = 'prepaid';
          break;
        case '4':
          planName = 'subscribers';
          break;
        case '5':
          planName = 'agencies';
          break;
        case '6':
          planName = 'agencies';
          break;
        case '7':
          planName = 'demo';
          break;
        case '8':
          planName = 'agencies';
          break;
        default:
          planName = 'free';
          break;
      }
      return planName;
    }

    activate();

    function activate() {
      headerService.getHeaderData($attrs.domain).then(function (response) {
        var mainMenuData = response;
        $rootScope.user = mainMenuData.user;
        $rootScope.user.plan.planType = planTypeByIdUserType(
          $rootScope.user.plan.planType
        );
        $rootScope.loginUrl = mainMenuData.loginUrl;
        $rootScope.$broadcast('user_logged');
        if ($attrs.forceselected) {
          var event = document.createEvent('Event');
          event.initEvent('header_loaded', true, true);
          var selectedMenu = eval($attrs.forceselected);
          $timeout(function () {
            window.dispatchEvent(event);
          });
        }
        $translate.use(mainMenuData.user.lang);
        if (
          !mainMenuData.user.clientManager &&
          !mainMenuData.user.plan.buttonUrl
        ) {
          headerService
            .getUpgradePlanData(
              mainMenuData.user.plan.isSubscribers === 'true' ? 4 : 2,
              mainMenuData.urlBase
            )
            .then(function (result) {
              var filtered = _.filter(result.ClientTypePlans, function (val) {
                return mainMenuData.user.plan.isSubscribers === 'true'
                  ? val.SubscribersQty > mainMenuData.user.plan.maxSubscribers
                  : val.EmailQty > $scope.data.user.plan.maxSubscribers;
              });
              result.ClientTypePlans = filtered;
              $scope.model = result;
            });
        }
      });
    }
  }
})();
