(function() {
  'use strict';

  angular
    .module('dopplerApp.automation')
    .service('taskService', taskService);

  taskService.$inject = [
    '$http'
  ];

  function taskService($http) {

    var service = {
      activateSiteBehavior: activateSiteBehavior,
      getTasks: getTasks,
      changeStatus: changeStatus,
      deleteTask: deleteTask,
      getAutomationTypeList: getAutomationTypeList,
      getReplicateTypeList: getReplicateTypeList,
      createReplica: createReplica,
      getAutomationTemplateList: getAutomationTemplateList,
      createAutomationFromTemplate: createAutomationFromTemplate,
    };

    return service;

    function getTasks(searchText, page, sort, sortDir, cantPerPage) {
      sort = (sort !== '') ? sort : 'CREATION_DATE';
      sortDir = (sortDir === 'ASC' || sortDir === '') ? 'DESC' : 'ASC';
      return $http.post('/Automation/Automation/GetAutomationTasks', {
        searchText: searchText,
        page: page,
        sort: sort,
        sortDir: sortDir,
        cantPerPage: cantPerPage
      });
    }

    function changeStatus(id, status) {
      return $http.post('/Automation/Automation/ChangeTaskStatus', {
        idScheduledTask: id,
        status: status
      });
    }

    function deleteTask(idTask) {
      return $http.delete('/Automation/Task/DeleteTask', {
        params: {
          idTask: idTask
        }
      });
    }

    function getAutomationTypeList(replicationTypeSource) {
      return $http
        .get('/Automation/Task/GetAutomationTypeList', {
          params: {
            replicationTypeSource: replicationTypeSource,
          }
        })
        .then(function(response){
          return response.data.automationTypeList;
        });
    }

    function getReplicateTypeList(replicationTypeSource) {
      return $http
        .get('/Automation/Task/GetReplicateTypeList', {
          params: {
            replicationTypeSource: replicationTypeSource,
          }
        })
        .then(function(response){
          return response.data.replicateTypeList;
        });
    }

    function getAutomationTemplateList() {
      return $http
        .get('/Automation/Task/GetAutomationTemplatesList')
        .then(function(response){
          const blankTemplate = {
            "IdAutomationTemplate": 0,
            "Type": "0",
            "Status": "active"
          }
          return [blankTemplate].concat(response.data.automationTemplateList);
        });
    }

    function createAutomationFromTemplate(idAutomationTemplate) {
      return $http
        .get('/Automation/Task/CreateAutomationFromTemplate', {
          params: {
            idAutomationTemplate: idAutomationTemplate,
          }
        })
        .then(function(response){
          return response.data;
        });
    }

    function activateSiteBehavior() {
      return $http.get('/Automation/Task/ActivateSiteTrackingTrial')
        .then(function(response){
          return response.data.success;
        });
    }

    function createReplica(idScheduledTask, typeToConvert) {
      return $http
        .post('/Automation/Task/CreateReplica', {
          idScheduledTask: idScheduledTask,
          typeToConvert: typeToConvert
        })
        .then(function (response) {
          return response.data;
        });
    }

  }

})();
