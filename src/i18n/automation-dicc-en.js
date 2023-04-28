var automation_en_translations = {
  automation_editor: {
    date_format: 'MM/dd/yyyy',
    breadcrumb: {
      placeholder: 'Automation without name',
      scheduled_date: 'Scheduled Date: ',
      site_behavior: 'On-Site Tracking: ',
      subscription_list: 'Welcome Email: ',
      rss_to_email: 'RSS to Email: ',
      campaign_behavior: 'Campaign Activity: ',
      doppler_tip_part1:
        'Choose an easy name to identify. For example, use something like ',
      doppler_tip_part2: 'Birthday greeting campaign for clients.',
      exit_editor: 'Exit the Editor',
      exit_option1: 'Campaigns',
      exit_option2: 'Lists',
      exit_option3: 'Automation',
      exit_option4: 'Control Panel',
      exit_option5: 'Home',
      abandoned_cart: 'Abandoned Cart: ',
      visited_products: 'Product Retargeting: ',
      pending_order: 'Pending Payment: ',
      confirmation_order: 'Successful Payment: ',
      push_notification: 'Push Notifications: ',
    },
    buttons: {
      exit: 'Exit and edit later',
      back_to_editor: 'Back to the Automation Flow',
      confirm: 'Confirm',
      confirm_selection: 'Confirm selection',
      start_campaign: 'Start Automation',
      start_campaign_warning: 'Start Automation anyway',
      stop_campaign: 'Stop Automation',
      skip_selection: 'Skip the selection ',
      pause_campaign: 'Pause Automation',
      restart_campaign: 'Restart Automation',
      build_campaign: 'Build Automation',
      reactivate_campaign: 'Reactivate Automation',
    },
    canvas: {
      action_placeholder: 'Define the Action',
      action_list_placeholder: 'Associate Subscriber to the List ',
      action_resend_email_palceholder: 'Resend Email',
      action_remove_suscriber_placeholder: 'Remove Subscriber from the List',
      action_change_field_placeholder: 'Edit Field',
      action_change_field_with_value: 'with value',
      delay_icon: 'Wait',
      campaign_icon: 'Email',
      campaign_placeholder: 'Email Name?',
      condition_icon: 'Condition',
      condition_placeholder: 'Define your Condition criteria ',
      action_icon: 'Action',
      add_step_title: 'Add a step to your Automation Flow',
      tip_add_element: 'Start defining the steps in your<br />Automation Flow',
      tip_initial_condition:
        'Set the Flow starting point up from the side menu',
      wait_time_part1: 'Wait',
      campaign_aspects: 'Define your shipment information',
      right_now: 'Inmediately',
      time_placeholder: 'time',
      sms_icon: 'Sms',
      sms_placeholder: 'Define your Sms',
      sms_part1: 'Send to phone',
      sms_part2: 'the text message',
      sms_new_step_not_credit:
        "You don't have enough funds to send SMS.<br><a target='_self' href='/ControlPanel/AccountPreferences/GetSmsConfiguration?'>Click here</a> to recharge and start your Automation.",
      abandoned_cart_aspects: 'Define the shipment information',
      push_icon: 'Push',
      push_placeholder: 'Define the Push notification content',
      push_title_preview: 'Title: ',
      push_body_preview: ' Message: ',
      goto_step_placeholder: 'Select the step you want to connect with',
      goto_step_connection_label: 'Connection',
      goto_icon: 'Connect',
      goto_tooltip_invalid_connection_to_goto:
        'Choose another type of step. <br /> You cannot link two “Connect”.',
      goto_tooltip_infinite_flow_generation:
        'Choose another step. <br /> If you connect it with this, you will create an infinite flow.',
    },
    components: {
      initial_condition: {
        scheduled_date: {
          canvas: {
            and: ' and',
            day_month: {
              intro: 'The shipment will be sent the day ',
              of_the_month: ' of the month,',
            },
            day_week: {
              intro_single: 'The shipment will be sent the day ',
              intro_plural: 'The shipment will be sent the days ',
            },
            day_year: {
              after: ' after',
              before: ' before',
              criteria_are_met: ' the following criteria are met ',
              day: 'day',
              days: 'days',
              intro: 'The shipment will be sent ',
              intro_single:
                'The shipment will be sent when the following criteria is met ',
              intro_plural:
                'The shipment will be sent when the following criteria are met',
              of_the_day: ' the day of ',
            },
            hour: 'at ',
            hours: 'at ',
          },
          custom_birthday: 'Birthday',
          default_part1: 'Start sending the day',
          default_part2: 'at HH:MM.',
          day_moment_after: 'After',
          day_moment_before: 'Before',
          day_moment_now: 'The exact day',
        },
        days_of_the_week: {
          sunday: 'Sunday',
          monday: 'Monday',
          tuesday: 'Tuesday',
          wednesday: 'Wednesday',
          thursday: 'Thursday',
          friday: 'Friday',
          saturday: 'Saturday',
        },
        site_behavior: {
          canvas: {
            intro: 'A Subscriber has visited ',
            at_least: ' at least',
            more_times: 'times',
            separator: 'the URL ',
            more_urls: ' ...',
            visited: ' has visited ',
            no_visited: " hasn't visit ",
            operator_and: ' and',
            operator_or: ' or',
            a_subscriber: 'A Subscriber',
          },
          panel: {
            title:
              'Define the page URL (s) on which you want to track your visitors behavior',
            title2:
              'Indicate how often the same Subscriber can re-enter the Automation Flow',
            description:
              'This is important if you want to prevent a Subscriber from receiving the same Email each time he visits your website.',
            times_label: 'Enter a Subscriber to the Automation Flow',
            times_value0: 'Once',
            times_value1: 'Once every 3 months',
            times_value2: 'Once every 6 months',
            url: '*URL',
            url_tooltip:
              'Add a * at the end of your website URL: fromdoppler.com/* to track all of its pages.',
            url_tip:
              'Pst! Want to track all of your site pages? Look at this tip',
            validation_messages: {
              domain_non_registered:
                "Ouch! The entered domain hasn't been registered.",
              domain_non_registered_link: 'ADD IT NOW',
              domain_non_verified:
                "Ouch! The entered domain hasn't been verified.",
              domain_non_verified_link: 'DO IT NOW.',
              duplicated_domain: 'Ouch! The domain has been previously added.',
              url_has_parameters:
                "Ouch! The entered URL has parameters that can't be processed by the system. Try removing characters after the ?",
            },
            placeholder: 'URL',
            visited_page: 'Visited the page',
            visited_count: 'time / times',
            verification_time_title:
              'Define when you want we verify whether the Condition has been met',
            verification_time_description:
              'After that period, Doppler will analyze again if the Condition has been met. Do you have doubts? Press ',
            verification_time: 'Verification time',
            verification_time_placeholder: 'Example: 24',
          },
          tip_normal: 'Press',
          tip_strong:
            'Do you have any doubts about how to create a On-Site Tracking Automation?',
          tip_url:
            'https://help.fromdoppler.com/en/create-onsite-tracking-automation/',
        },
        subscription_list: 'A Subscriber has joined the List ',
        behavior: {
          scheduled_day: 'Make the shipment ',
          scheduled_day_part2: 'the ',
          hours_pl: ' at ',
          hours_sg: ' at ',
          lists_pl: ' to the Lists ',
          lists_sg: ' to the List ',
          inmediately_send: 'Make the shipment ',
          inmediately_frequency: 'immediately',
          all_subscribers: ' to all my Subscribers.',
        },
        months_of_the_week: {
          january: 'January',
          february: 'February',
          march: 'March',
          april: 'April',
          may: 'May',
          june: 'June',
          july: 'July',
          august: 'August',
          september: 'September',
          october: 'October',
          november: 'November',
          december: 'December',
        },
        today: 'Today',
        abandoned_cart: {
          main_description:
            'The Subscriber abandoned the cart <strong>{{time}}</strong> ago',
        },
        visited_products: {
          main_description:
            'The Subscriber visited the product page <strong>{{time}}</strong> ago',
        },
        pending_order: {
          main_description:
            'The Subscriber completed an Order <strong>{{time}}</strong> ago and has a Pending Payment.',
        },
        confirmation_order: {
          main_description: 'A payment has been registered successfully',
        },
        push_notification: {
          scheduled_day: 'Make a ',
          scheduled_day_frequency: 'Scheduled Send Out',
          scheduled_day_part2: 'on ',
          hours_pl: ' at ',
          hours_sg: ' at ',
          domains_pl: ' to domains ',
          domains_sg: ' to domain ',
          inmediately_send: 'Make a ',
          inmediately_frequency: 'Immediate Send Out',
          and: ' and',
          tip_initial_condition:
            'Set the Automation starting point up from the side menu',
        },
        panel: {
          validation_messages: {
            trial_expired_error:
              'The selected date is after the expiration of the account. In order to start the Automation you must first hire a Plan.',
            trial_upgrade: 'UPGRADE NOW',
          },
        },
      },
      action: {
        options: {
          placeholder: 'Select an Action',
          associate_subscriber_to_list: 'Associate Subscriber to a List',
          resend_email: 'Resend Email changing Subject Line',
          remove_subscriber_from_list: 'Remove Subscriber from the List',
          change_subscriber_field: 'Modify Subscriber information',
        },
        list_grid: {
          title: 'Select the List you want to associate the Subscriber',
          subtitle:
            'Associate a Subscriber to a specific List based on criteria you have previously defined such as having opened a Campaign or clicked on a link, for example.',
        },
        remove_grid: {
          title: 'Select the List you want to remove the Subscriber from',
          subtitle:
            "When the Condition you've defined is met, the Subscriber will be removed from the List or Lists you select below but will remain active on your account.",
        },
      },
      campaign: {
        delete_warning: {
          title:
            "Ouch! This Email can't be eliminated since it's associated with other elements.",
        },
      },
      condition: {
        canvas_description: {
          check_for: 'Verify during ',
          if_subscriber: ' if',
          of_time: ' time',
          operator_and: ' and',
          operator_or: ' or',
          plural_days: ' days ',
          plural_hours: ' hours ',
          plural_minutes: ' minutes ',
          plural_weeks: ' weeks ',
          singular_days: ' day ',
          singular_hours: ' hour ',
          singular_minutes: ' minute ',
          singular_weeks: ' week ',
          verification_time: ' time',
          verification_after: ' After ',
        },
        conditionals: {
          campaign_behavior: {
            canvas_description: {
              any_link_clicked: 'has clicked on some link',
              email_not_open: 'has not opened the Email',
              intro_lower: ' the Subscriber',
              intro_upper: 'The Subscriber',
              link_clicked: 'has clicked on the link',
              link_not_clicked: 'has not clicked on the link',
              nexus_of: 'in the Email ',
              no_link_clicked: 'has not clicked on any link',
              open_email: 'has opened the Email',
              any_dynamic_link_clicked: 'has clicked on some dynamic link',
              no_dynamic_link_clicked: 'has not clicked on any dynamic link',
            },
            events: {
              any_link_clicked: 'Has clicked on some link',
              email_not_open: 'Has not opened the Email',
              link_clicked: 'Has clicked on a specific link',
              link_not_clicked: 'Has not clicked on a specific link',
              no_link_clicked: 'Has not clicked on any link',
              open_email: 'Has opened the Email',
              any_dynamic_link_clicked: 'Has clicked on some dynamic link',
              no_dynamic_link_clicked: 'Has not clicked on any dynamic link',
            },
            label: 'Subscriber behavior in a Campaign',
            label_email: 'Select the Email',
            label_event: 'Select the trigger',
            label_link: 'Select the link',
          },
          error: {
            deleted_field: "Ouch! Selected Field doesn't exist.",
            duplicate_conditional: 'Ouch! This criterion already exists.',
            deleted_link: 'Ouch! This link has been removed.',
            no_email: 'Ouch! You must create at least one Email.',
            no_link: 'Ouch! This Email has no links.',
            number_pattern: 'Ouch! The number you entered is invalid.',
          },
          list_membership: {
            canvas_description: {
              belongs: 'is a member of the List',
              intro_lower: ' the Subscriber',
              intro_upper: 'The Subscriber',
              not_belongs: 'is not a member of the List',
            },
            events: {
              belongs: 'Member',
              not_belongs: 'No member',
            },
            label: "Subscriber's membership of a List",
            label_list: "You've selected",
            list_selection: {
              title: "Select a List to determine the Subscriber's membership",
              subtitle:
                'Identify the List on the basis of which you want to determine the membership of the Subscribers.',
            },
          },
          placeholder: 'Select a Condition type',
          subscriber_information: {
            boolean: {
              no: 'No',
              yes: 'Yes',
            },
            canvas_description: {
              criteria: {
                contains: ' contains ',
                ends_with: ' finishes with ',
                equals_to: ' is equals to ',
                greater_than: ' is greater than ',
                greater_than_or_equals_to: ' is greater than or equals to ',
                less_than: ' is less than ',
                less_than_or_equals_to: ' is less than or equals to ',
                not_contains: ' does not contains ',
                not_ends_with: ' does not finishes with ',
                not_equals_to: ' is different to ',
                not_starts_with: ' does not start with ',
                starts_with: ' starts with ',
              },
              female: 'female',
              intro_lower: ' the Field',
              intro_upper: 'The Field',
              intro_is: ' is ',
              intro_possessive: ' his ',
              intro_subject: ' of the Subscriber',
              male: 'male',
              n_a: 'N/A',
              negative: 'No',
              positive: 'Yes',
            },
            criteria: {
              contains: 'Contains',
              ends_with: 'Finishes with',
              equals_to: 'Equals to',
              not_contains: 'Does not contains',
              not_ends_with: 'Does not finishes with',
              not_equals_to: 'Different to',
              not_starts_with: 'Does not start with',
              label: 'Select Criteria',
              operators: {
                label: 'Select Operator',
                less_than: 'Less than',
                less_than_or_equals_to: 'Less than or equal to',
                greater_than: 'Greater than',
                greater_than_or_equals_to: 'Greater than or equal to',
                equals_to: 'Equals',
              },
              starts_with: 'Starts with',
            },
            fields: {
              FIRST_NAME: 'First name',
              LAST_NAME: 'Last name',
              EMAIL: 'Email',
              GENDER: 'Gender',
              BIRTHDAY: 'Birthday',
              COUNTRY: 'Country',
              CONSENT: 'Consent',
              ORIGIN: 'Origin',
              SCORE: 'Score',
            },
            gender: {
              female: 'Female',
              label: 'Select Gender',
              male: 'Male',
              n_a: 'N/A',
            },
            label: "Subscriber's information",
            label_country: 'Select Country',
            label_score: 'Select Score',
            label_origin: 'Select Origin',
            label_field: 'Select Field',
          },
          site_behavior: {
            label: 'On-Site Tracking',
            the_subscriber: ' the Subscriber',
            no_visited: " hasn't visited ",
            visited: ' has visited ',
            separator: 'the URL ',
            more_times: 'times',
            at_least: ' at least',
          },
          abandoned_cart_information: {
            label: 'Cart Information',
            the_cart: ' the Cart',
            no_visited: " hasn't visited ",
            visited: ' has visited ',
            separator: 'the URL ',
            more_times: 'times',
            at_least: ' at least',
            fields: {
              date: 'Date',
              amount_of_products: 'Amount of products',
              status: 'Status',
              total: 'Total',
            },
          },
        },
        delete_warning: {
          title: "Ouch! You can't delete this Condition. ",
          body: 'Before you have to delete all the elements that are inside one of the branches.',
        },
        negative_branch: 'NO',
        positive_branch: 'YES',
        verification_time: {
          error_days: 'Ouch! You must enter a number between 1 and 7.',
          error_hours: 'Ouch! You must enter a number between 1 and 168.',
          error_minutes: 'Ouch! You must enter a number between 5 and 60.',
          error_weeks: 'Ouch! You must enter a number between 1 and 12.',
          label: 'Verification time',
          subtitle:
            "When the time has expired, users who didn't met the Condition will be send to the NO branch.",
          title:
            'Define when you want we verify whether the Condition has been met',
        },
      },
    },
    create_list: {
      title: 'Create a List to send your tests',
      description:
        "You'll be sending your Campaign tests to the following contacts. Please assign a name to the List so you can identify it easily. Don't forget to add your Susbcribers' Name and Lastname to test your Custom Fields.",
      list_name: 'Subscribers List name:',
      add_suscriber: 'Add new Subscriber',
      footer_tip:
        'Generate a List that contains %1 Subscribers or less to send a test.',
      button_create: 'Create test List',
      duplicate_email: 'You already entered this email',
      duplicate_listname: '¡Oh No! You already used this name in another List.',
    },
    footer: {
      tip_stop: 'To edit the Automation, you must first stop it.',
      tip_state_0: 'Pst! Every step must be completed',
      tip_state_1:
        'Have you forgotten something? The last step has no associated action',
      tip_state_2: 'Pst! Every step must be completed',
      tip_state_8:
        "This functionality is enabled only for accounts with Paid Plan. <a href='/ControlPanel/AccountPreferences/UpgradeAccount?Plan=monthly' target='_self'><strong>BUY NOW</strong></a>.",
      tip_state_9:
        "Use it FREE for a limited time. <a href='/Automation/EditorConfig?idTaskType=0' target='_self'><strong>ACTIVATE YOUR TRIAL</strong></a>.",
      tip_state_10:
        "Ouch! To start your Automation you need to connect Doppler with your E-commerce. <a href='/ControlPanel/ControlPanel' target='_self'><strong>CONNECT</strong></a>.",
      tip_state_11: 'The selected date is after the expiration of the account.',
      tip_state_error:
        'Ouch! It seems that something is not right with the conditions at the begining of the flow.',
      tip_not_sms_credit:
        "Don't forget <a href='/ControlPanel/AccountPreferences/GetSmsConfiguration' target='_self'><strong>to top up</strong></a> funds for your SMS shipments before starting your Automation!",
    },
    header: {
      tip_templates: 'Want to choose your Template later?',
      undo: 'Undo',
      redo: 'Redo',
    },
    import_file: {
      title: 'Import Campaign content',
      description:
        "It's time to import your .html or zip. You can either search for it or just drag and drop it into the place shown below. Any doubts? We can help you out! Just press ",
      help_url: 'https://help.fromdoppler.com/en/como-importar-un-html/',
      cancel_button: 'Cancel',
      drag_text: 'Drag and drop your <b>Campaign file</b> here or ',
      importing: 'Importing <b>{{fileName}}</b>',
      imported: "You've imported <b>{{fileName}}</b>",
      drag_button: 'Browse for your file',
      drag_button_imported: 'Replace file',
      drag_button_imported_error: 'Import another file',
      drag_description:
        'You can import an .html file or a .zip file. If your Campaign includes images, you should include both the images and the HTML into the zip file. Any doubts? We can help you out! Just press ',
      drag_help_url: 'https://help.fromdoppler.com/en/como-importar-un-html/',
      error_max_files: 'Ouch! You cannot upload 2 files at the same time.',
      error_file_size:
        '¡Ouch! The size of your file is larger than fileSize MB',
      tip: 'Import a file and continue editing your Email Automation Campaign',
      dynamic_tip_link_help: 'Need Help? Press',
      abandoned_cart_tip_link_url:
        'https://help.fromdoppler.com/en/create-abandoned-cart-automation',
      visited_products_tip_link_url:
        'https://help.fromdoppler.com/en/create-product-retargeting-automation',
    },
    blocked_list: {
      tooltip_tag: 'BLOCKED LIST',
      link_text: 'Learn more.',
      help_link: 'https://help.fromdoppler.com/en/blocked-lists',
      tooltip_text:
        'There’re Subscribers that affect the quality of your List.',
    },
    lists_grid: {
      title: 'Select the List you want to associate with your Campaign',
      description:
        "Every Subscriber that joins to the selected List will receive your Email Automation Campaign. This feature was tailor made for Welcome Emails. Any doubts? We're here for you, just press ",
      link_url:
        'https://help.fromdoppler.com/en/como-crear-email-automation-ingreso-lista',
      tip_help:
        'Select a List and continue editing your Email Automation Campaign',
    },
    lists_grid_empty: {
      title: "It seems that you haven't created Lists yet",
      description:
        'Do it now and then go back to continue editing your Automation.',
      action: 'Exit and create a List',
    },
    lists_scheduled_grid: {
      title: 'Select the List or Segment you want to associate your Campaign',
      description:
        "Identify who you want to send your Email Automation Campaign to. You can select Subscriber's Lists or generate a Segment by choosing different Filtering Criterias.",
      list_filter: 'Lists',
      segments_filter: 'Segments',
      footer_tip:
        'Select a List and continue editing your Email Automation Campaign',
      segments: ' (Segment)',
      doppler_tip:
        "Create a Segment based on different criterias like your Subscriber's age or location.",
      all_contacts: 'Send to all my contacts (All your Lists will be selected)',
      blocked_list:
        'There’re Subscribers that affect the quality of your List. Learn more.',
      blocked_list_link: 'Learn more.',
      blocked_list_href: 'https://help.fromdoppler.com/en/blocked-lists',
      blocked_list_text: 'BLOCKED LIST',
      blocked_segment:
        'There’re Subscribers that affect the quality of your Segment.',
      blocked_segment_href:
        'https://help.fromdoppler.com/en/blocked-lists#blocked-segments',
      blocked_segment_text: 'BLOCKED SEGMENT',
    },
    tiny_editor: {
      title: 'Text & HTML Editor',
      subtitle:
        'Use this Editor to compose your Campaign content. Select the Custom Fields you want to include from the list on you right and they will be automatically added to your Email content.',
      dopplerTip:
        'Give a human touch to your texts by adding as many Custom Fields as you want. Any doubts? We can help you out! Just press ',
      dopplerTipLink:
        'https://help.fromdoppler.com/en/como-agregar-un-campo-personalizado/',
      custom_fields_title: 'Custom Fields',
      return_button: 'Back to the Automation Flow',
      confirm_button: 'Confirm',
    },
    lists_grid_headers: {
      label: 'Tag',
      list_name: 'List Name',
      list_segments_name: 'List Name or Segment',
      last_send: 'Last Mailing Date',
      subscribers: 'Subscribers',
    },
    templates: {
      privates_description:
        'Select a Template for the Email of your Automation.',
      publics_description:
        'Select one of our Templates to create the Email for your Automation and customize it as you wish.',
      privates_description_abandoned_cart:
        "We've created Templates exclusively designed to help you recover abandoned carts. Choose the one that best suits your needs!",
      privates_description_visited_products:
        "We've created Templates exclusively designed to help you convert those users who visited items on your E-commerce, into loyal customers. Choose the one that best suits your needs!",
      privates_description_pending_order:
        'We’ve created customizable Templates to notify customers with pending payments. Choose the best option for your store!',
      privates_description_confirmation_order:
        'We’ve created customizable Templates to notify customers when a payment is successfully processed. Choose the best option for your store!',
    },
    sidebar: {
      action_email_title: 'Email',
      action_title: 'Define the Action you want to be executed',
      action_help_tip:
        'Do you have any doubts about how to create Actions for your Automation Campaigns?',
      action_help_tip_link:
        'https://help.fromdoppler.com/en/crear-accion-en-automation',
      action_field: 'Custom field',
      action_value: 'Value',
      non_customs_error:
        'To use this feature you need to have at least one Custom Field. ',
      non_customs_error_link: 'CREATE IT NOW.',
      non_customs_phone_error:
        'To use this feature you need to have at least one Phone type Custom Field.',
      sms_title: 'Build your SMS',
      characters: 'Characters',
      count_parts: 'Messages',
      main_title:
        'Configura el punto de partida para tu automation por comportamiento',
      user_has_been_section: 'El usuario ha estado en la sección:',
      start_steps:
        'Comienza a seleccionar los pasos para tu automation a través del signo en el panel derecho',
      add_step_tip:
        'Add one of the steps located in the panel to configure your Automation Flow',
      time_before_campaign:
        'How long do you want to wait before implementing the following step?',
      delay_time: 'Wait time',
      time_unit: {
        minutes: 'Minutes',
        hours: 'Hours',
        day: 'Day',
        days: 'Days',
        weeks: 'Weeks',
      },
      delay_input_placeholder: 'Example: 24',
      form_title: 'Complete the data that will be used at the time of shipment',
      campaign_name: 'Email Name',
      campaign_name_error:
        "Ouch! You've reached the maximum number of characters.",
      rss_url: 'URL for your RSS feed',
      campaign_subject: 'Subject',
      campaign_subject_emojis: {
        emojis_categories: {
          Emoji_Category_Faces_Emotions: 'Faces and emotions',
          Emoji_Category_People_Body: 'People and body',
          Emoji_Category_Animals_Nature: 'Animals and nature',
          Emoji_Category_Food_Drinks: 'Food and drinks',
          Emoji_Category_Activities: 'Activities',
          Emoji_Category_Travel: 'Travel',
          Emoji_Category_Objects: 'Objects',
          Emoji_Category_Symbols: 'Symbols',
          Emoji_Category_Flags: 'Flags',
        },
      },
      campaign_subject_tip:
        'Being original when choosing the Subject for your Campaign is key to get a high Open Rate.',
      subject_hide_advice: 'Hide advice',
      subject_show_advice: 'Show advice',
      subject_suggestion_title: 'Advice',
      subject_suggestion_short_title:
        'Use up to 40 characters. Shorter is better!',
      subject_suggestion_short_description:
        'You’ll be sure it looks OK in all devices.',
      subject_suggestion_emojis_title: 'Use Emojis attraction',
      subject_suggestion_emojis_description:
        'Everybody loves them! But add only one per Subject.',
      subject_suggestion_custom_title: 'Add up to two Custom Fields',
      subject_suggestion_custom_description:
        "Insert them with the <span class='btn-aspect'>[ ]</span> button.",
      subject_suggestion_special_char_title: 'Limit the use of ! ?',
      subject_suggestion_special_char_description:
        'Choose them wisely! Don’t include more than three.',
      subject_score_noSubject: '........................',
      subject_score_veryLow: 'Very low :(',
      subject_score_low: 'Low',
      subject_score_medium: 'Medium',
      subject_score_high: 'High',
      subject_score_veryHigh: 'Very high!',
      subject_beta_feature: 'BETA VERSION',
      subject_effective_tittle: 'Effectiveness of the Subject:',
      subject_effective_ia_explain:
        "Every day we analyze our users' Subjects to give you some advice for improving your own Subjects.",
      subject_keyWords: 'Keywords:',
      subject_effective_ia_content:
        'Psst! These words could affect your Subject’s effectivness positively or negatively.',
      subject_effective_tooltip:
        'Green Keywords are good choices! Those in yellow have doubtful efficacy. Red Keywords should be avoided.',
      subject_effective_ia_error: 'Ouch! Something went wrong. Try it later.',
      subject_industry_title: 'Industry',
      subject_industry_change: 'Change',
      subject_industry_confirm: 'Confirm',
      subject_industry_select: 'Select',
      subject_choose_industry: 'Choose your industry',
      subject_industry_save_success: 'Changes successfully saved.',
      subject_industry_save_warning:
        'Choose a <strong>specific industry</strong> to get accurate information about your Subject’s effectivness.',
      subject_industry_save_suggestion:
        '<strong>Choose an specific industry</strong> to get accurate information about your Subject’s effectivness.',
      campaign_pre_header: 'Preheader',
      campaign_pre_header_tip_part1:
        "Take advantage of the short summary text that follows the Subject line when an email is viewed in the inbox. It'll help you Improve your open rates! ",
      campaign_pre_header_tip_part2: 'Need help?',
      campaign_pre_header_tip_link:
        'https://help.fromdoppler.com/en/que-es-el-pre-encabezado-y-como-utilizarlo/',
      campaign_pre_header_tip:
        "Take advantage of the short summary text that follows the subject line when an email is viewed in the inbox. It'll help you Improve your open rates! Need Help?",
      campaign_pre_header_tip_help_url:
        'https://help.fromdoppler.com/en/que-es-el-pre-encabezado-y-como-utilizarlo/',
      campaign_pre_header_help_link_text: 'Help',
      campaign_dmarc_validation_part1:
        'The use of free Email domains such as Hotmail, Yahoo, Gmail or others, may affect your Delivery Rate. ',
      campaign_dmarc_validation_subscribers_part1:
        'Due to the number of Contacts you have, you must configure your own domain to send this Campaign. ',
      campaign_dmarc_validation_part2: 'If you have any doubts, press ',
      campaign_dmarc_validation_linkText: 'HELP',
      campaign_dmarc_validation_linkUrl:
        'https://help.fromdoppler.com/en/how-to-enable-domainkeys-dkim/',
      campaign_dmarc_validation_AcceptButton: 'OK',
      campaign_dmarc_validation_subscribers_AcceptButton:
        'CONFIGURE YOUR DOMAIN',
      contact_policy_title: 'Ignore Contact Policy',
      contact_policy_tooltip:
        'If you ignore the Contact Policy, the limit you’ve defined won’t be applied to this Campaign.',
      contact_policy_radio_no: 'No',
      contact_policy_radio_yes: 'Yes',
      contact_policy_legend:
        'You haven’t defined a Contact Policy yet. Learn how to do it in our ',
      contact_policy_help_link:
        'https://help.fromdoppler.com/en/contact-policy',
      contact_policy_help_text: 'HELP',
      campaign_sender_email: 'From - Email',
      campaign_sender_name: 'From - Name',
      campaign_answer_email: 'Reply to- Email Address',
      campaign_shares_title:
        'Configure the viralization of your Email through Social Networks',
      campaign_shares_add: "Add 'Share' button",
      campaign_email_content_title: 'Email content',
      campaign_import_file: 'Upload File',
      campaign_templates_editor: 'Templates Editor',
      campaign_text_html_editor: 'Text & HTML Editor',
      campaign_send_test_title: 'Send an Email test',
      campaign_send_test_warning_incomplete:
        'Ouch! Before you need to complete all the shipment data.',
      campaign_send_test_subscribers_title: 'Send it to a Subscriber List',
      campaign_send_test_subscribers_subtitle:
        'Select one of your Lists that contains {{ maxSubsInList }} Subscribers or less to send a test. Verify that your Campaign is just as you want it to be.',
      campaign_send_test_subscribers_select_placeholder:
        "Select a Subscribers' List",
      campaign_send_test_send_button: 'Send',
      campaign_send_test_email_title: 'Send a test to a specific Email',
      campaign_send_test_email_subtitle:
        'Type down the Email you wish to send your Campaign test.',
      campaign_send_test_ok_message:
        'Nice! The test has been sent. Please verify your Campaign.',
      campaign_send_test_max_amount_sent_reached:
        'Maximum amount of tests reached.',
      campaign_send_test_create_list: 'Create a List to send your tests',
      campaign_title: 'Setup the sending options',
      campaign_send_now_title: 'Immediate Send Out',
      campaign_send_now_description:
        'The Campaign will be sent after you click the Send Campaign button.',
      campaign_send_scheduled_title: 'Scheduled Send Out',
      campaign_send_scheduled_description:
        'The Campaign will be sent on your preferred date.',
      campaign_tip:
        'Do you have any doubts about how to create a Campaign Activity Automation?',
      campaign_tip_link_url:
        'https://help.fromdoppler.com/en/create-campaign-activity-automation',
      campaign_field_date: 'Date:',
      campaign_field_hour: 'Hour:',
      campaign_notification_title: 'Send confirmation Emails to',
      campaign_notification_text:
        'Want to receive a confirmation once your Campaign is sent? ',
      campaign_max_emails:
        'Please enter up to {{maxConfEmails}} Email addresses.',
      campaign_add_email: 'Add new Email',
      campaign_domain_error_part1: 'Validate this domain.',
      campaign_domain_error_part2:
        "We'll send you a verification code, enter it below.",
      campaign_domain_error_part3:
        "This helps keep your Campaign out of the Spam folder and protects your reputation by ensuring others can't use your domain without permission. Any doubts? Press ",
      campaign_domain_error_help_link:
        'https://help.fromdoppler.com/en/from-email-domain-validation',
      campaign_domain_send_email_title:
        'Email in which you want to receive the verification code',
      campaign_domain_send_email_btn: 'Send',
      campaign_domain_send_code_title: 'Verification code',
      campaign_domain_send_code_btn: 'Verify',
      campaign_domain_code_validation_ok:
        'The domain has been successfully added.',
      campaign_domain_code_validation_max_domain_part1:
        "Ouch! You've exceeded the allowed number of available domains.",
      campaign_domain_code_validation_max_domain_part2:
        'Enter an Email with a domain already validated or delete an existing one from the ',
      campaign_domain_code_validation_max_domain_part3: 'Admin.',
      campaign_domain_code_validation_max_domain_part4: 'Any questions? Press ',
      campaign_domain_code_validation_max_domain_part5:
        'https://help.fromdoppler.com/en/how-to-enable-domainkeys-dkim',
      campaign_domain_code_validation_failed:
        'Ouch! The code is invalid. Try again.',
      campaign_domain_send_success: 'Your code has been delivered',
      campaign_domain_send_error:
        "Ouch! You've exceeded the maximum number of verification code shipments. Try again within 24 hours.",
      condition_title: 'Choose a name for your Condition',
      condition_title_tip:
        'Make it easy to identify as it will be the way your Condition will be displayed on the canvas.',
      condition_define_conditions: 'Define your Condition criteria',
      condition_define_conditions_tip:
        'The more criteria you gather, the more targeted your shipment will be.',
      condition_help_tip:
        'Do you have any doubts about how to create Conditions for your Automation Campaigns?',
      condition_help_tip_url:
        'https://help.fromdoppler.com/en/create-conditions-for-automation',
      condition_add_tip: 'Add criteria for your Condition',
      condition_and_tip: 'All criteria must be met',
      condition_or_tip: 'At least one of the criterion must be met',
      date_picker_current_text: 'Today',
      list_blocked: 'Blocked List',
      list_title:
        'Choose the List you want to associate to your Automation Campaign:',
      list_select_button: 'Select List',
      list_replace_button: 'Replace associated Lists',
      list_tip:
        'Do you have any doubt about how to create a Signup-based Automation Campaign?',
      list_tip_part2: 'Press',
      list_selected: "You've selected",
      list_all_my_contacts_selected: 'All my contacts',
      list_tip_link_text: 'Help',
      list_tip_link_url:
        'https://help.fromdoppler.com/en/como-crear-email-automation-ingreso-lista/',
      list_segments_error: "Ouch! You've selected a Segment instead of a List.",
      phone_type: 'Phone Field',
      phone_name: 'SMS Name',
      sms_text: 'Message text',
      sms_text_desc:
        'Adding special characters may increase the amount of SMS sent.',
      sms_colombian_warning_msg:
        'There is a limitation to 146 characters for sending SMS to Colombia.',
      sms_colombian_warning_link_label: 'SEE DETAILS',
      sms_colombian_warning_link:
        'https://help.fromdoppler.com/en/por-que-mis-contactos-no-reciben-los-sms-que-envie',
      sms_help_tip:
        '¿Tienes dudas sobre cómo crear un Sms dentro de tu Campaña de Automation?',
      sms_help_tip_link:
        'https://help.fromdoppler.com/es/crear-accion-en-automation',
      sms_text_test: 'Send an SMS test to a specific phone',
      sms_text_test_desc:
        'Enter the phone number you want to send your SMS test to. The cost of this test will be deducted from your available funds.',
      scheduled_date_tip_link_url:
        'https://help.fromdoppler.com/en/campanas-de-email-automation-por-fechas-programadas/',
      scheduled_date_title:
        "Select what type of date you'll use in order to assign a sending frequency to your Email Automation Campaign",
      scheduled_date_tip:
        'Do you have any doubts about how to create a Date-based Email Automation Campaign?',
      scheduled_date_tip_part2: 'Press',
      scheduled_date_day_week_title: 'Day of the Week',
      scheduled_date_day_week_description:
        'Schedule a Campaign to be sent on a specific day of each week.',
      scheduled_date_day_month_title: 'Day of the Month',
      scheduled_date_day_month_description:
        'Special for billing reminders. Send an Email every month on the same day.',
      scheduled_date_day_number_error:
        'Ouch! The number you entered is invalid.',
      scheduled_date_day_year_title: 'Day of the Year',
      scheduled_date_day_year_description:
        'Perfect for specific dates. You can use it to send birthdays greetings.',
      scheduled_date_add_custom_field: 'Add a new Date Custom Field',
      scheduled_date_select_custom_field:
        'Use the following Custom Field as a reference',
      scheduled_date_select_day_moment: 'Send this Email',
      scheduled_date_select_day_moment_tip: '* the selected date arrives.',
      scheduled_date_select_week_days_title:
        'Select the day of the week you want your Emails to be sent',
      scheduled_date_select_week_time: 'Sending hour',
      scheduled_date_select_month_day_title:
        'Select a day of the month you want your Emails to be sent',
      scheduled_date_select_month_day_tip:
        '* An Email will be sent every month on the selected day.',
      scheduled_date_day1: 'Monday',
      scheduled_date_day2: 'Tuesday',
      scheduled_date_day3: 'Wednesday',
      scheduled_date_day4: 'Thursday',
      scheduled_date_day5: 'Friday',
      scheduled_date_day6: 'Saturday',
      scheduled_date_day0: 'Sunday',
      scheduled_date_select_list_title:
        'Choose the List or Segment you want to associate your Email Automation Campaign',
      scheduled_date_select_list_button: 'Select a List or Segment',
      Push_notification_domains_selection_title:
        'Send Push notifications to domain visitors:',
      Domains_Selected: "You've selected",
      Domains_replace_button: 'Replace domain',
      Domains_select_button: 'Select domain',
      Push_notification_campaign_tip:
        'Any doubt about how to create a Push notification Automation?',
      Push_notification_campaign_tip_part2: 'Take a look at the',
      Push_notification_campaign_tip_link_url:
        'https://help.fromdoppler.com/en/how-to-active-and-use-send-push-notification',
      Push_notification_campaign_tip_link_text: 'HELP',
      Push_notification_campaign_title: 'Define the sending type',
      Push_notification_campaign_send_now_title: 'Immediate Send Out',
      Push_notification_campaign_send_now_description:
        'Push notifications will be sent when you click the Start Automation button.',
      Push_notification_campaign_send_scheduled_title: 'Scheduled Send Out',
      Push_notification_campaign_send_scheduled_description:
        'Push notifications will be sent at the day and time you define.',
      Push_notification_campaign_field_date: 'Date:',
      Push_notification_campaign_date_picker_current_text: 'Today',
      Push_notification_campaign_field_hour: 'Hour:',
      Push_name: 'Push Name',
      goto_title: 'What step do you want to connect it with?',
      goto_title_tip:
        'Choose an option from the list below or select a step on the canvas.',
      goto_bottom_detail:
        'Some steps are disabled to avoid creating infinite flows.',
      goto_help_tip: 'If you have questions, you can visit our article',
      goto_help_tip_link:
        'https://help.fromdoppler.com/en/how-to-connect-branches-in-your-automation-flow?utm_source=direct',
      goto_help_tip_link_text: '”How to connect steps in your Automation flow”',
      replicaSetinitConditioMsg:
        'Initial configuration for automation flow needs to be redefined when a replica is done.',
      abandoned_cart: {
        title: 'Set up your Abandoned Cart Automation',
        ecommerce_label: 'E-commerce you want to integrate',
        time_label: 'Send the Email {{time}} after a cart is abandoned',
        wait_label: 'Enter a Subscriber to the Automation after',
        wait_title:
          'Indicate how often the same Subscriber can re-enter the Automation Flow',
        stock_label: 'Exclude out of stock products',
        list_tip:
          'Do you have any doubts about how to create an Abandoned Cart Automation?',
        list_tip_link_url:
          'https://help.fromdoppler.com/en/create-abandoned-cart-automation',
        drop_down_options: {
          option1: 'MercadoShops',
          option2: 'TokkoBroker',
          option3: 'Tiendanube',
          option4: 'Datahub',
          option5: 'Vtex',
          option6: 'PrestaShop',
          option7: 'Shopify',
          option8: 'Magento',
          option10: 'WooCommerce',
          option11: 'easycommerce',
          option14: 'MiTienda',
        },
        drop_down_time_options: {
          option120: '2 hours',
          option360: '6 hours',
          option1440: '24 hours',
        },
        drop_down_wait_options: {
          option0: '0 hours',
        },
      },
      visited_products: {
        title: 'Set up your Product Retargeting Automation',
        ecommerce_label: 'E-commerce you want to integrate',
        time_label:
          'Send the Email {{time}} after the Subscriber visited the product page ',
        wait_label: 'Enter a Subscriber to the Automation after',
        wait_title:
          'Indicate how often the same Subscriber can re-enter the Automation Flow',
        stock_label: 'Excluir productos agotados',
        list_tip:
          'Do you have any doubts about how to create a Product Retargeting Automation?',
        list_tip_link_url:
          'https://help.fromdoppler.com/en/create-product-retargeting-automation',
        drop_down_options: {
          option1: 'MercadoShops',
          option2: 'TokkoBroker',
          option3: 'Tiendanube',
          option4: 'Datahub',
          option5: 'Vtex',
          option6: 'PrestaShop',
          option7: 'Shopify',
          option8: 'Magento',
          option10: 'WooCommerce',
          option11: 'easycommerce',
          option14: 'MiTienda',
        },
        drop_down_time_options: {
          option0: '24 hours',
          option1440: '24 hours',
          option2880: '48 hours',
          option4320: '72 hours',
        },
        drop_down_wait_options: {
          option10080: '1 Week',
          option20160: '2 Weeks',
          option30240: '3 Weeks',
        },
        drop_down_ecommerce_errors: {
          error2:
            "Ouch! You haven't enabled the On-Site Tracking free trial. <a href='/Automation/EditorConfig?idTaskType=0'  class='text--underline' target='_self'>ENABLE IT NOW</a>.",
          error3:
            "Ouch! You haven't enable the On-Site Tracking feature. <a href='/ControlPanel/CampaignsPreferences/SiteTrackingSettings' class='text--underline' target='_self'>ENABLE IT NOW</a>.",
          error4:
            "Ouch! You haven't added and verified the domain of the Website you want to track down. <a href='/ControlPanel/CampaignsPreferences/SiteTrackingSettings' class='text--underline' target='_self'>DO IT NOW</a>.",
        },
      },
      pending_order: {
        title: 'Set up your Pending Payment Automation',
        ecommerce_label: 'E-commerce you want to integrate',
        time_label: 'Send the Email {{time}} after a order is abandoned',
        wait_label: 'Enter a Subscriber to the Automation after',
        wait_title:
          'Indicate how often the same Subscriber can re-enter the Automation Flow',
        stock_label: 'Exclude out of stock products',
        list_tip: 'Do you have any doubts about Pending Payment Automations?',
        list_tip_link_url:
          'https://help.fromdoppler.com/en/how-to-create-pending-payment-automation',
        drop_down_options: {
          option1: 'MercadoShops',
          option2: 'TokkoBroker',
          option3: 'Tiendanube',
          option4: 'Datahub',
          option5: 'Vtex',
          option6: 'PrestaShop',
          option7: 'Shopify',
          option8: 'Magento',
          option10: 'WooCommerce',
        },
        drop_down_time_options: {
          option120: '2 hours',
          option360: '6 hours',
          option1440: '24 hours',
          option2880: '48 hours',
        },
        drop_down_wait_options: {
          option0: '0 hours',
        },
      },
      confirmation_order: {
        title: 'Configure your Campaigns for Successful Payment',
        ecommerce_label: 'E-commerce you want to integrate with',
        list_tip:
          'Do you have any doubt about Automation for Successful Payment?',
        list_tip_link_url:
          'https://help.fromdoppler.com/en/how-to-create-successful-payment-automation',
        drop_down_options: {
          option1: 'MercadoShops',
          option2: 'TokkoBroker',
          option3: 'Tiendanube',
          option4: 'Datahub',
          option5: 'Vtex',
          option6: 'PrestaShop',
          option7: 'Shopify',
          option8: 'Magento',
          option10: 'WooCommerce',
        },
      },
      push_title: 'Define the Push notification content',
      push_message_title: 'Title',
      push_message_body: 'Message',
      push_message_body_desc:
        'Tip. You can use emojis 😃🤩🥳. Emojis count as more than one character over the message maximum allowed.',
      push_message_on_click_link: 'Destination URL (optional)',
      push_uploader_title: 'Image (optional)',
      push_uploader_retry_button: 'retry',
      push_uploader_drag_title: 'Drag here or',
      push_uploader_button: 'Select an image',
    },
    steps: {
      without_recorded: 'NO REGISTERED STEPS',
      all_completed: 'ALL STEPS COMPLETED',
      one_incompleted: 'INCOMPLETE STEP',
      more_incompleted: 'INCOMPLETE STEPS',
      delay_not_defined: 'Undefined Wait',
      delays_not_defined: 'Undefined Waits',
      campaign_not_defined: 'Undefined Email',
      campaigns_not_defined: 'Undefined Emails',
      condition_not_defined: 'Undefined Condition',
      conditions_not_defined: 'Undefined Conditions',
      action_not_defined: 'Undefined Action',
      actions_not_defined: 'Undefined Actions',
      sms_not_defined: 'Undefined Sms',
      smss_not_defined: 'Undefined Sms',
      push_notification_not_defined: 'Undefined Push',
      push_notifications_not_defined: 'Undefined Push',
      goto_not_defined: 'Undefined Go to Step',
      gotos_not_defined: 'Undefined Go to Steps',
    },
    saved: 'Saved',
    saving: 'Saving',
    reports: {
      title: 'Automation Metrics Summary',
      full_report: 'See full Report >>',
      delivered_mails: 'Total Successful Deliveries',
      open_rate: 'Open Rate',
      click_rate: 'Click Through Open Rate',
      last_activity: 'Date of the last registered activity',
      paused_date: 'Paused on',
      stopped_date: 'Stopped on',
      paused_title: 'PAUSED AUTOMATION',
      stopped_title: 'STOPPED AUTOMATION',
      paused_description:
        "Pst! From the edit view you can only modify the content of the Emails in your flow and the values for the Wait times. Once you've made the necessary adjustments, restart your Automation.",
      stopped_description_one:
        'Pst! When reactivating your Automation, <strong>it will start from the top</strong>, as if it were the first time you activate it.',
      stopped_description_two:
        'You can download a Report on your Campaign performance from the Download Center.',
    },
    pause_modal: {
      title: 'Pause Automation',
      description_one:
        "While your Campaign is paused, <strong>new Subscribers can't enter to the flow</strong>",
      description_two:
        'When you restart your Automation, it will resume for those Subscribers who were in the flow, no matter how much time has passed.',
      description_three:
        'You only can modify elements as <strong>Emails and Wait times.</strong>',
      description_four: 'Are you sure you want to pause it?',
      stop: 'YES, PAUSE AUTOMATION',
      cancel: 'NO, MAYBE LATER',
    },
    stop_modal: {
      title: 'Stop Automation',
      description_one:
        'The Subscribers will NOT continue their path through the flow.',
      description_two:
        'You can download a Report on your Campaign performance.',
      description_three:
        '<strong>IMPORTANT:</strong> If you reactivate the Campaign, it will start from the top, as if it were the first time you activate it.',
      description_four: 'Are you sure you want to stop it?',
      stop: 'YES, STOP AUTOMATION',
      cancel: 'NO, MAYBE LATER',
    },
    pause_confirmation_modal: {
      title:
        "Once you've made the necessary adjustments, restart your Automation",
      description:
        'From the edit view you can only modify the content of the Emails in your flow and the values for the Wait times.',
      ok: 'ok',
    },
    no_dynamic_element_modal: {
      title: 'WARNING',
      description_abandoned_cart:
        "You are about to start this Automation without showing elements of your users' Abandoned Cart in any Email.",
      description_visited_products:
        'You are about to start this Automation without showing elements of Products Visited by your users in any Email.',
      description_pending_order:
        'Your Email doesn’t have the <b>Order Detail element</b>, so the information about products with pending payments won’t be shown. Any doubt? Go to <a class="help-text" href="https://help.fromdoppler.com/en/how-to-create-pending-payment-automation" target="_blank">HELP</a>.',
      description_confirmation_order:
        'Your Email doesn’t have the <b>Order Detail element</b>, so the information about products won’t be shown. Any doubt? Go to <a class="help-text" href="https://help.fromdoppler.com/en/how-to-create-successful-payment-automation" target="_blank">HELP</a>.',
      cancel: 'BACK',
      start: 'START ANYWAY',
    },
    Domains_grid: {
      empty_title: "It seems that you haven't actived domains yet",
      empty_description:
        'Do it and then go back to continue editing your Automation.',
      scheduled_title:
        'Select the domains you want to associate with your Automation',
      scheduled_subtitle: 'The listed domains are your active domains.',
      header_domain_column: 'Domains',
    },
  },
  automationTypes: {
    info: {
      title3: 'Scheduled Date',
      description3:
        'Schedule shipments to greet your contacts on their birthday or remind your clients about their payments dues.',
      title1: 'Welcome Email',
      description1:
        'Welcome Subscribers who join your Lists and surprise them with exclusive content. Use this to confirm event registrations too.',
      title5: 'Campaign Activity',
      description5:
        'Program a flow to trigger Emails or actions taking into account the interaction between your Subscribers and your shipments.',
      title4: 'RSS to Email',
      description4:
        "Program Email Campaigns to keep your Subscribers up to date on the latest posts you've published on your blog.",
      title6: 'Website Activity',
      description6:
        'Program Emails customized according to the interactions that users have had with your website and convert them into customers.',
      start6_message: 'You have a verified domain. CREATE YOUR AUTOMATION',
      title7: 'Abandoned Cart',
      description7:
        'Schedule a series of Emails to encourage the users who left items in their cart to complete their purchase.',
      start7_message: 'Your Doppler account has already been integrated with ',
      title8: 'Product Retargeting',
      description8:
        "Encourage users to buy those items they've visited on your E-commerce.",
      start8_message: 'Your Doppler account has already been integrated with ',
      title9: 'Pending Payment',
      description9:
        'Remind about Pending Payments and encourage your visitors to finish transactions.',
      tiendanube_content: 'Now for Tiendanube, <br />soon for everybody!',
      start9_message: 'Your Doppler account has already been integrated with ',
      title10: 'Successful Payment',
      description10:
        'Schedule Emails to notify your customers when you receive their payment.',
      start10_message: 'Your Doppler account has already been integrated with ',
      title11: 'Push Notifications',
      description11:
        'Send alerts with special offers or relevant information to your Website or E-commerce visitors.',
      start11_message:
        'You have at least one verified domain. CREATE YOUR AUTOMATION',
      buy: 'BUY NOW',
      error_message: 'Ouch! There are no verified domains.',
      continue: 'CONTINUE',
      warning_message:
        'Pst! You need to enable the functionality and verify the added domains.',
      demo_message: 'Use it FREE for a limited time.',
      activate: 'ACTIVATE YOUR TRIAL.',
      new_feature: 'New Feature',
      integration: 'FIND OUT THE AVAILABLE INTEGRATIONS.',
      repeated_message:
        'You already have an active Automation. Do you want to integrate your account with another E-commerce?',
      repeated_message_for_unique_available_integration:
        'You already have an Automation flow associated with your store.',
      integration_message:
        'To use this Automation, connect Doppler with your E-commerce.',
      edit_automation: 'EDIT AUTOMATION',
      integration_names_dynamic: {
        message_part2: '{{ecommerceName}}',
        message_part2_separator1: ' and ',
        message_part2_separator2: ', ',
        message_part3: '. CREATE YOUR AUTOMATION',
      },
    },
    automation_task_header: {
      title: 'Define your Automation Campaign Type',
      description:
        'You have different ways to create your Automation Campaigns. You can either choose to generate one or many sendings inside the same Campaign.',
      tip: 'Take advantage of the different Automation Campaigns and choose which one to use based on your goals. Plan a sending flow and activate it.',
    },
    automation_breadcrumb: {
      all_automations: 'All my Automation Campaigns',
      automation_types: 'Automation Types',
      site_behavior: 'Site Behavior',
    },
    modal_trial: {
      title: 'Try On-Site Tracking Automation for FREE',
      description:
        'Target users based on their behavior on your website or E-commerce. Thanks to this feature you can send automatic and 100% personalized Emails to the users who visit a specific page. For example, you can send a discount to users who view a particular product page.',
      title2: 'When does the free trial end?',
      description2:
        'Our goal is that you can see how to use this feature in your business and check its benefits, so for the moment you can use it with no restrictions.',
      title3:
        'What will happen to the Automations created when the free trial ends?',
      description3:
        "They'll remain inactive, and you won't be able to edit them until you hire the special module which includes this service.",
      activateAutomation: 'Activate free trial',
    },
    modal_domains: {
      title:
        'You almost got it! To start using On-Site Tracking Automation first you need to add your domain',
      description:
        "From the Control Panel you can add and verify your Website domain. It's too easy! We also explain to you the process step by step in a <a class='link--default' href='https://help.fromdoppler.com/en/create-onsite-tracking-automation/#enable' target='_blank'>Help Center</a> tutorial.",
      title2: 'Why is it necessary for you to add and verify your domain?',
      description2:
        'Doing that, we can track the pages you determine from your Automation Campaigns.',
      enableDomain: 'Add domain',
    },
  },
  modal_blocked_lists: {
    title:
      'Ouch! This Automation has blocked<br> Lists and/or blocked Segments',
    description:
      "To start it, we suggest to <b>clean your Lists</b> and delete Subscribers that affect its quality. You can also <b>revert the last Subscribers' import</b> you have made in a blocked List. Any doubt? Take a look at our <a class='link--default' href='https://help.fromdoppler.com/en/blocked-lists' target='_blank'>HELP</a>.",
    button_cancel: 'Go later',
    button_action: 'View Lists',
  },
  General_Required_Field: 'Ouch! This field is required.',
  ScheduledTask_AutomationMain_Grid_Pager: 'Show More Results',

  CompleteInformation_Title: 'Fill in the missing contact information',
  CompleteInformation_Subtitle:
    'In order to continue, we need to know a little more about you. Please fill in the missing info in the form below.',
  CompleteInformation_FirstName: 'First Name',
  CompleteInformation_LastName: 'Last Name',
  CompleteInformation_Address: 'Address',
  CompleteInformation_Country: 'Country',
  CompleteInformation_State: 'State/Province',
  CompleteInformation_City: 'City',
  CompleteInformation_PhoneNumber: 'Phone Number',
  CompleteInformation_ZipCode: 'Zip Code',
  CompleteInformation_RequiredMessage:
    "We're sure you already know it. But the fields marked with * are required. Thank you!",
  CompleteInformation_SaveButton: 'Save',
  CompleteInformation_Company: 'Company',
  CompleteInformation_Industry: 'Industry',
  CompleteInformation_IndustryDefault: 'Choose your industry',
  General_Invalid_Field: 'Invalid characters.',
  General_MaxLength_Field:
    "Ouch! You've reached the maximum number of characters.",

  automation_grid_header: {
    title: 'Automation Campaigns',
    description:
      'Here you will find all your Automation Campaigns including the ones that are in draft, ready to send or inactive. ',
    quantity_part1: 'You have created ',
    quantity_part2: ' Campaigns in total.',
    empty_part1: "You haven't created ",
    empty_part2: 'any Campaigns yet.',
    quantity_campaign: ' Campaign.',
    button: 'Create Automation Campaign',
  },
  automation_grid_search: 'Search...',
  automation_grid_headers: {
    status: 'Status',
    type: 'Type',
    name: 'Automation Campaign Name',
    creation_date: 'Created',
    email_sent_amount: 'Sendings',
    actions: 'Actions',
  },
  automation_grid_reports: 'Reports',
  automation_grid_status: {
    draft: 'Draft',
    active: 'Active',
    paused: 'Paused',
    stopped: 'Stopped',
  },
  automation_grid_emtpy: {
    title: 'Welcome to Automation!',
    description:
      'Schedule a series of Emails to be sent automatically when specific criteria are met: the anniversary date of your customers, the subscription to your blog, the Subscribers behavior in relation to previous Campaigns or into each section of your Website or E-commerce.',
    description2:
      'Capture leads, build loyalty and multiply your sales, saving time, effort and money.',
    link_text: 'Learn more about Automation',
    link_url: 'https://help.fromdoppler.com/en/how-to-use-email-automation',
  },
  grid_messages: {
    delete_message:
      'This Campaign <strong>"{{campaignName}}"</strong> will be deleted permanently.  Are you sure?',
    custom_field_deleted:
      'The Date Field selected has been removed. Select another or create a new one to start your Automation.',
  },
  automation_grid_start_automation_errors: {
    error_code_197:
      'Enable the On-Site Tracking functionality to activate the Campaign.',
    error_code_214:
      'You must add a Website to your Automation to active the Campaign.',
    error_code_215:
      'You must verify the Website asociated to your Automation to active the Campaign.',
    error_code_216:
      'This functionality is enabled only for accounts with Paid Plan.',
  },
  automation_replicate: {
    modal: {
      title: 'Choose the Automation type',
      description:
        'Select the Automation type for the replica. After this, you can edit all the elements and configure new conditions.',
      dropdown_title: 'Replica’s Automation type',
      cancel_button: 'Cancel',
      submit_buttton: 'Confirm',
      warning_one_option:
        'Automation type change is not allowed for this replica.',
    },
  },
  General_Required_Field: 'Ouch! This field is required.',
  ScheduledTask_Reports_Title: 'Delivery Rate and Summary',
  ScheduledTask_Reports_LinkToList: 'Email Automation Campaigns List',
  ScheduledTask_Reports_Subtitle:
    'The following report provides an overall view of your Campaign performance.',
  ScheduledTask_Reports_LastWeek: 'Last week',
  ScheduledTask_Reports_LastMonth: 'Last month',
  ScheduledTask_Reports_LastYear: 'Last year',
  ScheduledTask_Reports_All: 'From the beginning ',
  ScheduledTask_Reports_Grid_Header_SentEmails: 'Sent Emails',
  ScheduledTask_Reports_Grid_Header_OpenEmails: 'Opened Emails',
  ScheduledTask_Reports_Grid_Header_TotalClicks: 'Total Clicks',
  ScheduledTask_Reports_Grid_Header_Unsubscribe: 'Unsubscribe',
  ScheduledTask_Reports_Grid_Title: 'Daily Grid',
  ScheduledTask_Reports_Grid_Subtitle:
    "Discover a detailed daily grid of your Email Automation Campaign's most valuable information.",
  ScheduledTask_Reports_Grid_Day: 'Date',
  ScheduledTask_Reports_Grid_Sent: 'Sent',
  ScheduledTask_Reports_Grid_Delivered: 'Delivered',
  ScheduledTask_Reports_Grid_Open: 'Opened',
  ScheduledTask_Reports_Grid_Clicks: 'Clicks',
  ScheduledTask_Reports_Grid_Unsubscriber: 'Unsubscribed',
  ScheduledTask_Reports_Grid_Shared: 'Shared',
  ScheduledTask_Reports_Grid_CTOR: 'CTOR',
  ScheduledTask_Reports_Filter_Action: 'Filter by Campaign',
  ScheduledTask_Reports_CancelFilter: 'Cancel',
  ScheduledTask_Reports_Filter: 'Filter',
  ScheduledTask_Reports_GraphicReport: 'Graphics',
  ScheduledTask_Reports_DetailReport: 'Daily grid',
  ScheduledTask_Reports_Open: 'Open',
  ScheduledTask_Reports_NotOpen: 'Not Opened',
  ScheduledTask_Reports_Bounced: 'Bounces',
  ScheduledTask_Reports_MenuOpened: 'Opened',
  ScheduledTask_Reports_MenuNotOpened: 'Not Opened',
  ScheduledTask_Reports_MenuBounced: 'Bounced',
  ScheduledTask_Reports_ClickRate: 'Click Through Open Rate:',
  ScheduledTask_Reports_DonutData_Title: 'Campaign Summary',
  ScheduledTask_Reports_DonutData_SentEmails: 'Sent Emails',
  ScheduledTask_Reports_DonutData_DeliveredEmail: 'Successful Deliveries',
  ScheduledTask_Reports_DonutData_Resent: 'Times Forwaded',
  ScheduledTask_Reports_DonutData_Opens: 'Total Times Opened',
  ScheduledTask_Reports_DonutData_LastOpen: 'Last Opened Date',
  ScheduledTask_Reports_DonutData_UniqueClick: 'Unique Clicks',
  ScheduledTask_Reports_DonutData_UniqueOpen: 'Unique Opens',
  ScheduledTask_Reports_DonutData_TotalClick: 'Total Clicks',
  ScheduledTask_Reports_DonutData_LastClick: 'Last Click Date',
  ScheduledTask_Reports_DonutData_AmountRemoved: 'Total Unsubscribers',
  ScheduledTask_Summary_Subtitle_FrequencyType1_Part0:
    'This sending starts when the following criteria is reached:',
  ScheduledTask_Summary_Subtitle_FrequencyType2_Part1: 'Every {{dayPerWeek}}',
  ScheduledTask_Summary_Subtitle_FrequencyType3_Part1:
    'Day {{dayPerMonth}} of each month',
  ScheduledTask_Reports_Opens_Title: 'Openings Report',
  ScheduledTask_Reports_Opens_Subtitle:
    "In the following chart you'll be able to visualize how many openings your Campaign or each Email got, on the selected date range.",
  ScheduledTask_Reports_Clicks_Title: 'Clicks Report',
  ScheduledTask_Reports_Clicks_Subtitle:
    'Visualize how many Clicks your Campaign or each Email got, on the selected date range.',
  ScheduledTask_Summary_Day_Sunday: 'Sunday',
  ScheduledTask_Summary_Day_Monday: 'Monday',
  ScheduledTask_Summary_Day_Tuesday: 'Tuesday',
  ScheduledTask_Summary_Day_Wednesday: 'Wednesday',
  ScheduledTask_Summary_Day_Thursday: 'Thursday',
  ScheduledTask_Summary_Day_Friday: 'Friday',
  ScheduledTask_Summary_Day_Saturday: 'Saturday',
  ScheduledTask_Summary_Day_And: 'and',
  ScheduledTask_Reports_OpenRate: 'Delivery Rate',
  ScheduledTask_Reports_NoOpens: 'Collecting Data',
  ScheduledTask_Reports_Funnel_Title: 'Conversion Funnel',
  ScheduledTask_Reports_Funnel_Subtitle:
    "Analyzes your Subscribers' path to your ultimate goal.",
  ScheduledTask_Reports_Engagement_Title: 'Engagement',
  ScheduledTask_Reports_Engagement_Subtitle:
    'Discover Subscribers who show most interest in your Campaigns.',
  ScheduledTask_Reports_OpenGraph_tooltip: 'Openings',
  ScheduledTask_Reports_Engagement_Points: 'Score',
  ScheduledTask_Reports_Engagement_Email: 'Email',
  ScheduledTask_Reports_Engagement_Name: 'Name',
  ScheduledTask_Reports_Engagement_DownloadList: 'Download List',
  ScheduledTask_Reports_Graphic_Subtitle:
    "In the following Report you'll be able to measure your Campaign's delivery, open and bounce rate.",
  ScheduledTask_Reports_Graphic_EmptyEngagement:
    'There is no activity in the Engagement Report.',
  ScheduledTask_Reports_FunnelOpen: 'Opened',
  ScheduledTask_Reports_Total_Sms: 'SMS Sent',
  ScheduledTask_Reports_Delivered_Sms: 'Recipients',
  ScheduledTask_Reports_Reached_Subscriptors: 'SMS Delivered',
  ScheduledTask_Reports_Not_Reached_Subscriptors: 'SMS Not Delivered',
  ScheduledTask_Reports_Sms_Link:
    'Download the full Report of the selected period >>',
  ScheduledTask_Sms_Title: 'SMS Delivery Report',
  ScheduledTask_Reports_Sms_Country_Title: 'Results by country',
  ScheduledTask_Reports_Sms_reports_export_title: 'Report Request',
  ScheduledTask_Reports_Sms_reports_export_subtitle:
    'Please select the Excel format in which you wish to receive the report',
  ScheduledTask_Reports_Sms_reports_export_check:
    'I want to receive a notification when the file is ready to download.',
  ScheduledTask_Reports_Sms_reports_export_button: 'Send Request',
  xls_2003_option: 'XLS Office 2003',
  xlsx_2007_option: 'XLSX Office 2007',
  ScheduledTask_Reports_Sms_reports_export_label:
    'Email where we will send the download link:',
  ExportReports: {
    title: 'Request Approved',
    description:
      'The system is processing the information. An email will be sent to your email account with the download link when this process finished.',
    description2:
      'If you want to know the status of this and other requests please go to the Download Center page.',
    buttonLabel: 'Go to Download Center',
  },
  ScheduledTask_Reports_Sms_title: 'SMS Campaigns',
  ScheduledTask_Reports_Sms_subtitle:
    'Check SMS sent, delivered and not delivered in full and by country.',
  ScheduledTask_Reports_Campaigns_title: 'Email Campaigns',
  ScheduledTask_Reports_Push_title: 'Push Notifications Campaigns',
  ScheduledTask_Push_Title: 'Push Notifications Delivery Report',
  ScheduledTask_Reports_Push_subtitle:
    'Check Push Notifications sent, delivered and not delivered in full and by country.',
  ScheduledTask_Reports_Push_Reached_Subscriptors: 'Delivered',
  ScheduledTask_Reports_Push_Not_Reached_Subscriptors: 'Not Delivered',
  ScheduledTask_Reports_Total_Push: 'Sent',
  ScheduledTask_Reports_Push_Link:
    'Download the full Report of the selected period >>',
  ScheduledTask_Export_Automation_Campaign_Title:
    'Report by automation campaign',
  ScheduledTask_Export_Automation_Campaign_Description:
    'You will be able to visualize metrics related to your automation campaigns, such as deliveries, openings, bounces, and clicks.',
  ScheduledTask_Export_Automation_Subscriber_Title: 'Report by contact',
  ScheduledTask_Export_Automation_Subscriber_Description:
    'You will be able to visualize the metrics related to your automation campaigns detailed by contact, the number of openings, and clicks.',
  ScheduledTask_Export_Automation_Download: 'Download',
  modal_maxsubscribers: {
    form_help: '* Want to know why we are asking for this info?',
    form_help_link_text: 'Know more here',
    title: "Validate your Subscribers' Origin",
    subtitle:
      "Please, provide us with your contact information so we can complete this action.Complete the following Form so we can validate your Subscribers' origin. It will only take a few minutes. Thank you, we'll contact you soon!",
    info_text:
      '** We need to validate the data you provided.This might take a while to process. Thanks for your patience.',
    request_processed:
      'Perfect! We are validating the origin of your Subscribers. Please, keep in mind this process might have a little delay.',
  },
  modal_upgrade_plan: {
    label_plans: 'Choose your new Plan',
    label_message:
      'Tell us more about your needs and we’ll create a perfect Plan for you',
    title: 'Update your Monthly Plan',
    title_top_plan: 'Ask for an update of your Plan',
    success_message: 'Done! Your request has been sent',
    button_update: 'Update Plan',
    subtitle_upgrade_plan:
      'Choose your new Plan and start using it right now. No extra validations needed!',
  },
  validation_messages: {
    maxlength: "Ouch! You've reached the maximum number of characters.",
    minlength: 'Ouch! The number is too short.',
    required: 'Ouch! This is a required field.',
    required_checkbox: 'Ouch! You must select at least one option.',
    number_pattern: 'Invalid Number.',
    number_pattern_3digits:
      'Ouch! The number you entered is invalid. Please type a value between 0 and 999.',
    email: 'Ouch! The Email address is invalid.',
    url: 'Ouch! The URL you entered is invalid.',
    connection_error:
      "Ouch! There's been a problem with the connection. Please try again later.",
    rss_invalid:
      "Ouch! We're not able to process the selected RSS feed. Check it here.",
    rss_invalid_check: 'E.g.: ',
    rss_invalid_link: 'https://validator.w3.org/feed/',
    invalid_date_time:
      'Ouch! Something is wrong. The date and time are not valid.',
    duplicated_email:
      "You've entered your confirmation Email address. We promise to let you know!",
    inexistent_field: "Ouch! Selected Field doesn't exist.",
    domain: "Ouch! The domain entered doesn't have the correct format.",
    read_only_input: 'Ouch! Stop the campaign to edit',
    paused_input: "This element isn't enable for editing.",
    sms_pattern: 'Ouch! The Sms is invalid.',
    phone_pattern: 'Ouch! The Phone number is invalid.',
    phone_pattern_too_long: 'Ouch! The phone number is too long.',
    phone_pattern_too_short: 'Ouch! The phone number is too short.',
    phone_funds_insuficient:
      "Ouch! You don't have enough funds to send this test.",
    phone_generic_error: 'Ouch! An error has occurred, please try again later.',
    phone_country_not_active:
      "Ouch! {{countryName}} isn't active in your SMS Dashboard.",
    invalid_cuit: 'Invalid CUIT.',
    invalid_nit: 'Invalid NIT.',
    invalid_rfc: 'Invalid RFC.',
    exp_date: 'Ouch! The expiration date entered is not valid.',
    generic_error_msg: 'Oops! Something went wrong. Please try again.',
    url_pattern_error_message: '¡Ouch! The URL is invalid.',
    https_url_pattern_error_message:
      '¡Ouch! Enter a URL that begins with https://',
  },
  footer: {
    allRightReserved: 'All rights reserved',
    iso: 'ISO Quality Certification 9001:2008',
    privacy: 'Privacy Policy & Legals.',
    privacy_link: 'https://fromdoppler.com/en/privacy-policy',
  },
  form_labels: {
    email: 'Email',
    name: 'Name',
    lastname: 'Last name',
    fullname: ' First Name and Last Name',
    phone: 'Phone',
    address: 'Address',
    zip_code: 'Zip Code',
    country: 'Country',
    state: 'State',
    city: 'City',
    document_number: 'ID Number',
    document_type: 'ID Type',
    arg_dni: 'DNI/CUIL',
    arg_dni_clarification: '(Consumidor Final)',
    payment_ways: {
      credit_card: {
        type: 'Credit Card Type',
        number: 'Card Number',
        exp_date: 'Expiration Date',
        cvv: 'Verification Code',
      },
      transfer: {
        consumer_type: 'Consumer Type',
        cuit: 'CUIT',
        company_name: 'Company Name',
        rfc: 'RFC',
        cdfi: 'Use of CFDI',
        payment_method: 'Payment Method',
        payment_type: 'Type of Payment',
        bank_name: 'Bank Name',
        last_4_digits: 'Last 4 numbers of your account',
        NIT: 'NIT',
        ResponsableIVA: 'Responsable IVA',
      },
    },
  },
  button_cancel: 'Cancel',
  button_send: 'Send',
  button_accept: 'Accept',
  button_yes: 'Yes',
  button_no: 'No',
  help_link_text: 'HELP',
  actions: {
    back: 'Back',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    save: 'Save',
    configure: 'Set up',
    add: 'Add',
    copy: 'Copy',
    verify: 'Verify',
    duplicate: 'Replicate',
    publish: 'Distribution Types',
    start: 'Start',
    enable: 'Enable',
    buy: 'Buy Now',
    close: 'Close',
    understand: 'Ok',
    connect: 'Connect',
    disconnect: 'Disconnect',
    activate_now: 'ACTIVATE IT NOW.',
    buy_now: 'BUY NOW.',
    coming_soon: 'Coming soon',
    replicate_automation: 'Replicate Automation',
    replicate_automation_coming_soon: 'Replicate Automation (coming soon)',
    replicate_automation_disabled: "It's not possible to replicate",
  },
  modal_process_file: {
    title: 'Remove multiple Subscribers at once',
    subtitle:
      "Import a file with the Emails you want to remove from your Lists. Attention! Once removed, if you wish to add them back, you'll have to ask for their approval. ",
    button_remove_subs: 'Remove Subscribers',
    processed_title: "The Subscribers you've selected are being removed",
    processed_subtitle:
      'We will send a report to your email when the process is completed.',
    button_processed_add: 'Upload a new List',
    import_dragAndDrop_description:
      "You can choose between a comma-separated file (.csv) or a plain text one (.txt). If it's too big, you can convert it into a .zip. Also, if you have doubts we can help you out! Just press ",
    import_dragAndDrop_InvalidFileType:
      'Oops! Keep in mind that your file must be a .csv, .txt. or .zip',
    helpLink: 'http://help.fromdoppler.com/?lang=en',
    dragAndDrop_fallbackMsg:
      "Your browser does not support drag'n'drop file uploads.",
    dropButton_ready: 'Browse for your file',
    dropMessage_ready: 'Drag and drop your <b>File</b> here or ',
    dropMessage_importing: 'Importing <b>{{fileName}}</b>',
    dropMessage_imported: "You've imported <b>{{fileName}}</b>",
    dropButton_importedWithError: 'Import another file',
    errorMessage_maxFiles: 'Ouch! You cannot upload 2 files at the same time.',
    errorMessage_fileSize:
      'Oops! The size of your file is larger than fileSize MB',
    dropButton_imported: 'Replace file',
    selected_file: "You've selected <b>{{fileName}}</b>",
  },
  empty_filter: 'No Filter',
  empty_label: 'No Label',
  empty_search: 'Ups! No matches found for searched criteria.',
  control_panel: {
    dkim: {
      title: 'DKIM & SPF setup',
      subtitle:
        'Activate this technology to improve the security of your Emails and avoid the Spam Folder. Any questions? Press ',
      subtitle_link_text: 'Help',
      subtitle_link:
        'https://help.fromdoppler.com/en/how-to-enable-domainkeys-dkim',
      grid_description:
        'Add all the domains that you could use in the From-Email of your Campaigns.',
      grid_amount_of_domains_allowed_part1: 'You currently have ',
      grid_amount_of_domains_allowed_part2: '{{domainsCount}} domains.',
      grid_amount_of_domains_allowed_part3:
        'Remember that you can add up to {{ maxDomains }}.',
      grid_title: 'Domains Admin',
      create_button: 'Add domain',
      grid_columns: {
        domain_name: 'Domain',
        domain_status: 'Status',
        is_default: 'Default',
        dkim_state: 'DKIM Status',
        spf_state: 'SPF Status',
        validation_date: 'Last validation',
        confirmed: 'OptIn',
        actions: 'Actions',
      },
      no_domains: "You haven't added any domains yet.",
      grid_states: {
        active: 'Active',
        inactive: 'Inactive',
        missing_user_conf: 'Pending',
        waiting_admin_validation: 'Verifying.',
      },
      validation_states: {
        'message-1': 'Verified with error. ',
        'message-2': 'Verified. ',
        'message-3': 'Not configured. ',
        'message-4': 'Pending. ',
        'description-1':
          "Make sure you <br/> have completed all the configuration <br/> steps correctly. <a class='help' target='_blank' href='https://help.fromdoppler.com/en/how-to-enable-domainkeys-dkim'>HELP</a>.",
        'description-2': 'You already can start to <br/> use your domain.',
        'description-3':
          "You haven't set up <br/> your {{protocol}}. Click on <span class='icon-configure'></span> and follow <br/> the steps shown there.",
        'description-4':
          "You haven't verified your <br/> domain yet.  Click on the \"Verify\"  <br/> button. Any  doubts? Press <a class='help' target='_blank' href='https://help.fromdoppler.com/en/how-to-enable-domainkeys-dkim'>HELP</a>.",
        'description-5':
          "Ouch! The domain of the Website you want to track hasn't been verified yet.",
        verifying: "We're validating <br/> the domain availability.",
      },
      delete_message:
        'This Domain <strong>"{{domainName}}"</strong> will be deleted permanently.  Are you sure?',
      add_domain: {
        title: 'Add a new domain',
        subtitle:
          'Enter the domain you want to add. Remember must have the following format: yourwebsite.com',
        domain: '* Domain',
        domain_created:
          "You've requested your DKIM. We're validating all your submitted data for the domain <strong>{{domain}}</strong>. We'll send you an Email when it's done.",
        domain_duplicated_other_user:
          'Ouch! This domain <strong>{{domain}}</strong> is being used by another user. We will verify your request and notify you via Email how to proceed.',
        duplicated: 'Ouch! The domain has been previously added.',
        domain_belongs_to_other:
          "Ouch! You can't add domains that belong to others. <br/>Try again with one of your own.",
      },
      configure_domain: {
        title: 'Set up the domain',
        dkim_title: 'DKIM',
        dkim_subtitle:
          "Access to your hosting provider's DNS settings and enter your record name and public key. Your DKIM won't work until you complete this step. Any questions? Just press ",
        dkim_help_link:
          'https://help.fromdoppler.com/en/how-to-enable-domainkeys-dkim/',
        dkim_selector: 'Record name',
        dkim_public_key: 'Public Key',
        spf_title: 'SPF',
        spf_subtitle:
          "Copy the SPF record and also add it to your hosting provider's configuration.",
        spf_field: 'SPF Record',
      },
    },
    integrations: {
      connection_issues: {
        title: 'Resolve connection issues',
        subtitle: 'We find some issues in the connection between Doppler and',
        list_title: 'Please, verify that:',
        text_list_1: 'Your account is currently active.',
        text_list_2: 'The tool API works correctly.',
        text_list_3: 'All permissions are enabled.',
        text_list_4:
          'You may also contact the developers of the integrated tool to identify some other reasons.',
        last_connection_text: 'First connection issue date:',
        days_to_disconnect_plural_1: 'If the problem continues during the next',
        days_to_disconnect_plural_2:
          "days, we'll have to disconnect it. We'll notify you if we do it.",
        days_to_disconnect_singular:
          "If the problem continues, we’ll have to disconnect it tomorrow. We'll notify you if we do it.",
      },
    },
  },
  grid: {
    headers: {
      status: 'Status',
      name: 'Name',
      type: 'Type',
      creation_date: 'Creation Date',
      actions: 'Actions',
      country: 'Country',
    },
    search: 'Search...',
    convertion_rate_tooltip:
      '% of Users that submitted the Form out of \nall unique people who visited it.',
  },
  status: {
    draft: 'Draft',
    send: 'Published',
    publish_with_changes: 'Unpublished changes',
  },
  header: {
    availables: 'availables',
    enabled: 'ENABLED',
    plan_emails: 'Emails sent',
    plan_prepaid: 'Premium Plan by Credits',
    plan_suscribers: 'Subscribers',
    profile: 'Profile:',
    send_emails: 'Send of Emails',
    send_request: 'REQUEST SENT',
    tooltip_help:
      "We're making a perfect Plan for your business. We'll contact you soon!",
  },
  'confirmation-upgrade-plan-popup': {
    title: 'Done!',
    subtitle_subscribers:
      'You have just hired a new Monthly Plan to send unlimited Campaigns up to <b>{{subscribersNumber}} Contacts.</b> We’ll send you an email with more details about the new Plan.',
    subtitle_high_volumen:
      'You have just hired a new Monthly Plan to send unlimited Campaigns up to <b>{{subscribersNumber}} Emails.</b> We’ll send you an email with more details about the new Plan.',
  },
};
