(function() {
  'use strict';

  angular
    .module('dopplerApp.controlPanel')
    .controller('prestashopCtrl', prestashopCtrl);

  prestashopCtrl.$inject = [
    'prestashopService',
    '$timeout',
    '$translate',
    'ModalService',
    'INTEGRATION_CODES',
    'IMPORTING_STATE_STR',
    'INTEGRATION_ERROR_CODES'
  ];

  function prestashopCtrl(prestashopService, $timeout, $translate, ModalService,
    INTEGRATION_CODES, IMPORTING_STATE_STR, INTEGRATION_ERROR_CODES){
    var vm = this;
    vm.connected = false;
    vm.integrationData = {};
    vm.idThirdPartyApp = INTEGRATION_CODES.PRESTASHOP;
    vm.IMPORTING_STATE_STR = IMPORTING_STATE_STR;

    $translate.onReady().then(function() {
      getStatus();
    });

    function getStatus(){
      prestashopService.getStatus()
        .then(function(response){
          if (response.success){
            vm.defaultListName = response.ListName;
            vm.connected = response.connected;
            vm.daysToDisconnection = response.DaysToDisconnection;
            vm.firstValidationErrorDate = response.FirstValidationErrorDate;
            if (!vm.connected){
              getUserLists();
            } else {
              vm.connectedUrlStore = response.store;
              vm.syncDate = response.lastSyncDate;
              vm.integratedLists = [{
                listId: response.IdList,
                subscribersCount: response.subscribersCount,
                listName: response.ListName,
                listStatus: response.subscriberListStatus
              }];
              if (response.subscriberListStatus === IMPORTING_STATE_STR.IMPORTING_SUBSCRIBERS) {
                vm.disableSync = vm.importingList = true;
                vm.checkListState();
              }
            }
          }
          vm.isLoading = false;
        });
    }

    function getUserLists(){
      prestashopService.getUserLists()
        .then(function(listResult){
          if (listResult.success) {
            vm.lists = listResult.lists;
          }
          if (vm.defaultListName){
            setDefaultListSelected(vm.lists, vm.defaultListName);
          }
          vm.isLoading = false;
        })
        .catch(function(){
          showErrorMessage();
        });
    }

    vm.synchronize = function(){
      if (!vm.importingList) {
        vm.importingList = true;
        prestashopService.manualSync(vm.integratedLists[0].listId);
        $timeout(function(){
          vm.disableSync = vm.importingList;
        }, 2500);
        vm.checkListState();
      }
    };

    vm.checkListState = function(){
      vm.stateArray = [];
      vm.integratedLists[0].listStatus = IMPORTING_STATE_STR.IMPORTING_SUBSCRIBERS;
      vm.disableSync = vm.importingList = true;
      vm.stateArray.push({ 'IdSubscribersList': vm.integratedLists[0].listId, 'CurrentStatus': IMPORTING_STATE_STR.IMPORTING_SUBSCRIBERS });
      if (!vm.timer) { //eslint-disable-line
        (function tick() {
          prestashopService.getChangedState(vm.stateArray, vm.idThirdPartyApp).then(function(response){
            if (response.arePending) {
              vm.timer = $timeout(tick, 1000);
            } else {
              vm.timer = undefined;
              vm.importingList = false;
              vm.disableSync = false;
              vm.syncDate = response.syncDate;
              prestashopService.getListData(vm.integratedLists[0].listId).then(function(response){
                vm.integratedLists[0].subscribersCount = response.SubscribersCount;
                vm.integratedLists[0].listStatus = IMPORTING_STATE_STR.READY;
              });
            }
          });
        })();
      }
    };

    vm.connect = function(){
      vm.connecting = true;
      prestashopService.connect(vm.integrationData.appKey, vm.integrationData.url, vm.integrationData.listId)
        .then(function(result){
          if (result.success){
            if (vm.integrationData.listId === 0) {
              vm.integrationData.listId = Number(result.IdList);
            }
            setSelectedList(vm.integrationData.listId);
            vm.checkListState();
            vm.connected = true;
            vm.connectedUrlStore = vm.integrationData.url;
          } else {
            showErrorMessage(result.errorCode);
          }
          vm.connecting = false;
        })
        .catch(function(){
          showErrorMessage();
          vm.connecting = false;
        });
    };

    vm.disconnectWarning = function(){
      ModalService.showModal({
        templateUrl: 'angularjs/partials/shared/modalYesOrNoVtex.html',
        controller: 'ModalYesOrNoPrestashopCtrl',
        inputs: { data:
          {
            title: $translate.instant('prestashop.connected.disconnect_popup.title'),
            description: $translate.instant('prestashop.connected.disconnect_popup.description'),
            buttonCancelLabel: $translate.instant('actions.cancel'),
            buttonPrimaryLabel: $translate.instant('actions.disconnect'),
            buttonPrimaryClass: 'button--primary button--small'
          } }
      })
        .then(function(modal){
          modal.close.then(function(result){
            if (result) {
              vm.connectionError = false;
              vm.connected = false;
              vm.integrationData.store = '';
              vm.integrationData.appKey = '';
              vm.integrationData.listId = 0;
              vm.connectedUrlStore = '';
              vm.disconnected = true;
              if (!vm.lists){
                getUserLists();
              }
            }
          });
        });
    };

    function showErrorMessage(errorCode) {
      vm.errorMsg = $translate.instant('prestashop.disconnected.errors.cannot_connect');
      if (errorCode) {
        switch (errorCode) {
        case INTEGRATION_ERROR_CODES.PS_CANNOT_CONNECT:
          vm.errorMsg = $translate.instant('prestashop.disconnected.errors.cannot_connect');
          break;
        case INTEGRATION_ERROR_CODES.PS_NO_PERMISSION:
          vm.errorMsg = $translate.instant('prestashop.disconnected.errors.no_permissions');
          break;
        case INTEGRATION_ERROR_CODES.CANNOT_SYNC_LIST:
          vm.errorMsg = $translate.instant('prestashop.disconnected.errors.no_sync_list');
          break;
        case INTEGRATION_ERROR_CODES.UNAUTHORIZED:
          vm.errorMsg = $translate.instant('prestashop.disconnected.errors.unauthorized');
          break;
        default:
          break;
        }
      }
      $timeout(function() {
        vm.errorMsg = '';
      }, 8000);
    }

    function setDefaultListSelected(allLists, listName){
      vm.integrationData.listId = 0;
      if (allLists.length) {
        _.each(allLists, function(currentList){
          if (currentList.ListName === listName){
            vm.integrationData.listId = currentList.IdList;
          }
        });
      }
      if (vm.integrationData.listId === 0){
        allLists.push({IdList: 0, ListName: listName});
      }
    }

    function setSelectedList(listId){
      var selectedList = _.find(vm.lists, function(list){
        return list.IdList === listId;
      });
      var listName = !!selectedList ? selectedList.ListName : vm.defaultListName; //eslint-disable-line

      vm.integratedLists = [{
        listId: listId,
        subscribersCount: 0,
        listName: listName,
        listStatus: IMPORTING_STATE_STR.IMPORTING_SUBSCRIBERS
      }];
    }
  }

})();

