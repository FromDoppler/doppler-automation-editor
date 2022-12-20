(function() {
  'use strict';

  angular
    .module('dopplerApp.automation')
    .controller('automationTaskReportsCtrl', automationTaskReportsCtrl);

  automationTaskReportsCtrl.$inject = [
    '$scope',
    '$rootScope',
    '$location',
    'taskService',
    'summaryTaskService',
    'automationReportsService',
    '$translate',
    'accountInformation',
    '_',
    '$sce',
    '$filter',
    'ModalService',
    'utils'
  ];

  function automationTaskReportsCtrl($scope, $rootScope, $location, taskService, summaryTaskService,
    automationReportsService, $translate, accountInformation, _, $sce, $filter, ModalService, utils) {
    $scope.email = mainMenuData.user.email;
    $scope.pageLoading = true;
    $scope.idScheduledTask = $location.search().idScheduledTask === undefined ? 0 :
      parseInt($location.search().idScheduledTask);
    $scope.idAction = $location.search().idAction ? parseInt($location.search().idAction) : 0;
    var showAll = !!$location.search().showAll;
    $scope.account = accountInformation;
    $translate.use($scope.account.Lang);
    $scope.dateFormat = $scope.account.Lang === 'es' ? 'dd/MM/yyyy' : 'MM/dd/yyyy';
    $scope.dateTimeFormat = $scope.account.Lang === 'es' ? 'dd/MM/yyyy - h:mm:ss a' : 'MM/dd/yyyy - h:mm:ss a';
    $scope.showActionFilter = false;
    $scope.showSmsFilter = false;
    $scope.actions = [];
    $scope.indexedActions = [];
    $scope.selectedActionIds = [];
    $scope.fieldsText = '';
    $scope.fieldsListSeleted = [];
    $scope.fieldsTextTooltip = '';
    $scope.fieldsTextTooltipBody = '';
    $scope.frecuencyType = '';
    $scope.datacolumns = [];
    $scope.sentList = [];
    $scope.datapoints = [];
    $scope.engagement = 0;
    $scope.disabledSection = true;
    $scope.funnelArray = [];
    $scope.donutInfo = {};
    $scope.donutInfoSms = {};
    $scope.donutInfoPush = {};
    $scope.openGraphData = {};
    $scope.donutGraphDataSms = {};
    $scope.clickGraphData = {};
    $scope.donutGraphData = {};
    $scope.loaded = false;
    $scope.engagementList = [];
    $scope.reportsType = ($location.search().eventType === 'push_notification') ? 2 : 0;

    $scope.donutData = [];
    $scope.datax = { 'id': 'x' };

    $translate.onReady().then(function() {
      $scope.options = [
        { id: 0, name: $translate.instant('ScheduledTask_Reports_LastWeek') },
        { id: 1, name: $translate.instant('ScheduledTask_Reports_LastMonth') },
        { id: 2, name: $translate.instant('ScheduledTask_Reports_LastYear') },
        { id: 3, name: $translate.instant('ScheduledTask_Reports_All') }
      ];

      if (!showAll) {
        $scope.selectedOption = { id: 0, name: $translate.instant('ScheduledTask_Reports_LastWeek') };
      } else {
        $scope.selectedOption = { id: 3, name: $translate.instant('ScheduledTask_Reports_All') };
      }

      $scope.selectedView = 'dashboard';
      $scope.open = $translate.instant('ScheduledTask_Reports_Open');
      $scope.delivered = $translate.instant('ScheduledTask_Reports_Reached_Subscriptors');
      $scope.notdelivered = $translate.instant('ScheduledTask_Reports_Not_Reached_Subscriptors');
      $scope.sent = $translate.instant('ScheduledTask_Reports_Total_Sms');
      $scope.notOpen = $translate.instant('ScheduledTask_Reports_NotOpen');
      $scope.bounced = $translate.instant('ScheduledTask_Reports_Bounced');
      $scope.openTooltip = $translate.instant('ScheduledTask_Reports_OpenGraph_tooltip');
      $scope.clickTooltip = $translate.instant('ScheduledTask_Reports_Grid_Clicks');
      $scope.donutTitle = $translate.instant('ScheduledTask_Reports_OpenRate');
      $scope.noDataTitle = $translate.instant('ScheduledTask_Reports_NoOpens');
      $scope.donutInfo.names = { 'opens': $scope.open, 'notopen': $scope.notOpen, 'bounced': $scope.bounced };
      $scope.donutInfoSms.names = { 'delivered': $scope.delivered, 'notdelivered': $scope.notdelivered, 'sent': $scope.sent };
      $scope.donutInfo.colors = { 'opens': '#009F4E', 'notopen': '#666666', 'bounced': '#F82C1F' };
      $scope.donutInfoSms.colors = { 'delivered': '#009F4E', 'notdelivered': '#F82C1F', 'sent': '#666' };
      getTask();
    });

    $scope.getDonutChartConfig = function(id, colors, data, names, title, showlabel, showTooltip) {
      var config = {
        bindto: id,
        data: {
          columns: data,
          type: 'donut',
          colors: colors,
          names: names
        },
        donut: {
          title: title,
          label: {
            show: showlabel,
            format: function(value, ratio) {
              return (ratio * 100 % 1 === 0) ?
                $filter('number')(ratio * 100) + '%' :
                $filter('number')(ratio * 100, 1) + '%';
            }
          }
        },
        legend: {
          show: false
        },
        size: {
          height: 248,
          width: 248
        },
        tooltip: {
          show: showTooltip,
          format: {
            value: function(value, ratio) {
              return (ratio * 100 % 1 === 0) ?
                $filter('number')(ratio * 100) + '%' :
                $filter('number')(ratio * 100, 1) + '%';
            }
          }
        }
      };
      return config;
    };


    $scope.getLineChartConfig = function(id, timeaxis, campaignDataArray, campaignNames, maxY, tooltipText) {

      var columnData = [];
      columnData.push(timeaxis);
      angular.forEach(campaignDataArray, function(value) {
        columnData.push(value);
      });
      // get max value multiple of 4
      if (maxY === 0) {
        maxY = 4;
      } else if (maxY % 4 !== 0) {
        maxY = Math.floor((maxY + 3) / 4) * 4;
      }

      var chartJson = {
        bindto: id,
        data: {
          type: 'area-spline',
          x: 'x',
          columns: columnData,
          names: campaignNames
        },
        size: {
          height: 240,
          width: 870
        },
        grid: {
          y: {
            show: true
          }
        },
        tooltip: {
          // Default true
          grouped: false,
          format: {
            name: function() {
              return tooltipText;
            },
            value: function(value) {
              return (value % 1 === 0) ? $filter('number')(value) : $filter('number')(value, 1);
            }
          }
        },
        axis: {
          y: {
            tick: {
              count: 5,
              format: function(d) {
                return (d);
              }
            },
            min: 0,
            padding: { top: 0, bottom: 0 },
            max: maxY
          },
          x: {
            type: 'category',
            tick: {
              categories: timeaxis
            }
          }
        },
        legend: {
          show: false
        }
      };
      return chartJson;
    };

    $scope.changeOption = function() {
      if ($scope.reportsType === 2) {
        $scope.getPushResults();
      } else if ($scope.reportsType === 1) {
        $scope.getSmsResults();
      } else {
        $scope.getResults();
      }
    };

    $scope.getCsvReport = function (typeReport) {
      ModalService.showModal({
        templateUrl: 'angularjs/partials/shared/modalWithInput.html',
        controller: 'modalExportAutomationReportsCtrl',
        inputs: {
          data: {
            title: $translate.instant('ScheduledTask_Reports_Sms_reports_export_title'),
            buttonCancelLabel: $translate.instant('actions.cancel'),
            buttonPrimaryLabel: $translate.instant('ScheduledTask_Reports_Sms_reports_export_button'),
            buttonPrimaryClass: 'button--primary button--small',
            fieldValue: $scope.email,
            required: true,
            regex: utils.REGEX_EMAIL,
            label: $translate.instant('ScheduledTask_Reports_Sms_reports_export_label'),
            selectedActionIds: $scope.selectedActionIds,
            optionTimePeriod: $scope.selectedOption.id,
            scheduledTaskId: $scope.idScheduledTask,
            typeReport: typeReport
          }
        }
      });
    }

    function getTask() {
      summaryTaskService.getSummaryTask($scope.idScheduledTask)
        .then(function(response) {
          var data = response.data;
          $scope.taskName = data.model.TaskName;
          $scope.frecuencyType = data.model.FrequencyType;
          $scope.fieldsListSeleted = data.model.NameFieldsList;
          var charactersInLine = '';
          var charactersInLineBody = '';
          angular.forEach($scope.fieldsListSeleted, function(item, index) {
            $scope.fieldsText = $scope.fieldsText + '“' + item + '” ';
            $scope.fieldsTextTooltip = $scope.fieldsTextTooltip + '“' + item + '” ';
            $scope.fieldsTextTooltipBody = $scope.fieldsTextTooltipBody + '“' + item + '” ';
            charactersInLine = charactersInLine + '“' + item + '” ';
            charactersInLineBody = charactersInLineBody + '“' + item + '” ';
            if (index === $scope.fieldsListSeleted.length - 1) {
              $scope.fieldsText = $scope.fieldsText.substring(0, $scope.fieldsText.length - 1);
            }
            if (charactersInLine.length > 70) {
              charactersInLine = '';
              $scope.fieldsTextTooltip = $scope.fieldsTextTooltip + '<br/>';
            }
            if (charactersInLineBody.length > 130) {
              charactersInLineBody = '';
              $scope.fieldsTextTooltipBody = $scope.fieldsTextTooltipBody + '<br/>';
            }

          });
          $scope.dayPerWeek = [];
          angular.forEach(data.model.DayPerWeek, function(value) {
            $scope.dayPerWeek.push($translate.instant('ScheduledTask_Summary_Day_' + value));
          });
          $scope.dayPerMonth = data.model.DayPerMonth;
          angular.forEach(data.model.DelaysList, function(item) {
            var itemToAdd = {
              name: item.CampaignName, urlPreview: item.PreviewUrl,
              idAutomationAction: item.IdAction, selected: 'true'

            };
            var column = {id: item.IdAction.toString(), 'type': 'spline', name: item.CampaignName };
            $scope.datacolumns.push(column);
            $scope.actions.push(itemToAdd);
            //done this to access faster to action
            $scope.indexedActions[itemToAdd.idAutomationAction] = itemToAdd;
            if ($scope.idAction === 0 || $scope.idAction === itemToAdd.idAutomationAction) {
              $scope.selectedActionIds.push(itemToAdd.idAutomationAction);
            }
          });
          $scope.getResults();
          $scope.getSmsResults();
          $scope.getPushResults();

        }, function() {
          $scope.reportsLoading = false;
          $scope.pageLoading = false;
        });
    }

    $scope.getHtml = function(html) {
      return $sce.trustAsHtml(html);
    };

    function setEngagementResult(data) {
      $scope.engagementList = [];
      if (data !== undefined && data.Items !== undefined) {
        angular.forEach(data.Items, function(item) {
          $scope.engagementList.push({
            points: item.Ranking, email: item.Email,
            name: (item.FirstName !== null ? item.FirstName : '-') + ' ' + (item.LastName !== null ? item.LastName : '-')
          });
        });
      }
    }

    function setResult(model) {
      var data;
      var dateFilterFormat;
      var pattern = /Date\(([^)]+)\)/;
      $scope.result = model;
      data = [['noinfo', 100]];
      $scope.donutGraphDataSms = $scope.getDonutChartConfig('#sms', { 'noinfo': '#dcdcdc' }, data, { 'noinfo': 'NO info' }, $scope.noDataTitle, false, false);

      if ($scope.selectedOption.id === 0 || $scope.selectedOption.id === 1) {
        dateFilterFormat = 'dd';
      } else {
        dateFilterFormat = 'dd MMMM';
      }
      if ($scope.result !== undefined) {
        angular.forEach($scope.result.ItemsGroupedByDate, function(item) {
          item.Date = new Date(parseFloat(pattern.exec(item.Date)[1]));
        });
        $scope.result.LastClickedEmailDate = new Date(parseFloat(pattern.exec($scope.result.LastClickedEmailDate)[1]));
        $scope.result.LastOpenedEmailDate = new Date(parseFloat(pattern.exec($scope.result.LastOpenedEmailDate)[1]));

        //donut data
        var bouncedPercent = ($scope.result.TotalHardBouncedMailCount + $scope.result.TotalSoftBouncedMailCount) /
          $scope.result.TotalSentCount * 100;
        var notopenPercent = ($scope.result.TotalUnopenedMailCount / $scope.result.TotalSentCount * 100);
        var openPercent = $scope.result.TotalDistinctOpenedMailCount / $scope.result.TotalSentCount * 100;
        var clickPercent = ($scope.result.TotalUniqueClickCount * 100) / $scope.result.TotalClickCount;
        $scope.donutData = {
          'notopen': $filter('number')(notopenPercent, 1),
          'open': $filter('number')(openPercent, 1),
          'bounced': $filter('number')(bouncedPercent, 1),
          'CTOR': $filter('number')($scope.result.TotalClickThroughOpenRate, 1),
          'uniqueClickPercent': clickPercent % 1 === 0 ? $filter('number')(clickPercent) : $filter('number')(clickPercent, 2)

        };
        $scope.donutInfo.data = [['opens', $scope.result.TotalDistinctOpenedMailCount], ['notopen', $scope.result.TotalUnopenedMailCount], ['bounced', $scope.result.TotalHardBouncedMailCount + $scope.result.TotalSoftBouncedMailCount]];

        //line chart opens and clicks
        $scope.timeArray = [];
        $scope.campaignNames = {};
        $scope.campaignDataOpensArray = [];
        $scope.campaignDataClicksArray = [];
        $scope.maxOpenData = 0;
        $scope.maxClickData = 0;

        var tempMax = 0;

        //get campaign names of selected actions on filter
        angular.forEach($scope.selectedActionIds, function(item) {
          $scope.campaignNames[item] = $scope.indexedActions[item].name;
        });

        angular.forEach($scope.result.ActionItems, function(item, key) {
          var id = item.IdAutomationAction;
          var openData = [];
          var clickData = [];
          openData.push(id);
          clickData.push(id);
          if (key === 0) {
            $scope.timeArray.push('x');
          }
          angular.forEach(item.Items, function(actionItem) {
            if (key === 0) {
              $scope.timeArray.push($filter('date')(new Date(parseFloat(pattern.exec(actionItem.Date)[1])), dateFilterFormat));
            }
            openData.push(actionItem.OpenedMailCount);
            clickData.push(actionItem.ClickCount);
          });
          $scope.campaignDataOpensArray.push(openData);
          $scope.campaignDataClicksArray.push(clickData);

          // get max value for opens and clicks
          var openDataValues = angular.copy(openData);
          var clickDataValues = angular.copy(clickData);
          openDataValues.shift();
          clickDataValues.shift();
          tempMax = _.max(openDataValues);
          $scope.maxOpenData = tempMax > $scope.maxOpenData ? tempMax : $scope.maxOpenData;
          tempMax = _.max(clickDataValues);
          $scope.maxClickData = tempMax > $scope.maxClickData ? tempMax : $scope.maxClickData;
        });


        $scope.openGraphData = $scope.getLineChartConfig('#chart', $scope.timeArray, $scope.campaignDataOpensArray, $scope.campaignNames, $scope.maxOpenData, $scope.openTooltip);
        $scope.clickGraphData = $scope.getLineChartConfig('#clicksChart', $scope.timeArray, $scope.campaignDataClicksArray, $scope.campaignNames, $scope.maxClickData, $scope.clickTooltip);
        if ($scope.result.TotalSentCount !== 0) {
          $scope.donutGraphData = $scope.getDonutChartConfig('#opens', $scope.donutInfo.colors, $scope.donutInfo.data, $scope.donutInfo.names, $scope.donutTitle, true, true);
        } else {
          data = [['noinfo', 100]];
          $scope.donutGraphData = $scope.getDonutChartConfig('#opens', { 'noinfo': '#dcdcdc' }, data, { 'noinfo': 'NO info' }, $scope.noDataTitle, false, false);
        }
        //set funnel array data
        $scope.funnelArray = [];
        $scope.funnelArray.push({ 'catname': $translate.instant('ScheduledTask_Reports_Grid_Sent'), value: $scope.result.TotalSentCount });
        $scope.funnelArray.push({ 'catname': $translate.instant('ScheduledTask_Reports_Grid_Delivered'), value: $scope.result.TotalDeliveryCount });

        $scope.funnelArray.push({ 'catname': $translate.instant('ScheduledTask_Reports_FunnelOpen'), value: $scope.result.TotalDistinctOpenedMailCount });
        $scope.funnelArray.push({ 'catname': $translate.instant('ScheduledTask_Reports_Grid_Clicks'), value: $scope.result.TotalUniqueClickPerCampaignCount });
        $scope.totalFunnel = $scope.result.TotalSentCount;
        if ($scope.totalFunnel === 0) {
          $scope.totalFunnel = 1;
        }
      } else {
        //line chart opens and clicks
        $scope.timeArray = [];
        $scope.campaignNames = {};
        $scope.campaignDataOpensArray = [];
        $scope.campaignDataClicksArray = [];
        $scope.maxOpenData = 4;
        $scope.maxClickData = 4;
        $scope.funnelArray = [];
        $scope.funnelArray.push({ 'catname': $translate.instant('ScheduledTask_Reports_Grid_Sent'), value: 0 });
        $scope.funnelArray.push({ 'catname': $translate.instant('ScheduledTask_Reports_Grid_Delivered'), value: 0 });

        $scope.funnelArray.push({ 'catname': $translate.instant('ScheduledTask_Reports_FunnelOpen'), value: 0 });
        $scope.funnelArray.push({ 'catname': $translate.instant('ScheduledTask_Reports_Grid_Clicks'), value: 0 });
        $scope.totalFunnel = 1;

        $scope.openGraphData = $scope.getLineChartConfig('#chart', $scope.timeArray, $scope.campaignDataOpensArray, $scope.campaignNames, $scope.maxOpenData, $scope.openTooltip);
        $scope.clickGraphData = $scope.getLineChartConfig('#clicksChart', $scope.timeArray, $scope.campaignDataClicksArray, $scope.campaignNames, $scope.maxClickData, $scope.clickTooltip);
        data = [['noinfo', 100]];
        $scope.donutGraphData = $scope.getDonutChartConfig('#opens', { 'noinfo': '#dcdcdc' }, data, { 'noinfo': 'NO info' }, $scope.noDataTitle, false, false);
      }
      $scope.loaded = true;
    }

    $scope.getResults = function() {
      $scope.reportsLoading = true;
      if ($scope.selectedOption.id === 0 || $scope.selectedOption.id === 1) {
        automationReportsService.getResults($scope.idScheduledTask, $scope.selectedOption.id, $scope.selectedActionIds, 'daily')
          .then(function(response) {
            var data = response.data;
            setResult(data.model);
            $scope.reportsLoading = false;
            $scope.pageLoading = false;
          },
          function() {
            $scope.reportsLoading = false;
            $scope.pageLoading = false;
          });
      } else {
        automationReportsService.getResults($scope.idScheduledTask, $scope.selectedOption.id, $scope.selectedActionIds, 'monthly')
          .then(function(response) {
            var data = response.data;
            setResult(data.model);
            $scope.reportsLoading = false;
            $scope.pageLoading = false;
          }, function() {
            $scope.reportsLoading = false;
            $scope.pageLoading = false;
          });
      }
      automationReportsService.getResults($scope.idScheduledTask, $scope.selectedOption.id,
        $scope.selectedActionIds, 'engagement').then(function(response) {
        var data = response.data;
        setEngagementResult(data.model);
      });
    };

    $scope.getPushResults = function() {
      automationReportsService.getPushResults($scope.idScheduledTask)
        .then(function(response) {
          var undeliveredP = ((response.undelivered * 100) / response.total);
          var deliveredP = ((response.delivered * 100) / response.total);
          $scope.pushData = {
            'undelivered': response.undelivered,
            'delivered': response.delivered,
            'undeliveredPerc': $filter('number')(undeliveredP, 1),
            'deliveredPerc': $filter('number')(deliveredP, 1),
            'total': response.total
          };
          
          if (response.total) {
            $scope.donutInfoPush.data = [['delivered', response.delivered], ['notdelivered', response.undelivered], ['sent', response.total - response.delivered - response.undelivered]];
            $scope.donutGraphDataPush = $scope.getDonutChartConfig('#push', $scope.donutInfoPush.colors, $scope.donutInfoPush.data, $scope.donutInfoPush.names, $scope.donutTitle, true, true);
          } else {
            var data = [['noinfo', 100]];
            $scope.donutGraphDataPush = $scope.getDonutChartConfig('#push', { 'noinfo': '#dcdcdc' }, data, { 'noinfo': 'NO info' }, $scope.noDataTitle, false, false);
          }
        });
    };

    $scope.getSmsResults = function() {
      var smsIdsList = null;
      automationReportsService.getSmsResults($scope.idScheduledTask, $scope.selectedOption.id, smsIdsList)
        .then(function(response) {
          var undeliveredP = ((response.undelivered * 100) / response.total);
          var deliveredP = ((response.delivered * 100) / response.total);
          $scope.smsData = {
            'undelivered': response.undelivered,
            'delivered': response.delivered,
            'undeliveredPerc': $filter('number')(undeliveredP, 1),
            'deliveredPerc': $filter('number')(deliveredP, 1),
            'total': response.total,
            'hasSms': response.hasSms,
            'smsList': response.smsList,
            'smsByCountry': response.smsByCountry
          };
          if (response.smsList) {
            $scope.itemsSms = response.smsList.map(function(item) {
              return { 'idSms': item.IdSms, 'name': item.Name, 'selected': true };
            });
          }
          $scope.itemsSmsByCountry = response.smsByCountry;
          
          if (response.total) {
            $scope.donutInfoSms.data = [['delivered', response.delivered], ['notdelivered', response.undelivered], ['sent', response.total - response.delivered - response.undelivered]];
            $scope.donutGraphDataSms = $scope.getDonutChartConfig('#sms', $scope.donutInfoSms.colors, $scope.donutInfoSms.data, $scope.donutInfoSms.names, $scope.donutTitle, true, true);
          } else {
            var data = [['noinfo', 100]];
            $scope.donutGraphDataSms = $scope.getDonutChartConfig('#sms', { 'noinfo': '#dcdcdc' }, data, { 'noinfo': 'NO info' }, $scope.noDataTitle, false, false);
          }
        });
    };

    $scope.createReportandRedirect = function() {
      ModalService.showModal({
        templateUrl: 'angularjs/partials/shared/modalTwoOptionsWithInput.html',
        controller: 'modalExportSmsReportsCtrl',
        inputs: {
          data: {
            title: $translate.instant('ScheduledTask_Reports_Sms_reports_export_title'),
            description: $translate.instant('ScheduledTask_Reports_Sms_reports_export_subtitle'),
            buttonCancelLabel: $translate.instant('actions.cancel'),
            buttonPrimaryLabel: $translate.instant('ScheduledTask_Reports_Sms_reports_export_button'),
            buttonPrimaryClass: 'button--primary button--small',
            required: true,
            regex: utils.REGEX_EMAIL,
            option1Label: $translate.instant('xls_2003_option'),
            option2Label: $translate.instant('xlsx_2007_option'),
            option1Value: 'Office2003_XLS',
            option2Value: 'Office2007_XLSX',
            option: 'Office2007_XLSX',
            label: $translate.instant('ScheduledTask_Reports_Sms_reports_export_label'),
            scheduledTaskId: $scope.idScheduledTask,
            reportType: $scope.selectedOption.id,
            fieldValue: $scope.email
          }
        }
      });
    };

    
    $scope.toggleSmsFilter = function() {
      $scope.showSmsFilter = !$scope.showSmsFilter;
      $('#smsList').getNiceScroll().resize(); // eslint-disable-line
      $('#smsList').scrollTop(0); // eslint-disable-line
    };

    $scope.toggleActionFilter = function() {
      $scope.showActionFilter = !$scope.showActionFilter;
      $('#actionList').getNiceScroll().resize(); // eslint-disable-line
      $('#actionList').scrollTop(0); // eslint-disable-line
    };

    $scope.filterActions = function() {
      $scope.toggleActionFilter();
      $scope.selectedActionIds = [];
      angular.forEach($scope.actions, function(value) {
        if (value.selected) {
          $scope.selectedActionIds.push(value.idAutomationAction);
        }
      });
      $scope.getResults();
    };
    $scope.filterSms = function() {
      $scope.toggleSmsFilter();
      $scope.selectedSmsIds = [];
      angular.forEach($scope.itemsSms, function(value) {
        if (value.selected) {
          $scope.selectedSmsIds.push(value.idSms);
        }
      });
      $scope.getSmsResults();
    };


    $scope.clearActionFilters = function() {
      angular.forEach($scope.actions, function(value) {
        if (_.includes($scope.selectedActionIds, value.idAutomationAction)) {
          value.selected = true;
        } else {
          value.selected = false;
        }
      });
    };

    $scope.clearSmsFilters = function() {
      angular.forEach($scope.itemsSms, function(value) {
        if (_.includes($scope.selectedSmsIds)) {
          value.selected = true;
        } else {
          value.selected = false;
        }
      });
    };

    $scope.round = function(value) {
      return Math.round(value);
    };

  }
})();
