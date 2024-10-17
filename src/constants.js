var Enums = {
  UserTypeEnum: {
    FREE : 1,
    MONTHLY : 2,
    INDIVIDUAL : 3,
    SUBSCRIBERS : 4,
    CMUSERS : 5,
    CMMONTHLY : 6,
    DEMO : 7
  },
  DkimState: {
    ENABLED: 2,
    DISABLED: 1,
    NO_USER_CONF: 3,
    ADMIN_VALIDATION: 4
  },
  domainVerificationStatus: {
    CONFIGURATIONERROR : 1,
    VERIFIED : 2,
    NOTCONFIGURED : 3,
    PENDING : 4
  },
  domainStatus: {
    DISABLED : 1,
    ENABLED : 2,
    PENDING : 3,
    VALIDATING : 4
  },

};

var Regex = {
  CUSTOMDOMAIN: /(?=^.{1,254}$)(^(?:(?!\d+\.)[a-zA-Z0-9_\-ñÑ]{1,63}\.?)+(?:[a-zA-Z]{2,})$)/i,
  DOMAIN: /^((?!www\.)(([a-zA-Z0-9\-_ñÑ]+\.)+)([a-zA-Z]{2,16}))$/i, // eslint-disable-line
  DOMAIN_HTTP: /^((http(s)?(:\/\/))?(www\.)?(([a-zA-Z0-9\-_ñÑ]+\.)+)([a-zA-Z]{2,16}))$/i, // eslint-disable-line
  URL_WITH_SUBFOLDERS: /^((http(s)?(:\/\/))?(www\.)?(([a-zA-Z0-9\-_]+\.)+)([a-zA-Z]{2,16})(\/+(([a-zA-Z0-9\-_])+))*(\/\*?)?)$/i, // eslint-disable-line
  REGEX_SMS_STRING: "@£$¥èéùìòÇ`Øø`ÅåΔ_ΦΓΛΩΠΨΣΘΞ`ÆæßÉ !\"#¤%&'()*=,-./0123456789:;<=>?¡ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÑÜ`¿abcdefghijklmnopqrstuvwxyzäöñüà", // eslint-disable-line
  REGEX_SMS_GSM_EXTENDED_STRING: "````````````````````^```````````````````{}`````\\````````````[~]`|````````````````````````````````````€``````````````````````````", // eslint-disable-line
  URL_WITH_SUBFOLDERS_HTTPS_ONLY: /^(https:\/\/(www\.)?(([a-zA-Z0-9\-_]+\.)+)([a-zA-Z]{2,23})(\/+(([a-zA-Z0-9\-_.?=&#])+))*(\/\*?)?)$/i, // eslint-disable-line
  STRICT_START_HTTPS: /^(https:\/\/)(\S+)?$/i,
}

var AutomationType = {
  NONE: 'none',
  CAMPAIGN_BEHAVIOR: 'campaign_behavior',
  RSS_TO_EMAIL: 'rss_to_email',
  SCHEDULED_DATE: 'scheduled_date',
  SITE_BEHAVIOR: 'site_behavior',
  SUBSCRIPTION_LIST: 'subscription_list',
  ABANDONED_CART: 'abandoned_cart',
  VISITED_PRODUCTS: 'visited_products',
  PENDING_ORDER: 'pending_order',
  CONFIRMATION_ORDER: 'confirmation_order',
  PUSH_NOTIFICATION: 'push_notification',
  SMS: 'sms',
  WHATSAPP: 'whatsapp',
};

var AutomationTypeIds = {
  ABANDONED_CART: 7,
  VISITED_PRODUCTS: 8,
  PENDING_ORDER: 9,
  CONFIRMATION_ORDER: 10,
  PUSH_NOTIFICATION: 11,
};

var BasicFields = [
  'BIRTHDAY',
  'COUNTRY',
  'EMAIL',
  'FIRST_NAME',
  'GENDER',
  'LAST_NAME',
  'CONSENT',
  'ORIGIN',
  'SCORE'
];

var ChangeType = {
  ADD_COMPONENT: 'add_component',
  ADD_CONDITION_AND_TRANSFER: 'add_condition_and_transfer',
  ADD_CONDITIONAL: 'add_conditional',
  AUTOMATION_NAME: 'automation_name',
  CONDITIONAL_PROPERTY: 'conditional_property',
  DELETE_COMPONENT: 'delete_component',
  DELETE_CONDITION_AND_TRANSFER: 'delete_condition_and_transfer',
  DELETE_CONDITIONAL: 'delete_conditional',
  IMPORT_HTML: 'import_html',
  PROPERTY: 'property',
  TINY_HTML: 'tiny_html'
};

var ComponentType = {
  ACTION: 'action',
  AUTOMATION: 'automation',
  BASE: 'base',
  CAMPAIGN: 'campaign',
  CONDITION: 'condition',
  DELAY: 'delay',
  INITIAL_CONDITION: 'initial_condition',
  SMS: 'sms',
  DYNAMIC_CONTENT: 'dynamic_content',
  PUSH_NOTIFICATION: 'push_notification',
  GOTO_STEP: 'goto',
  WHATSAPP: 'whatsapp',
};

var WhatsappWarningType = {
  CREDIT: 'credit',
  ROOM: 'room',
}

var CampaignType = {
  CAMPAIGN: 'campaign',
  CAMPAIGN_RSS: 'campaignRss'
};

var ConditionBranch = {
  POSITIVE: 'positiveSiblings',
  NEGATIVE: 'negativeSiblings'
};

var ConditionOperator = {
  AND: 'and',
  OR: 'or'
};

var ConditionType = {
  NONE: 'none',
  CAMPAIGN_BEHAVIOR : 'campaign_behavior',
  RSS_TO_EMAIL: 'rss_to_email',
  SCHEDULED_DATE: 'scheduled_date',
  SITE_BEHAVIOR: 'site_behavior',
  SUBSCRIPTION_LIST: 'subscription_list',
  DYNAMIC_CONTENT: 'dynamic_content',
  PUSH: 'push'
};

var ConditionalCriteria = {
  CONTAINS: 'contains',
  ENDS_WITH: 'ends_with',
  EQUALS_TO: 'equals_to',
  GREATER_THAN: 'greater_than',
  GREATER_THAN_OR_EQUALS_TO: 'greater_than_or_equals_to',
  LESS_THAN: 'less_than',
  LESS_THAN_OR_EQUALS_TO: 'less_than_or_equals_to',
  NOT_CONTAINS: 'not_contains',
  NOT_ENDS_WITH: 'not_ends_with',
  NOT_EQUALS_TO: 'not_equals_to',
  NOT_STARTS_WITH: 'not_starts_with',
  STARTS_WITH: 'starts_with'
}

var ConditionalType = {
  CAMPAIGN_BEHAVIOR: 'campaign_behavior',
  LIST_MEMBERSHIP: 'list_membership',
  SUBSCRIBER_INFORMATION: 'subscriber_information',
  SITE_BEHAVIOR: 'site_behavior',
  ABANDONED_CART_INFORMATION: 'abandoned_cart_information'
};

var ConditionalEvent = {
  ANY_LINK_CLICKED: 'any_link_clicked',
  BELONGS: 'belongs',
  EMAIL_NOT_OPEN: 'email_not_open',
  LINK_CLICKED: 'link_clicked',
  LINK_NOT_CLICKED: 'link_not_clicked',
  NO_LINK_CLICKED: 'no_link_clicked',
  NOT_BELONGS: 'not_belongs',
  OPEN_EMAIL: 'open_email',
  VISITED: 'visited',
  NO_VISITED: 'no_visited',
  ANY_DYNAMIC_LINK_CLICKED: 'any_dynamic_link_clicked',
  NO_DYNAMIC_LINK_CLICKED: 'no_dynamic_link_clicked'
};

var DuplicateState = {
  FALSE: -1,
  ORIGIN: 0
}

var ActionType = {
  ASSOCIATE_SUBSCRIBER_TO_LIST: 'associate_subscriber_to_list',
  RESEND_EMAIL: 'resend_email',
  REMOVE_SUBSCRIBER_FROM_LIST: 'remove_subscriber_from_list',
  CHANGE_SUBSCRIBER_FIELD: 'change_subscriber_field'
};

var ContentType = {
  IMPORT: 'import',
  TEMPLATE: 'template',
  TINY_EDITOR: 'tinyEditor'
};

var AbandonedCartInformationFields = {
  DATE: 'date',
  AMOUNT_OF_PRODUCTS: 'amount_of_products',
  STATUS: 'status',
  TOTAL: 'total'
}

var FieldType = {
  BOOLEAN: 0,
  COUNTRY: 6,
  DATE: 3,
  EMAIL: 4,
  GENDER: 5,
  REAL: 1,
  STRING: 2,
  CONSENT: 7,
  ORIGIN: 8,
  SCORE: 9,
  PHONE: 10,
  PERMISSION: 11
}

var FormatType = {
  FLOAT: 'float'
}

var FrequencyType = {
  DAY_WEEK: 'day_week',
  DAY_MONTH: 'day_month',
  DAY_YEAR: 'day_year',
  DATE: 'date'
};

var FormIntegration = {
  EMBED: 'Embed',
  FACEBOOK: 'Facebook',
  LANDING: 'Landing',
  LINK: 'Link',
  WORDPRESS: 'Wordpress'
}

var FormIntegrationFBState = {
  NO_FB_ACCOUNT: 'no_fb_account',
  NO_TAB_CONFIGURED: 'no_tab_configured',
  NO_TAB_CONFIGURED_SHOW_SETTINGS: 'no_tab_configured_show_settings',
  TAB_INSTALLED:'tab_installed',
  TAB_DELETED: 'tab_deleted',
  TAB_DELETE_CONFIRMATION: 'tab_delete_confirmation'
}

var FormIntegrationErrorCode = {
	TAB_ERROR_CODE: 219
}

var GenderType = {
  FEMALE: 'female',
  MALE: 'male',
  N_A: 'n_a'
}

var AutomationState = {
  DRAFT: 5,
  ACTIVE: 1,
  PAUSED: 2,
  STOPPED: 6
};

var AutomationCompletedState = {
  INCOMPLETE: 0,
  COMPLETE_WITH_WARNINGS: 1,
  COMPLETED: 2,
  WITH_DELETED_FIELDS: 3,
  WITH_SITE_TRACKING_DISABLED: 4,
  WITH_DELETED_DOMAIN: 5,
  WITH_NON_VERIFIED_DOMAIN: 6,
  WITH_NON_REGISTERED_DOMAIN: 7,
  WITH_DEMO_EXPIRED: 8,
  WITH_TRIAL_DISABLED: 9,
  WITH_NON_INTEGRATION: 10,
  WITH_TRIAL_EXPIRED: 11
};

var ListSelectionState = {
  NONE: 'none',
  SIMPLE: 'simple',
  MULTIPLE: 'multiple'
};

var SendType = {
  INMEDIATE: 'inmediate',
  SCHEDULED: 'scheduled'
};

var TestOption = {
  EMAIL: 'email',
  LIST: 'list'
};

var TimeUnit = {
  DAYS: 'days',
  HOURS: 'hours',
  MINUTES: 'minutes',
  WEEKS: 'weeks'
};

var ZoomAction = {
  IN: 'zoom_in',
  OUT: 'zoom_out',
  RESET: 'zoom_reset'
};

var FormState = {
  DRAFT: 1,
  PUBLISHED: 2,
  PUBLISHED_WITH_CHANGES: 3
}

var FormType = {
  INLINE: 1,
  MODAL: 2,
  WHATSAPP: 3
}

var DomainStatus = {
  PENDING: 1,
  VERIFIED: 2,
  ERROR: 3
};

var TimesBackAutomation = {
  ONE_TIME: 0,
  EVERY_3_MONTHS: 1,
  EVERY_6_MONTHS: 2
}

var StartAutomationErrors = {
  INEXISTENT_FIELD: 35,
  SITE_TRACKING_DISABLED: 197,
  DOMAIN_NOT_EXIST: 214,
  DOMAIN_NOT_VERIFIED: 215,
  FEATURE_UNAVAILABLE: 216
}

var DataHubErrorCodes = {
  DUPLICATE_DOMAIN: 217
}

var IntegrationCodes = {
  MERCADOSHOPS: 1,
  TIENDANUBE: 3,
  VTEX: 5,
  PRESTASHOP: 6,
  SHOPIFY: 7,
  MAGENTO: 8,
  ZOHOCRM: 9,
  WOOCOMMERCE: 10,
  EASYCOMMERCE: 11,
  BMWCRM: 12,
  MERCADOLIBRE: 13,
  MITIENDA: 14,
  JUMPSELLER: 15,
  EMPRETIENDA: 16
}

var VtexFieldType = {
  EMAIL: 'Email'
}

var ZohoCrmFieldType = {
  EMAIL: 'email'
}

var TiendanubeFieldType = {
  EMAIL: 'email'
}

var BasicField = {
  EMAIL: 321
}

var ImportingState = {
  IMPORTING_SUBSCRIBERS: 5,
  READY: 1
}

var ImportingStateStr = {
  IMPORTING_SUBSCRIBERS: 'ImportingSubscribers',
  READY: 'Ready'
}

var IntegrationErrorCodes = {
  PS_CANNOT_CONNECT: 231,
  PS_NO_PERMISSION: 232,
  CANNOT_SYNC_LIST: 234,
  UNAUTHORIZED: 233
}

var dynamicContentHours = {
  ZERO_HOURS: 0,
  TWO_HOURS: 120,
  SIX_HOURS: 360,
  TWENTYFOUR_HOURS: 1440,
  FORTYEIGHT_HOURS: 2880,
  SEVENTYTWO_HOURS: 4320,
  ONE_WEEK: 10080,
  TWO_WEEKS: 20160,
  THREE_WEEKS: 30240
}

var IntegrationSourceType = {
  MVC: 1,
  API: 2
}

var PaymentMethod = {
  CC: 1,
  TR: 3,
  MP: 5,
  NONE: 4
}

var ConsumerType = {
  CF: 1,
  RI: 2,
  RFC: 4
}

var CountriesWithTransfer = {
  ARGENTINA: 10,
  MEXICO: 157,
  COLOMBIA: 49
}

var MxTypeOfPayment = {
  TRANSFER: 'TRANSFER'
}

var BlockedListStatus = {
  VALUE: 14
}

var BiilingSystem = {
  GB: 1,
  QBL: 2,
  QUICKBOOK_USA: 3,
  GB_BISIDE: 9,
  MERCADO_PAGO: 13
}

var DomainsSelectionState = {
  HIDING: 'hiding',
  SHOWING: 'showing'
};

var PushConfigurationStatus = {
  CONFIGURED: 0,
  NOT_VALID_DOMAIN: 1,
  FIREBASE_WORKER_NOT_FOUND: 2
};

var EMAIL_EDITOR_TYPE = {
  MSEDITOR: 4,
  UNLAYER: 5
};

var AUTOMATION_VIEW = {
  GRID: '#',
  TYPES: 'selectAutomationType',
  TEMPLATES: 'selectAutomationTemplate',
  TEMPLATE_PREVIEW: 'selectAutomationTemplatePreview'
};

angular.module('dopplerApp')
  .constant("Enums", Enums)
  .constant("REGEX", Regex)
  .constant('FORM_STATE', FormState)
  .constant('FORM_TYPE', FormType)
  .constant('FORM_INTEGRATION', FormIntegration)
  .constant('FORM_INTEGRATION_FB_STATE', FormIntegrationFBState)
  .constant('FORM_INTEGRATION_ERROR_CODE', FormIntegrationErrorCode)
  .constant("DOMAIN_STATUS", DomainStatus)
  .constant("DATA_HUB_ERROR_CODES", DataHubErrorCodes)
  .constant("INTEGRATION_CODES", IntegrationCodes)
  .constant("VTEX_FIELD_TYPE", VtexFieldType)
  .constant("ZOHO_CRM_FIELD_TYPE", ZohoCrmFieldType)
  .constant("TIENDANUBE_FIELD_TYPE", TiendanubeFieldType)
  .constant("IMPORTING_STATE", ImportingState)
  .constant("IMPORTING_STATE_STR", ImportingStateStr)
  .constant("BASIC_FIELD", BasicField)
  .constant("FIELD_TYPE", FieldType)
  .constant("INTEGRATION_ERROR_CODES", IntegrationErrorCodes)
  .constant("INTEGRATION_SOURCE_TYPE", IntegrationSourceType)
  .constant("PAYMENT_METHOD", PaymentMethod)
  .constant("CONSUMER_TYPE", ConsumerType)
  .constant("COUNTRIES_WITH_TRANSFER", CountriesWithTransfer)
  .constant("MX_TYPE_OF_PAYMENT", MxTypeOfPayment)
  .constant("BILLING_SYSTEM", BiilingSystem)
  .constant('PUSH_CONFIGURATION_STATUS', PushConfigurationStatus)
  .constant('EMAIL_EDITOR_TYPE', EMAIL_EDITOR_TYPE)
  .constant('AUTOMATION_VIEW', AUTOMATION_VIEW);

angular.module('dopplerApp.automation.editor')
  .constant('AUTOMATION_STATE',AutomationState)
  .constant('AUTOMATION_COMPLETED_STATE', AutomationCompletedState)
  .constant('AUTOMATION_TYPE', AutomationType)
  .constant('BASIC_FIELDS', BasicFields)
  .constant('CHANGE_TYPE', ChangeType)
  .constant('COMPONENT_TYPE', ComponentType)
  .constant('CAMPAIGN_TYPE', CampaignType)
  .constant('CONDITION_BRANCH', ConditionBranch)
  .constant('CONDITION_OPERATOR', ConditionOperator)
  .constant('CONDITION_TYPE', ConditionType)
  .constant('CONDITIONAL_CRITERIA', ConditionalCriteria)
  .constant('CONDITIONAL_EVENT', ConditionalEvent)
  .constant('CONDITIONAL_TYPE', ConditionalType)
  .constant('DUPLICATE_STATE', DuplicateState)
  .constant('ABANDONED_CART_INFORMATION_FIELDS', AbandonedCartInformationFields)
  .constant('ACTION_TYPE', ActionType)
  .constant('CONTENT_TYPE', ContentType)
  .constant('FIELD_TYPE', FieldType)
  .constant('FORMAT_TYPE', FormatType)
  .constant('FREQUENCY_TYPE', FrequencyType)
  .constant('GENDER_TYPE', GenderType)
  .constant('MAX_DAYS_VERIFICATION', 7)
  .constant('MAX_HOURS_VERIFICATION', 168)
  .constant('MAX_MINUTES_VERIFICATION', 60)
  .constant('MAX_WEEKS_VERIFICATION', 12)
  .constant('MAX_ITEMS_TO_SHOW', 3)
  .constant('TEST_OPTION', TestOption)
  .constant('TIME_UNIT', TimeUnit)
  .constant('TIMES_BACK_AUTOMATION', TimesBackAutomation)
  .constant('SEND_TYPE', SendType)
  .constant('START_AUTOMATION_ERRORS', StartAutomationErrors)
  .constant('LIST_SELECTION_STATE', ListSelectionState)
  .constant('ZOOM_ACTION', ZoomAction)
  .constant('DYNAMIC_CONTENT_HOURS', dynamicContentHours)
  .constant('BLOCKED_STATUS', BlockedListStatus)
  .constant('AUTOMATION_TYPE_IDS', AutomationTypeIds)
  .constant('DOMAINS_SELECTION_STATE', DomainsSelectionState)
  .constant('WHATSAPP_WARNING_TYPE', WhatsappWarningType);
