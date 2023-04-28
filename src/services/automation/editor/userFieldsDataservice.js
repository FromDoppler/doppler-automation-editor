(function () {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .service('userFieldsDataservice', userFieldsDataservice);

  userFieldsDataservice.$inject = ['$http'];

  function userFieldsDataservice($http) {
    var userFields = [];
    var service = {
      findField: findField,
      getAllFields: getAllFields,
      getCustomFields: getCustomFields,
      isFieldDeleted: isFieldDeleted,
      getDeletedField: getDeletedField,
      getFieldsByType: getFieldsByType,
      getDeletedFieldsByType: getDeletedFieldsByType,
      getPhoneCustoms: getPhoneCustoms,
      load: load,
      sendSmsTest: sendSmsTest,
    };

    return service;

    function load(fields) {
      userFields = _.map(fields, function (field) {
        return {
          id: field.IdField,
          type: field.DataType,
          name: field.IsBasicField ? field.SampleValue : field.Name,
          embed: field.Embed,
          isBasic: field.IsBasicField,
          label: field.Name,
        };
      });
      userFields = _.sortBy(userFields, 'id');
    }

    function findField(idField) {
      return _.find(userFields, function (field) {
        return field.id === idField;
      });
    }

    function getAllFields() {
      return userFields;
    }

    function getCustomFields() {
      return _.filter(userFields, function (field) {
        return !field.isBasic;
      });
    }

    function getFieldsByType(type) {
      return _.filter(userFields, function (field) {
        return field.type === type;
      });
    }

    function isFieldDeleted(fieldInUse, fieldsToCompare) {
      return fieldInUse && getDeletedField(fieldInUse, fieldsToCompare) < 0;
    }

    function getDeletedField(fieldInUse, fieldsToCompare) {
      var fieldsArray = fieldsToCompare || userFields;
      return (
        fieldInUse &&
        _.findIndex(fieldsArray, function (dateField) {
          return dateField.id === fieldInUse.id;
        })
      );
    }

    function getDeletedFieldsByType(fieldsInUse, type) {
      var fieldsToCompare = getFieldsByType(type);
      var deletedFields = [];

      if (fieldsToCompare.length) {
        _.each(fieldsInUse, function (fieldInUse, index) {
          var fieldIndex = getDeletedField(fieldInUse, fieldsToCompare);
          if (fieldIndex === -1) {
            deletedFields.push({
              instance: fieldInUse,
              index: index,
            });
          }
        });
      }

      return deletedFields;
    }

    function getPhoneCustoms() {
      return $http
        .get('/Automation/Automation/GetPhoneCustoms')
        .then(function (response) {
          return _.map(response.data.phonesFields, function (field) {
            return {
              id: field.idField,
              type: field.type,
              name: field.name,
            };
          });
        });
    }

    function sendSmsTest(data) {
      return $http.post('/Automation/Automation/TestSms', data);
    }
  }
})();
