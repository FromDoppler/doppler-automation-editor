'use strict';

describe('integrateFacebookController', function () {
  beforeEach(module('dopplerApp.forms'));

  var $translate;
  var $scope = {};
  var $controller;
  var $location;
  var facebookService = {
    hasPermissionInFacebook: {},
    getFacebookDataModel: {},
    saveTab: {},
  };
  var spyPermission;

  var FORM_INTEGRATION_FB_STATE = {
    NO_FB_ACCOUNT: 'no_fb_account',
    NO_TAB_CONFIGURED: 'no_tab_configured',
    NO_TAB_CONFIGURED_SHOW_SETTINGS: 'no_tab_configured_show_settings',
    TAB_INSTALLED: 'tab_installed',
    TAB_DELETED: 'tab_deleted',
    TAB_DELETE_CONFIRMATION: 'tab_delete_confirmation',
  };

  var FORM_INTEGRATION_ERROR_CODE = {
    TAB_ERROR_CODE: 219,
  };

  beforeEach(function () {
    module(function ($provide) {
      $provide.value('$translate', $translate);
    });

    module(function ($provide) {
      $provide.value('FORM_INTEGRATION_FB_STATE', FORM_INTEGRATION_FB_STATE);
    });

    module(function ($provide) {
      $provide.value(
        'FORM_INTEGRATION_ERROR_CODE',
        FORM_INTEGRATION_ERROR_CODE
      );
    });

    module(function ($provide) {
      $provide.value('$scope', $scope);
    });
  });

  it('should have correct state when no account connected', inject(function (
    _$rootScope_,
    _$controller_,
    _$location_,
    $q
  ) {
    facebookService.hasPermissionInFacebook = function () {
      var deferred = $q.defer();
      deferred.resolve(false);
      return deferred.promise;
    };

    $controller = _$controller_('FormIntegrateFacebookCtrl', {
      $scope: _$rootScope_.$new(),
      $translate: $translate,
      FORM_INTEGRATION_FB_STATE: FORM_INTEGRATION_FB_STATE,
      FORM_INTEGRATION_ERROR_CODE: FORM_INTEGRATION_ERROR_CODE,
      facebookService: facebookService,
      $location: _$location_,
    });
    _$rootScope_.$apply();

    //Assert
    expect($controller.facebookData.accountName).toEqual('');
    expect($controller.facebookData.fanPages).toEqual([]);
    expect($controller.facebookData.tabUrl).toEqual('');
    expect($controller.facebookData.thumbnail).toEqual('');
    expect($controller.facebookData.facebookFanPageSelected.label).toEqual('');
    expect($controller.facebookData.facebookFanPageSelected.value).toEqual('');
    expect($controller.facebookData.facebookTabName).toEqual('');
    expect($controller.facebookData.idInstalledTab).toEqual(0);
    expect($controller.integrationStatus).toEqual(
      FORM_INTEGRATION_FB_STATE.NO_FB_ACCOUNT
    );
  }));

  it('should have correct state when account conected and no tab installed', inject(function (
    _$rootScope_,
    _$controller_,
    _$location_,
    $q
  ) {
    var onlyAccountModel = {
      FanPageList: [],
      TabName: '',
      AccountName: 'Juan Lopez',
      ImageUrl: '',
      TabUrl: '',
      IdFacebookTabSetting: 0,
      FanPageName: '',
      FanPageId: '',
    };

    spyOn(facebookService, 'hasPermissionInFacebook').and.callFake(function () {
      var deferred = $q.defer();
      deferred.resolve(true);
      return deferred.promise;
    });

    spyOn(facebookService, 'getFacebookDataModel').and.callFake(function () {
      var deferred = $q.defer();
      deferred.resolve(onlyAccountModel);
      return deferred.promise;
    });

    $controller = _$controller_('FormIntegrateFacebookCtrl', {
      $scope: _$rootScope_.$new(),
      $translate: $translate,
      FORM_INTEGRATION_FB_STATE: FORM_INTEGRATION_FB_STATE,
      FORM_INTEGRATION_ERROR_CODE: FORM_INTEGRATION_ERROR_CODE,
      facebookService: facebookService,
      $location: _$location_,
    });
    _$rootScope_.$apply();

    //Assert
    expect($controller.facebookData.accountName).toEqual('Juan Lopez');
    expect($controller.facebookData.fanPages).toEqual([]);
    expect($controller.facebookData.tabUrl).toEqual('');
    expect($controller.facebookData.thumbnail).toEqual('');
    expect($controller.facebookData.facebookFanPageSelected.label).toEqual('');
    expect($controller.facebookData.facebookFanPageSelected.value).toEqual('');
    expect($controller.facebookData.facebookTabName).toEqual('');
    expect($controller.facebookData.idInstalledTab).toEqual(0);
    expect($controller.integrationStatus).toEqual(
      FORM_INTEGRATION_FB_STATE.NO_TAB_CONFIGURED
    );
  }));

  it('should have correct state and data when tab installed', inject(function (
    _$rootScope_,
    _$controller_,
    _$location_,
    $q
  ) {
    var onlyAccountModel = {
      FanPageList: [],
      TabName: 'Nueva Tab',
      AccountName: 'Juan Lopez',
      ImageUrl: '',
      TabUrl: '',
      IdFacebookTabSetting: 0,
      FanPageName: '',
      FanPageId: '',
    };

    spyOn(facebookService, 'hasPermissionInFacebook').and.callFake(function () {
      var deferred = $q.defer();
      deferred.resolve(true);
      return deferred.promise;
    });

    spyOn(facebookService, 'getFacebookDataModel').and.callFake(function () {
      var deferred = $q.defer();
      deferred.resolve(onlyAccountModel);
      return deferred.promise;
    });

    spyOn(facebookService, 'saveTab').and.callFake(function () {
      var deferred = $q.defer();
      var response = {
        success: true,
      };
      deferred.resolve(response);
      return deferred.promise;
    });

    $controller = _$controller_('FormIntegrateFacebookCtrl', {
      $scope: _$rootScope_.$new(),
      $translate: $translate,
      FORM_INTEGRATION_FB_STATE: FORM_INTEGRATION_FB_STATE,
      FORM_INTEGRATION_ERROR_CODE: FORM_INTEGRATION_ERROR_CODE,
      facebookService: facebookService,
      $location: _$location_,
    });

    $controller.installTab();

    _$rootScope_.$apply();

    //Assert
    expect($controller.facebookData.accountName).toEqual('Juan Lopez');
    expect($controller.facebookData.fanPages).toEqual([]);
    expect($controller.facebookData.tabUrl).toEqual('');
    expect($controller.facebookData.thumbnail).toEqual('');
    expect($controller.facebookData.facebookFanPageSelected.label).toEqual('');
    expect($controller.facebookData.facebookFanPageSelected.value).toEqual('');
    expect($controller.facebookData.facebookTabName).toEqual('Nueva Tab');
    expect($controller.facebookData.idInstalledTab).toEqual(0);
    expect($controller.integrationStatus).toEqual(
      FORM_INTEGRATION_FB_STATE.TAB_INSTALLED
    );
  }));
});
