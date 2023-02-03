(function() {
  'use strict';

  angular
    .module('dopplerApp.automation')
    .service('automationReportsService', automationReportsService);

  automationReportsService.$inject = [
    '$http'
  ];

  function automationReportsService($http) {

    var service = {
      getResults: getResults,
      getSummaryResults: getSummaryResults,
      getSmsResults: getSmsResults,
      exportSmsReport: exportSmsReport,
      getPushResults: getPushResults,
      exportAutomationReport: exportAutomationReport
    };

    var resultsFrecuency = {
      'daily': 'GetResultsDaily',
      'monthly': 'GetResultsMonthly',
      'engagement': 'GetResultsEngagement'
    };

    return service;

    function getResults(id, reportType, actionIds, frecuency) {
      return $http.post('/Automation/ReportTask/' + resultsFrecuency[frecuency], {
        idScheduledTask: id,
        reportType: reportType,
        actionIds: actionIds
      });
    }

    function getSummaryResults(id, campaignId) {
      return $http.get('/Automation/ReportTask/GetSummaryResults', {
        params: {
          automationId: id,
          campaignId: campaignId
        }
      }).then(function(response){
        return response.data.data;
      });
    }
    function getSmsResults(id, reportType, smsIdList) {
      return $http.get('/Automation/ReportTask/GetSmsResult', {
        params: {
          idScheduledTask: id,
          reportType: reportType,
          smsIds: smsIdList
        }
      }).then(function(response) {
        return response.data.data;
      });
    }
    function exportSmsReport(taskId, reportType, email, excelType) {
      return $http.post('/Automation/ReportTask/ExportSmsReport', {
        idScheduledTask: taskId,
        reportType: reportType,
        email: email,
        requestExportType: excelType
      });
    }

    function exportAutomationReport(taskId, actionIds, reportType, email, optionTimePeriod) {
      var urlCsvReportCampaign = '/Automation/ReportTask/ExportAutomationReportByCampaign';
      var urlCsvReportSubscriber = '/Automation/ReportTask/ExportAutomationReportBySubscriber';
      var urlCsvReport = reportType === 'campaign' ? urlCsvReportCampaign : urlCsvReportSubscriber
      return $http.post(urlCsvReport, {
        idScheduledTask: taskId,
        actionIds: actionIds,
        reportType: optionTimePeriod,
        email: email
      });
    }
   
    function getPushResults(id, pushIds, reportType) {
      return $http.get('/Automation/ReportTask/GetPushNotificationResult', {
        params: {
          idScheduledTask: id,
          pushIds: pushIds,
          reportType: reportType
        }
      }).then(function(response) {
        return response.data.data;
      });
    }
  }

})();
