(function () {
  'use strict';

  angular.module('dopplerApp').factory('gridService', gridService);

  gridService.$inject = ['$q', '$translate', 'gridDataservice'];

  function gridService($q, $translate, gridDataservice) {
    var service = {
      initGrid: initGrid,
    };

    return service;
    /** @param {object} options:
     * idListsOrSegmentFilter
     * isSelectElementGrid
     * selectedItemOptions - selectedItem - selectedItems
     * getDataUrl: url to get list
     * deleteRowUrl: url to remove an item
     */
    function initGrid(options) {
      var Model = {};

      Model.displayed = [];
      Model.labelSelected = 0;
      Model.page = 1;
      Model.searchText = '';
      Model.currentSort = 'DESC';
      Model.sortDir = '';
      Model.idSegment = 0;
      Model.idListsOrSegmentFilter = options.idListsOrSegmentFilter || 0;
      Model.cantPerPage = 15;
      Model.allCampaignsLoaded = true;
      Model.dateFormat =
        mainMenuData.user.lang === 'es' ? 'dd/MM/yyyy' : 'MM/dd/yyyy';
      Model.currentSort = '';
      Model.firstTimeLoad = true;
      Model.automationId = options.automationId || 0;
      Model.isSelectElementGrid = options.isSelectElementGrid || false;
      Model.selectedItemOptions = options.selectedItemOptions || {};
      Model.selectedItem = {};
      Model.selectedItems = [];
      Model.labelFilters = [
        {
          id: 0,
          name: $translate.instant('empty_filter'),
        },
        {
          id: -1,
          name: $translate.instant('empty_label'),
        },
      ];
      Model.labelSelected = Model.labelFilters[0].id;

      if (
        options.selectedItemOptions &&
        options.selectedItemOptions.selectedItem
      ) {
        Model.selectedItem = options.selectedItemOptions.selectedItem;
      }
      if (
        options.selectedItemOptions &&
        options.selectedItemOptions.selectedItems
      ) {
        Model.selectedItems = options.selectedItemOptions.selectedItems;
      }

      Model.getLabels = function (allLabels) {
        var deferred = $q.defer();

        if (allLabels) {
          Model.labelFilters.push({
            id: -2,
            name: $translate.instant(
              'automation_editor.lists_scheduled_grid.list_filter'
            ),
          });
          Model.labelFilters.push({
            id: -3,
            name: $translate.instant(
              'automation_editor.lists_scheduled_grid.segments_filter'
            ),
          });
        }
        gridDataservice.getAllUserLabels().then(function (response) {
          var data = response.data.labelslist;
          if (Model.idListsOrSegmentFilter === 2) {
            data = _.filter(data, function (item) {
              return item.LabelType === 'LIST';
            });
          }
          angular.forEach(data, function (item) {
            item.LabelName +=
              item.LabelType === 'SEGMENT'
                ? $translate.instant(
                    'automation_editor.lists_scheduled_grid.segments'
                  )
                : '';
            Model.labelFilters.push({ id: item.IdLabel, name: item.LabelName });
          });
          deferred.resolve(Model.labelFilters);
        });

        return deferred.promise;
      };

      Model.getListData = function () {
        var deferred = $q.defer();

        var params = {
          searchText: Model.searchText.length >= 3 ? Model.searchText : '',
          page: Model.page,
          cantPerPage: Model.cantPerPage,
          sort: Model.currentSort,
          sortDir: Model.sortDir,
          idLabel: Model.labelSelected,
          idSegment: Model.idSegment,
          idListsOrSegmentFilter:
            options.idListsOrSegmentFilter || Model.idListsOrSegmentFilter,
          idScheduledTask: Model.automationId,
        };

        gridDataservice
          .getListsItems(options.getDataUrl, params)
          .then(function (response) {
            var data = loadData(response);
            Model.isEmptyGrid = Model.firstTimeLoad && data.length === 0;
            Model.firstTimeLoad = false;

            if (Model.page > 1) {
              var list = Model.formatDate(data);
              Model.displayed = Model.displayed.concat(list);
            } else {
              Model.displayed = data;
              Model.displayed = Model.formatDate(Model.displayed);
            }
            if (
              Model.isSelectElementGrid &&
              Model.selectedItem &&
              Object.keys(Model.selectedItem).length !== 0 &&
              Model.selectedItem.constructor === Object &&
              Model.selectedItem[Model.selectedItemOptions.keyToCompare] !== 0
            ) {
              Model.displayed = filterItemsSelected(
                Model.displayed,
                Model.selectedItem,
                false
              );
            }
            if (
              Model.isSelectElementGrid &&
              Object.keys(Model.selectedItems).length !== 0
            ) {
              var filterSelecteds = Model.displayed;
              _.each(Model.selectedItems, function (selectedItem) {
                filterSelecteds = filterItemsSelected(
                  filterSelecteds,
                  selectedItem,
                  true
                );
              });
              Model.displayed = Model.selectedItems.concat(filterSelecteds);
            }

            deferred.resolve(response);
          });

        Model.allCampaignsLoaded = false;

        return deferred.promise;
      };

      Model.deleteRow = function (row, idPropertyName, params) {
        var deferred = $q.defer();
        row.deleting = false;
        gridDataservice
          .deleteTask(options.deleteRowUrl, params)
          .then(function (response) {
            var indexToRemove = -1;
            if (response.data.success) {
              angular.forEach(Model.displayed, function (item, index) {
                if (item[idPropertyName] === row[idPropertyName]) {
                  indexToRemove = index;
                  return;
                }
              });
            }
            if (indexToRemove !== -1) {
              Model.displayed.splice(indexToRemove, 1);
            }
            deferred.resolve(response);
          });
        Model.getListData();
        return deferred.promise;
      };

      function filterItemsSelected(arrayData, selectedItem, isSelectedsArray) {
        var filterSelected = _.filter(arrayData, function (list) {
          return (
            selectedItem[Model.selectedItemOptions.keyToCompare] !==
            list[Model.selectedItemOptions.keyToCompare]
          );
        });
        selectedItem[Model.selectedItemOptions.keyChecked] = true;
        if (!isSelectedsArray) {
          filterSelected.unshift(Model.selectedItem);
        }
        return filterSelected;
      }

      function loadData(response) {
        return (
          response.data.associationModel ||
          response.data.tasksList ||
          response.data
        );
      }

      Model.formatDate = function (list) {
        var pattern = /Date\(([^)]+)\)/;
        angular.forEach(list, function (item) {
          if (item.CreationDate) {
            item.CreationDate = new Date(
              parseFloat(pattern.exec(item.CreationDate)[1])
            );
          }
          if (item.LastSentDate) {
            item.LastSentDate = new Date(
              parseFloat(pattern.exec(item.LastSentDate)[1])
            );
          }
          if (item.ListName) {
            item.ListName +=
              item.IdSegment && item.IdSegment !== 0
                ? $translate.instant(
                    'automation_editor.lists_scheduled_grid.segments'
                  )
                : '';
          }
        });
        return list;
      };

      Model.sort = function (sortField) {
        var deferred = $q.defer();
        Model.page = 1;

        if (Model.currentSort === sortField) {
          Model.sortDir = Model.sortDir === 'ASC' ? 'DESC' : 'ASC';
        } else {
          Model.sortDir = 'DESC';
          Model.currentSort = sortField;
        }
        Model.allCampaignsLoaded = false;
        Model.getListData().then(function (response) {
          deferred.resolve(response);
        });

        return deferred.promise;
      };

      Model.setArrowClass = function (sortField) {
        return Model.currentSort !== sortField ||
          (Model.currentSort === sortField && Model.sortDir === 'DESC')
          ? 'icon-grid-sorting-down'
          : 'icon-grid-sorting-up';
      };

      Model.cleanSearch = function () {
        var deferred = $q.defer();
        Model.page = 1;
        Model.searchText = '';
        Model.allCampaignsLoaded = false;
        Model.getListData().then(function (response) {
          deferred.resolve(response);
        });

        return deferred.promise;
      };

      Model.search = function (searchText, labelSelected, reload) {
        var deferred = $q.defer();
        Model.page = 1;
        Model.labelSelected = labelSelected;
        Model.searchText = searchText;
        var searchLength = searchText.length;

        if (searchLength >= 3 || searchLength === 0 || reload) {
          Model.allCampaignsLoaded = false;
          if (Model.labelSelected === -2) {
            Model.idListsOrSegmentFilter = 2;
          } else if (Model.labelSelected === -3) {
            Model.idListsOrSegmentFilter = 1;
          } else {
            Model.idListsOrSegmentFilter = 0;
          }
          Model.getListData(true).then(function (response) {
            deferred.resolve(response);
          });
        } else {
          deferred.reject();
        }

        return deferred.promise;
      };

      Model.onScroll = function () {
        var deferred = $q.defer();
        if (Model.allCampaignsLoaded) {
          return $q.reject();
        }
        Model.page++;
        Model.getListData().then(function (response) {
          deferred.resolve(response);
        });

        return deferred.promise;
      };

      return Model;
    }
  }
})();
