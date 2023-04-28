'use strict';

describe('Utils', function () {
  beforeEach(module('dopplerApp.automation.editor'));

  var utils;

  beforeEach(inject(function (_utils_) {
    utils = _utils_;
  }));

  // Tests for CUIT

  it('should validate valid type 20 cuit', function () {
    // Assert
    expect(utils.validateCuit('20348514149')).toBe(true);
  });

  it('should validate valid type 23 cuit', function () {
    // Assert
    expect(utils.validateCuit('23361491939')).toBe(true);
  });

  it('should validate valid type 24 cuit', function () {
    // Assert
    expect(utils.validateCuit('24374492728')).toBe(true);
  });

  it('should validate valid type 27 cuit', function () {
    // Assert
    expect(utils.validateCuit('27348514143')).toBe(true);
  });

  it('should validate valid type 30 cuit', function () {
    // Assert
    expect(utils.validateCuit('30478569544')).toBe(true);
  });

  it('should validate valid type 33 cuit', function () {
    // Assert
    expect(utils.validateCuit('33123123129')).toBe(true);
  });

  it('should validate valid type 34 cuit', function () {
    // Assert
    expect(utils.validateCuit('34500045339')).toBe(true);
  });

  it('should validate invalid cuit number', function () {
    // Assert
    expect(utils.validateCuit('12345678912')).toBe(false);
  });

  it('should validate invalid cuit with less than 11 digits', function () {
    // Assert
    expect(utils.validateCuit('1')).toBe(false);
    expect(utils.validateCuit('3450004533')).toBe(false);
  });

  it('should validate invalid cuit with more than 11 digits', function () {
    // Assert
    expect(utils.validateCuit('345000453355')).toBe(false);
    expect(utils.validateCuit('34500045335555555')).toBe(false);
  });

  it('should validate invalid type 20 cuit', function () {
    // Assert
    expect(utils.validateCuit('20348514142')).toBe(false);
  });

  it('should validate invalid type 23 cuit', function () {
    // Assert
    expect(utils.validateCuit('23361491933')).toBe(false);
  });

  it('should validate invalid type 24 cuit', function () {
    // Assert
    expect(utils.validateCuit('24374492724')).toBe(false);
  });

  it('should validate invalid type 27 cuit', function () {
    // Assert
    expect(utils.validateCuit('27348514141')).toBe(false);
  });

  it('should validate invalid type 30 cuit', function () {
    // Assert
    expect(utils.validateCuit('30478569549')).toBe(false);
  });

  it('should validate invalid type 33 cuit', function () {
    // Assert
    expect(utils.validateCuit('33123123121')).toBe(false);
  });

  it('should validate invalid type 34 cuit', function () {
    // Assert
    expect(utils.validateCuit('34500045333')).toBe(false);
  });

  // tests for NIT

  it('should not allow nit less than 10 characters', function () {
    // Assert
    expect(utils.validateNit('345000')).toBe(false);
  });

  it('should validate invalid nit empty', function () {
    // Assert
    expect(utils.validateNit('')).toBe(false);
  });

  it('should validate nit for 10 characters for companies', function () {
    // Assert
    expect(utils.validateNit('8903127496')).toBe(true);
    expect(utils.validateNit('8001972684')).toBe(true);
    expect(utils.validateNit('9014586527')).toBe(true);
  });

  it('should validate nit less than 10 characters, for a person not a company', function () {
    // Assert
    expect(utils.validateNit('60136269')).toBe(true);
    expect(utils.validateNit('945090625')).toBe(true);
    expect(utils.validateNit('1586664')).toBe(true);
  });

  it('should validate invalid nit for 10 characters', function () {
    // Assert
    expect(utils.validateNit('8903127492')).toBe(false);
  });

  it('should allow nit with more than 10 characters', function () {
    // Assert
    expect(utils.validateNit('8903127496255155')).toBe(false);
  });

  // Tests for RFC

  it('should validate valid RFC', function () {
    // Assert
    expect(utils.validateRfc('GADL230310IN1')).toBe('GADL230310IN1');
    expect(utils.validateRfc('XAXX010101000')).toBe('XAXX010101000');
    expect(utils.validateRfc('BAGS97011419A')).toBe('BAGS97011419A');
    expect(utils.validateRfc('GEC8501014I5')).toBe('GEC8501014I5');
    expect(utils.validateRfc('SAVR481207PL1')).toBe('SAVR481207PL1');
    expect(utils.validateRfc('GOCK9705266J3')).toBe('GOCK9705266J3');
    expect(utils.validateRfc('MDD140815M60')).toBe('MDD140815M60');
    expect(utils.validateRfc('DIS9009266I5')).toBe('DIS9009266I5');
    expect(utils.validateRfc('SNM120802EN3')).toBe('SNM120802EN3');
    expect(utils.validateRfc('GPO920120440')).toBe('GPO920120440');
    expect(utils.validateRfc('TLE1304155W0')).toBe('TLE1304155W0');
    expect(utils.validateRfc('EME100521PK8')).toBe('EME100521PK8');
  });

  it('should validate valid RFC with spaces', function () {
    // Assert
    expect(utils.validateRfc('GADL 230310 IN1')).toBe('GADL230310IN1');
    expect(utils.validateRfc('XAXX 010101 000')).toBe('XAXX010101000');
    expect(utils.validateRfc('BAGS 970114 19A')).toBe('BAGS97011419A');
    expect(utils.validateRfc('GEC 850101 4I5')).toBe('GEC8501014I5');
    expect(utils.validateRfc('SAVR 481207 PL1')).toBe('SAVR481207PL1');
    expect(utils.validateRfc('GOCK 970526 6J3')).toBe('GOCK9705266J3');
    expect(utils.validateRfc('MDD 140815 M60')).toBe('MDD140815M60');
    expect(utils.validateRfc('DIS 900926 6I5')).toBe('DIS9009266I5');
    expect(utils.validateRfc('SNM 120802 EN3')).toBe('SNM120802EN3');
    expect(utils.validateRfc('GPO 920120 440')).toBe('GPO920120440');
    expect(utils.validateRfc('TLE 130415 5W0')).toBe('TLE1304155W0');
    expect(utils.validateRfc('EME 100521 PK8')).toBe('EME100521PK8');
  });

  it('should validate valid RFC with dash', function () {
    // Assert
    expect(utils.validateRfc('GADL-230310-IN1')).toBe('GADL230310IN1');
    expect(utils.validateRfc('XAXX-010101-000')).toBe('XAXX010101000');
    expect(utils.validateRfc('BAGS-970114-19A')).toBe('BAGS97011419A');
    expect(utils.validateRfc('SAVR-481207-PL1')).toBe('SAVR481207PL1');
    expect(utils.validateRfc('GOCK-970526-6J3')).toBe('GOCK9705266J3');
    expect(utils.validateRfc('MDD-140815-M60')).toBe('MDD140815M60');
    expect(utils.validateRfc('DIS-900926-6I5')).toBe('DIS9009266I5');
    expect(utils.validateRfc('SNM-120802-EN3')).toBe('SNM120802EN3');
    expect(utils.validateRfc('GPO-920120-440')).toBe('GPO920120440');
    expect(utils.validateRfc('TLE-130415-5W0')).toBe('TLE1304155W0');
    expect(utils.validateRfc('EME-100521-PK8')).toBe('EME100521PK8');
  });

  it('should fail for invalid RFC verification digit', function () {
    // Assert
    expect(utils.validateRfc('LOMP8206281HO')).toBe(false);
    expect(utils.validateRfc('MELM8305281HO')).toBe(false);
    expect(utils.validateRfc('SAVL852312AH1')).toBe(false);
    expect(utils.validateRfc('GOCK9705266J6')).toBe(false);
    expect(utils.validateRfc('MDD140815Z60')).toBe(false);
    expect(utils.validateRfc('IYS9009266I6')).toBe(false);
    expect(utils.validateRfc('SEM120802EN4')).toBe(false);
    expect(utils.validateRfc('GPO920123340')).toBe(false);
    expect(utils.validateRfc('TLE1304155X0')).toBe(false);
    expect(utils.validateRfc('EZE100521PK9')).toBe(false);
  });

  it('should fail for invalid RFC length', function () {
    // Assert
    expect(utils.validateRfc('LOMP82281HO')).toBe(false);
    expect(utils.validateRfc('MELM5281HO')).toBe(false);
    expect(utils.validateRfc('SAV212AH1')).toBe(false);
    expect(utils.validateRfc('GOCK9766J6')).toBe(false);
    expect(utils.validateRfc('MDD140815Z6023')).toBe(false);
    expect(utils.validateRfc('IYSFR9009266I6')).toBe(false);
    expect(utils.validateRfc('SEM120802EN4')).toBe(false);
    expect(utils.validateRfc('123')).toBe(false);
    expect(utils.validateRfc('EZE100521PK96G')).toBe(false);
  });

  it('should return true for empty RFC length to avoid problems with forms validations', function () {
    expect(utils.validateRfc('')).toBe(true);
  });

  it('it should return RFC without spaces and dashes', function () {
    expect(utils.formatValidRfc('GADL-230310-IN1')).toBe('GADL230310IN1');
    expect(utils.formatValidRfc('GPO 920120 440')).toBe('GPO920120440');
    expect(utils.formatValidRfc('TLE 130415 5W0')).toBe('TLE1304155W0');
    expect(utils.formatValidRfc('EME 100521 PK8')).toBe('EME100521PK8');
    expect(utils.formatValidRfc('GPO-920120 440')).toBe('GPO920120440');
    expect(utils.formatValidRfc('TLE 130415-5W0')).toBe('TLE1304155W0');
    expect(utils.formatValidRfc('EME100521 PK8')).toBe('EME100521PK8');
  });

  // Tests for CREDIT CARD

  it('should validate CCNumber correctly for VISA', function () {
    // Assert
    expect(utils.REGEX_CC_VISA.test('4226457083932337')).toBe(true);
    expect(utils.REGEX_CC_VISA.test('4504565468308270')).toBe(true);
    expect(utils.REGEX_CC_VISA.test('4918688718248573')).toBe(true);
    expect(utils.REGEX_CC_VISA.test('4955436591788412')).toBe(true);
    expect(utils.REGEX_CC_VISA.test('4374289438593062')).toBe(true);
    expect(utils.REGEX_CC_VISA.test('4181015422737776')).toBe(true);
  });

  it('should validate CCNumber incorrectly for VISA', function () {
    // Assert
    expect(utils.REGEX_CC_VISA.test('422645708393233')).toBe(false);
    expect(utils.REGEX_CC_VISA.test('3504565468308270')).toBe(false);
    expect(utils.REGEX_CC_VISA.test('6918688718248573')).toBe(false);
    expect(utils.REGEX_CC_VISA.test('8955436591788412')).toBe(false);
    expect(utils.REGEX_CC_VISA.test('9374289438593062')).toBe(false);
    expect(utils.REGEX_CC_VISA.test('1181015422737776')).toBe(false);
  });

  it('should validate CCNumber correctly for MASTER', function () {
    // Assert
    expect(utils.REGEX_CC_MASTER.test('5168441223630339')).toBe(true);
    expect(utils.REGEX_CC_MASTER.test('5562255958522608')).toBe(true);
    expect(utils.REGEX_CC_MASTER.test('5273744899961876')).toBe(true);
    expect(utils.REGEX_CC_MASTER.test('5164054395431016')).toBe(true);
    expect(utils.REGEX_CC_MASTER.test('5461905301639283')).toBe(true);
    expect(utils.REGEX_CC_MASTER.test('5182383248332032')).toBe(true);
  });

  it('should validate CCNumber incorrectly for MASTER', function () {
    // Assert
    expect(utils.REGEX_CC_MASTER.test('4226457083932337')).toBe(false);
    expect(utils.REGEX_CC_MASTER.test('4504565468308270')).toBe(false);
    expect(utils.REGEX_CC_MASTER.test('4918688718248573')).toBe(false);
    expect(utils.REGEX_CC_MASTER.test('4955436591788412')).toBe(false);
    expect(utils.REGEX_CC_MASTER.test('4374289438593062')).toBe(false);
    expect(utils.REGEX_CC_MASTER.test('4181015422737776')).toBe(false);
  });

  it('should validate CCNumber correctly for AMEX', function () {
    // Assert
    expect(utils.REGEX_CC_AMERICAN.test('371642190784801')).toBe(true);
    expect(utils.REGEX_CC_AMERICAN.test('374282372440307')).toBe(true);
    expect(utils.REGEX_CC_AMERICAN.test('343391601795411')).toBe(true);
    expect(utils.REGEX_CC_AMERICAN.test('341855006101120')).toBe(true);
    expect(utils.REGEX_CC_AMERICAN.test('349060582602664')).toBe(true);
    expect(utils.REGEX_CC_AMERICAN.test('371257236991813')).toBe(true);
  });

  it('should validate CCNumber incorrectly for AMEX', function () {
    // Assert
    expect(utils.REGEX_CC_AMERICAN.test('4226457083932337')).toBe(false);
    expect(utils.REGEX_CC_AMERICAN.test('5273744899961876')).toBe(false);
    expect(utils.REGEX_CC_AMERICAN.test('4918688718248573')).toBe(false);
    expect(utils.REGEX_CC_AMERICAN.test('4955436591788412')).toBe(false);
    expect(utils.REGEX_CC_AMERICAN.test('5461905301639283')).toBe(false);
    expect(utils.REGEX_CC_AMERICAN.test('4181015422737776')).toBe(false);
  });

  it('should not break with invalid RFC', function () {
    // Assert
    expect(utils.formatValidRfc('12346789')).toBe(null);
    expect(utils.formatValidRfc('')).toBe(null);
    expect(utils.formatValidRfc(null)).toBe(null);
    expect(utils.formatValidRfc(undefined)).toBe(null);
    expect(utils.formatValidRfc('ADL-230310-IN1')).toBe('ADL230310IN1');
  });

  it('should valid Expiration Date', function () {
    var customToday = new Date(2020, 5, 2); //2020-06-02
    // Assert
    expect(utils.isValidExpDate(customToday, 7, 2019)).toBe(false);
    expect(utils.isValidExpDate(customToday, 4, 2020)).toBe(false);
    expect(utils.isValidExpDate(customToday, 5, 2020)).toBe(false);
    expect(utils.isValidExpDate(customToday, 6, 2020)).toBe(true);
    expect(utils.isValidExpDate(customToday, 7, 2020)).toBe(true);
    expect(utils.isValidExpDate(customToday, 1, 2021)).toBe(true);
  });
});
