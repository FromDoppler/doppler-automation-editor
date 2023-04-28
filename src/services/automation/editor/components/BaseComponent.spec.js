'use strict';

describe('BaseComponent', function () {
  beforeEach(module('dopplerApp.automation.editor'));

  var BaseComponent;
  var COMPONENT_TYPE;

  beforeEach(inject(function (_BaseComponent_, _COMPONENT_TYPE_) {
    BaseComponent = _BaseComponent_;
    COMPONENT_TYPE = _COMPONENT_TYPE_;
  }));

  it('should be able to instantiate a new EMPTY base component', function () {
    // Act
    var emptyBaseComponent = new BaseComponent();

    // Assert

    expect(emptyBaseComponent).not.toBeUndefined();
    expect(emptyBaseComponent.type).toEqual(COMPONENT_TYPE.BASE);
    expect(emptyBaseComponent.touched).toEqual(false);
    expect(emptyBaseComponent.completed).toEqual(false);
  });

  it('should be able to instantiate a new base component', function () {
    // Arrange
    var baseComponentParams = {
      data: {
        parentUid: 3,
        completed: false,
        touched: true,
      },
    };

    // Act
    var baseComponent = new BaseComponent(baseComponentParams);

    // Assert
    expect(baseComponent).not.toBeUndefined();
    expect(baseComponent.type).toEqual(COMPONENT_TYPE.BASE);
    expect(baseComponent.completed).toBe(baseComponentParams.data.completed);
    expect(baseComponent.parentUid).toBe(baseComponentParams.data.parentUid);
    expect(baseComponent.touched).toBe(baseComponentParams.data.touched);
  });
});
