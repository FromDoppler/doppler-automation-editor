'use strict';

describe('CampaignComponent', function () {
  beforeEach(module('dopplerApp.automation.editor'));

  var CampaignComponent;
  var COMPONENT_TYPE;
  var TEST_OPTION;

  beforeEach(inject(function (
    _CampaignComponent_,
    _COMPONENT_TYPE_,
    _TEST_OPTION_
  ) {
    CampaignComponent = _CampaignComponent_;
    COMPONENT_TYPE = _COMPONENT_TYPE_;
    TEST_OPTION = _TEST_OPTION_;
  }));

  it('should be able to instantiate a new EMPTY Campaign component', function () {
    // Act
    var emptyCampaignComponent = new CampaignComponent();

    // Assert
    expect(emptyCampaignComponent).not.toBeUndefined();
    expect(emptyCampaignComponent.type).toEqual(COMPONENT_TYPE.CAMPAIGN);
    expect(emptyCampaignComponent.name).toEqual('');
    expect(emptyCampaignComponent.id).toEqual(0);
    expect(emptyCampaignComponent.subject).toEqual('');
    expect(emptyCampaignComponent.preheader).toEqual('');
    expect(emptyCampaignComponent.fromName).toEqual('');

    expect(emptyCampaignComponent.fromEmail).toEqual('');
    expect(emptyCampaignComponent.replyEmail).toEqual('');
    expect(emptyCampaignComponent.socialShares).toEqual([]);
    expect(emptyCampaignComponent.thumbnailUrl).toEqual('');
    expect(emptyCampaignComponent.contentType).toEqual('');
    expect(emptyCampaignComponent.DMARCAcceptedDomain).toEqual('');
    expect(emptyCampaignComponent.hasUnsavedChanges).toEqual(true);
    expect(emptyCampaignComponent.viewOnlineLink).toEqual('');
    expect(emptyCampaignComponent.emailOption).toEqual(TEST_OPTION.LIST);
    expect(emptyCampaignComponent.idList).toEqual(0);
    expect(emptyCampaignComponent.emailList).toEqual('');

    expect(emptyCampaignComponent.completed).toEqual(false);
  });

  it('should be able to instantiate a new Campaign component with data', function () {
    // Arrange
    var campaignComponentParams = {
      name: 'Complete campaign',
      id: 12002,
      subject: 'New subject',
      fromName: 'Juana',
      fromEmail: 'juana@doppler.com',
      thumbnailUrl: 'http://dopplerfiles/Users/50003/Campaigns/12002/12002.png',
      completed: true,
      replyEmail: 'reply@doppler.com',
      socialShares: [
        {
          idSocialNetwork: 4,
          name: 'facebook',
          selected: true,
        },
      ],
      contentType: 'template',
      DMARCAcceptedDomain: 'gmail',
      hasUnsavedChanges: true,
      viewOnlineLink:
        '"http://actionsDomain.com/OnlineView/PublicOnlineView?idCampaign=1002271"',
      emailOption: TEST_OPTION.EMAIL,
      idList: 1255,
      emailList: 'test@doppler.com',
    };

    // Act
    var campaignComponent = new CampaignComponent(campaignComponentParams);
    // Assert
    expect(campaignComponent).not.toBeUndefined();
    expect(campaignComponent.type).toEqual(COMPONENT_TYPE.CAMPAIGN);
    expect(campaignComponent.completed).toBe(true);
    expect(campaignComponent.name).toBe(campaignComponentParams.name);
    expect(campaignComponent.subject).toBe(campaignComponentParams.subject);
    expect(campaignComponent.fromName).toBe(campaignComponentParams.fromName);
    expect(campaignComponent.fromEmail).toBe(campaignComponentParams.fromEmail);
    expect(campaignComponent.thumbnailUrl).toBe(
      campaignComponentParams.thumbnailUrl
    );
    expect(campaignComponent.replyEmail).toBe(
      campaignComponentParams.replyEmail
    );
    expect(campaignComponent.socialShares.name).toBe(
      campaignComponentParams.socialShares.name
    );
    expect(campaignComponent.contentType).toBe(
      campaignComponentParams.contentType
    );
    expect(campaignComponent.DMARCAcceptedDomain).toBe(
      campaignComponentParams.DMARCAcceptedDomain
    );
    //expect(campaignComponent.hasUnsavedChanges).toBe(campaignComponentParams.hasUnsavedChanges);
    // TODO: uncomment this line when test is fixed.
    expect(campaignComponent.viewOnlineLink).toBe(
      campaignComponentParams.viewOnlineLink
    );
    expect(campaignComponent.emailOption).toBe(
      campaignComponentParams.emailOption
    );
    expect(campaignComponent.idList).toBe(campaignComponentParams.idList);
    expect(campaignComponent.emailList).toBe(campaignComponentParams.emailList);
  });
});
