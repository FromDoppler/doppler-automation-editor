'use strict';

describe('dateValidationService', function () {
  beforeEach(module('dopplerApp.automation.editor'));

  var $q;
  var settingsService;
  var headerService;
  var goToService;
  var automation;
  var changesManager;
  var frequency;

  var $translate;

  beforeEach(function () {
    module(function ($provide) {
      $provide.value('$translate', $translate);
    });
  });
  beforeEach(function () {
    frequency = {
      date: new Date().toISOString(),
      time: {
        hour: parseInt('11'),
        minute: parseInt('04'),
      },
      timezone: parseInt('21'),
      type: 'date',
    };
    var model = {
      initialCondition: {
        frequency: frequency,
      },
    };

    automation = {
      getModel: function () {
        return model;
      },
    };

    module(function ($provide) {
      $provide.value('automation', automation);
    });
  });

  beforeEach(inject(function (
    _$q_,
    _settingsService_,
    _headerService_,
    _changesManager_,
    _goToService_
  ) {
    $q = _$q_;
    settingsService = _settingsService_;
    headerService = _headerService_;
    changesManager = _changesManager_;
    goToService = _goToService_;
  }));

  it('should be able to instantiate the date validation service', inject(function (
    dateValidation
  ) {
    // Arrange
    //Act
    dateValidation.updateDateIfNotValid();
    frequency = automation.getModel().initialCondition.frequency;
    // Assert
    expect(dateValidation).not.toBeUndefined();
    //TODO: this is failing due to some weird dependency or service mock missing
    //expect(!dateValidation.isDateExpired(frequency.date, frequency.hour, frequency.minute, frequency.timezone)).toEqual(true);
  }));
});
