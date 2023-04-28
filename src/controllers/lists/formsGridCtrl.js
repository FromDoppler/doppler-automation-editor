(function () {
  'use strict';

  angular.module('dopplerApp.forms').controller('FormsGridCtrl', FormsGridCtrl);

  FormsGridCtrl.$inject = [
    '$translate',
    'gridService',
    'FORM_STATE',
    'FORM_TYPE',
    'formsService',
    '$window',
  ];

  function FormsGridCtrl(
    $translate,
    gridService,
    FORM_STATE,
    FORM_TYPE,
    formsService,
    $window
  ) {
    var vm = this;
    vm.FORM_STATE = FORM_STATE;
    vm.FORM_TYPE = FORM_TYPE;
    vm.isLoading = true;
    vm.rows = 10;
    vm.formsQuantity = '';
    vm.totalForms = 0;
    vm.maxForms = 0;
    vm.filterOptions = [
      { label: 'Publicado', value: 1 },
      { label: 'Borrador', value: 2 },
    ];

    formsService.getFormConfig().then(function (response) {
      vm.maxForms = response.maxForms;
    });

    vm.gridModel = gridService.initGrid({
      getDataUrl: '/Lists/Form/GetAllForms',
      deleteRowUrl: '/Lists/Form/RemoveForm',
    });

    $translate.onReady().then(function () {
      vm.gridModel.currentSort = 'CREATION_DATE';
      vm.gridModel.sortDir = 'DESC';
      loadData();
    });

    function loadData() {
      vm.gridModel.getListData().then(function (response) {
        vm.totalForms =
          vm.totalForms === 0 ? response.data.formsQuantity : vm.totalForms;
        vm.isLoading = false;
        vm.gridLoading = false;
      });
    }

    vm.disableDeletedRows = function () {
      _.each(vm.gridModel.displayed, function (row) {
        row.deleting = false;
      });
    };

    vm.deleteRowConfirmed = function (row) {
      vm.gridModel
        .deleteRow(row, 'Id', { Id: row.Id })
        .then(function (response) {
          if (response.data.success) {
            vm.totalForms--;
          }
        });
    };

    //TODO: add duplication row functionality
    vm.duplicateRow = function (row) {
      //eslint-disable-line  no-unused-vars
    };

    vm.goToOldEditor = function () {
      $window.location.href = '/Lists/Form/Create';
    };

    vm.showFormTypesScreen = function () {
      $window.location.href = '/Lists/Form/FormTypes';
    };
  }
})();
