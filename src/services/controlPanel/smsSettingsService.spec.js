'use strict';

describe('SmsSettingsService', function () {
  beforeEach(module('dopplerApp'));

  var smsSettingsService;

  beforeEach(inject(function (_smsSettingsService_) {
    smsSettingsService = _smsSettingsService_;
  }));

  it('should map form data correctly into model for CREDIT CARD payment', function () {
    // Arrange
    var mockedData = {
      billingInformation: {
        ccNumber: '4226457083932337',
        ccExpMonth: 12,
        ccExpYear: 2020,
        holderFullName: 'Elizabeth Carter',
        idCCType: 1,
        ccVerification: '456',
      },
      fee: 100,
      paymentMethod: 1, //CREDIT CARD
    };

    // Act
    var model = smsSettingsService.mapBillingInformationModel(
      mockedData.billingInformation,
      mockedData.fee,
      mockedData.paymentMethod
    );

    // Assert
    expect(model.IdPaymentMethod).toBe(1);
    expect(model.Fee).toBe(100);
    expect(model.CCNumber).toBe('4226457083932337');
    expect(model.CCExpMonth).toBe(12);
    expect(model.CCExpYear).toBe(2020);
    expect(model.CCHolderFullName).toBe('Elizabeth Carter');
    expect(model.IdCCType).toBe(1);
    expect(model.CCVerification).toBe('456');
  });

  it('should map form data correctly into model for TRANSFER payment for MX', function () {
    // Arrange
    var mockedData = {
      billingInformation: {
        idConsumerType: 4,
        companyName: 'Company',
        cuit: '24374492728',
        CFDIUse: 'G03',
        paymentType: 'PPD',
        paymentWay: 'TRANSFER',
        bankName: 'Bank',
        lastNumbers: '4444',
      },
      fee: 100,
      paymentMethod: 3, //TRANSFER
    };

    // Act
    var model = smsSettingsService.mapBillingInformationModel(
      mockedData.billingInformation,
      mockedData.fee,
      mockedData.paymentMethod
    );

    // Assert
    expect(model.IdPaymentMethod).toBe(3);
    expect(model.Fee).toBe(100);
    expect(model.IdConsumerType).toBe(4);
    expect(model.RazonSocial).toBe('Company');
    expect(model.Cuit).toBe('24374492728');
    expect(model.CFDIUse).toBe('G03');
    expect(model.PaymentWay).toBe('TRANSFER');
    expect(model.PaymentType).toBe('PPD');
    expect(model.BankName).toBe('Bank');
    expect(model.BankAccount).toBe('4444');
  });

  it('should map form data correctly into model for TRANSFER payment for ARG', function () {
    // Arrange
    var mockedData = {
      billingInformation: {
        idConsumerType: 2,
        companyName: 'Company',
        cuit: '24374492728',
      },
      fee: 100,
      paymentMethod: 3, //TRANSFER
    };

    // Act
    var model = smsSettingsService.mapBillingInformationModel(
      mockedData.billingInformation,
      mockedData.fee,
      mockedData.paymentMethod
    );

    // Assert
    expect(model.IdPaymentMethod).toBe(3);
    expect(model.Fee).toBe(100);
    expect(model.IdConsumerType).toBe(2);
    expect(model.RazonSocial).toBe('Company');
    expect(model.Cuit).toBe('24374492728');
  });
});
