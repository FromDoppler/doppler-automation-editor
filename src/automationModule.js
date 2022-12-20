var Constants = {
  TaskTypes: {
    ListSubscription: 1,
    CampaignActivity: 2,
    ScheduledTask: 3,
    RSSActivity: 4
  },
  NameAttributePattern: /^[^+*_¿?^¡!@#$€%=\\ºª|<>]*$/,
  CompanyNamePattern: /^[^+*¿?^¡!@#$€%=\\ºª|<>]*$/,
  AddressPattern: /^[^+*_¿?^¡!@$€%=\\ºª|<>]*$/,
  PhoneNumberPattern: /^(?=.*\d)[\d ]+$/
};
//TODO: point all directives, services and controllers that belong to automation only to this module directly to avoid dependency issues. When refactor is finished.
angular.module('dopplerApp.automation', ['underscore', 'angular-momentjs', 'dp-dropzone', 'onImageErrorSrc', 'dopplerApp.automation.editor'])
.constant('Constants', Constants);
