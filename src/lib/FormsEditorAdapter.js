'use strict';

/**
 * Main adapter interface.
 */
/*eslint-disable no-unused-vars*/
var FormsEditorAdapter = {
  /**
   * Constructor
   */
  constructor: function (http) {
    this.$http = http;
  },

  /**
   * Gets any type of user information requiered to be displayed in Editor UI.
   * TODO: Is this required? Editor UI bundle doesn't need to display user information.
   * User information should be handled by integration API/bundle since it's related to Form ID.
   * @returns {Promise} - User account information.
   */
  getAccountInformation: function () {},

  getSettings: function (params) {
    return this.$http.get('/Lists/Form/GetSettings', {
      params: params,
    });
  },

  /* Fields and Lists */
  /**
   * Gets form fields
   * @param {text} searchText - text to filter Fields
   * @returns {Promise}
   */
  getUserFields: function () {
    //searchText as param
    var searchText = '';
    return this.$http.get('/MSFormsEditor/Editor/GetUserFields');
  },
  saveCustomField: function (customField) {
    createCustomField(customField);
  },
  createCustomField: function (customField) {
    return this.$http.post('/Lists/MasterCustomFields/Add', customField);
  },
  updateCustomField: function (customField) {
    return this.$http.post('/Lists/MasterCustomFields/Update', customField);
  },
  deleteCustomField: function (id) {
    return this.$http.delete('/Lists/MasterCustomFields/Delete/' + id);
  },
  getCustomFieldById: function (id) {
    return this.$http.get('/Lists/MasterCustomFields/Field/' + id);
  },
  getAllFields: function () {
    return this.$http.get('/Lists/MasterCustomFields/Fields');
  },
  getCustomFields: function () {
    return this.$http.get('/Lists/MasterCustomFields/CustomFields');
  },
  getSubscriberListInfo: function (params) {
    return this.$http.get('/Lists/Form/GetSubscribersListInfo/', {
      params: params,
    });
  },

  /**
   * Gets available lists.
   * @returns {Promise}
   */
  getSubscriberLists: function (param) {
    return this.$http.get('/Lists/Form/GetSubscribersLists', {
      params: {
        idLabel: param.idLabel,
        searchText: param.searchQuery,
        page: param.page,
        cantPerPage: param.itemsPerPage, //,
        //sort: sort, TODO: enable when the sort is developed
        //sortdir: sortdir
      },
    });
  },

  /* Form methods*/
  /**
   * Gets form data as JSON object as part of a promise.
   * @param {Number} id - Form ID.
   * @returns {Promise}
   */
  getForm: function (id) {
    return this.$http.get('/Lists/Form/GetFormModel?idForm=' + id);
  },

  /**
   * Saves/Updates the form.
   * If form object contains the Form ID, this function works for updating
   * an already existent form. If form object doesn't contain the Form ID,
   * this function works for saving a form.
   * @param {Object} form - Form entity described as a JSON Object.
   * @returns {Promise} - HTTP response information.
   */
  saveForm: function (form) {
    return this.$http.post('/Lists/Form/SaveFormModel', form);
  },
  publishForm: function (form) {
    return this.$http.post('/Lists/Form/PublishFormModel', form);
  },

  /* Image methods */

  /**
   * Gets images using pagination.
   * @param {Boolean} isAscending
   * @param {Number} offset
   * @param {Number} position
   * @param {String} sortingCriteria
   * @returns {Promise} - Images matching the searching criteria.
   */
  getImages: function (params) {
    return this.$http.get('/Campaigns/Editor/GetImageGallery', params);
  },

  /**
   * Saves an image uploaded by user.
   * @param {String} name - Image name.
   * @param {Object} data - Image data.
   * @returns {Promise} - HTTP response information.
   */
  uploadImage: function () {
    return '/Campaigns/Editor/UploadImage';
  },

  /**
   * Deletes an image uploaded by the user.
   * @param {text} fileName - Image ID
   * @returns {Promise} - HTTP response information.
   */
  removeImages: function (images) {
    return this.$http.post('/Campaigns/Editor/RemoveImage', images);
  },

  /**
   * Get the list of  labels for subscribers lists
   * @returns {Promise} - HTTP response information.
   */
  getUserLabels: function () {
    return this.$http.get('/Lists/Form/GetAllUserLabels');
  },

  pollRequestUrl: function (pollRequest) {
    poll(pollRequest);
  },
  getFormPublishedPreviewUrl: function (params) {
    return this.$http.get('/Lists/Form/GetPublishedFormUrl', params);
  },
  getFormDraftPreviewUrl: function (params) {
    return this.$http.get('/Lists/Form/GetDraftFormUrl', params);
  },

  getFormName: function (params) {
    return this.$http.get('/Lists/Form/GetFormName', params);
  },
  isValidDomain: function (params) {
    return this.$http.get(
      '/Automation/Automation/ValidatePrivateDomain?domain=' + params.domain
    );
  },
  sendEmail: function (params) {
    return this.$http.get(
      '/Automation/Automation/SendPrivateDomainEmail?email=' + params.email
    );
  },
  isValidCode: function (params) {
    return this.$http.get(
      '/Automation/Automation/IsValidCode?code=' +
        params.code +
        '&email=' +
        params.email
    );
  },
  getDopplerFilesAuthToken: function () {
    return this.$http.get('/DopplerFiles/GetAuthorizationToken');
  },
};
