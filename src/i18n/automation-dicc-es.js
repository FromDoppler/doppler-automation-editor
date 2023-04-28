var automation_es_translations = {
  General_Required_Field: '¡Ouch! Este es un campo requerido.',
  ScheduledTask_AutomationMain_Grid_Pager: 'Mostrar mas resultados',
  CompleteInformation_Title: 'Completa la información faltante',
  CompleteInformation_Subtitle:
    'Para continuar, necesitamos saber más sobre ti. Por favor completa la información faltante en el siguiente Formulario.',
  CompleteInformation_FirstName: 'Nombre',
  CompleteInformation_LastName: 'Apellido',
  CompleteInformation_Address: 'Dirección',
  CompleteInformation_Country: 'País',
  CompleteInformation_State: 'Estado/Provincia',
  CompleteInformation_City: 'Ciudad',
  CompleteInformation_PhoneNumber: 'Teléfono',
  CompleteInformation_ZipCode: 'Código Postal',
  CompleteInformation_RequiredMessage:
    'Estamos seguros que ya lo sabes. Pero los campos con * son requeridos. ¡Gracias!',
  CompleteInformation_SaveButton: 'Guardar',
  CompleteInformation_Company: 'Empresa',
  CompleteInformation_Industry: 'Industria',
  CompleteInformation_IndustryDefault: 'Selecciona tu industria',
  General_Invalid_Field: '¡Ouch! El dato ingresado no es válido.',
  General_MaxLength_Field:
    '¡Ouch! Has alcanzado la cantidad máxima de caracteres.',

  automation_grid_header: {
    title: 'Campañas de Automation',
    title1: 'Campañas del Nuevo Automation',
    description:
      'Aquí encontrarás todas tus Campañas de Automation ya sea que estén en borrador, pausadas o activas. ',
    quantity_part1: 'Actualmente tienes ',
    empty_part1: 'Actualmente no tienes ',
    empty_part2: 'ninguna Campaña.',
    quantity_part2: '  Campañas.',
    quantity_campaign: ' Campaña.',
    button: 'Crear Campaña de Automation',
  },
  automation_grid_search: 'Buscar...',
  automation_grid_headers: {
    status: 'Estado',
    type: 'Tipo',
    name: 'Nombre Campaña Automation',
    creation_date: 'Creación',
    email_sent_amount: 'Envíos',
    actions: 'Acciones',
  },
  automation_grid_reports: 'Reportes',
  automation_grid_status: {
    draft: 'Borrador',
    active: 'Activo',
    paused: 'Pausado',
    stopped: 'Detenido',
  },
  automation_grid_emtpy: {
    title: '¡Bienvenido a Automation!',
    description:
      'Programa una serie de Emails para que se envíen automáticamente cuando se cumplan criterios específicos como por ejemplo la fecha de aniversario de tus clientes, la suscripción a tu Blog, la interacción con tus Campañas anteriores o la navegación por tu Sitio Web o Tienda Online.',
    description2:
      'Capta Suscriptores, fideliza y multiplica tus ventas, ahorrando tiempo, esfuerzo y dinero.',
    link_text: 'Aprende más sobre Automation',
    link_url: 'https://help.fromdoppler.com/es/como-utilizar-email-automation/',
  },
  grid_messages: {
    delete_message:
      'La Campaña <strong>"{{campaignName}}"</strong> se eliminará permanentemente. ¿Estás seguro?',
    custom_field_deleted:
      'El Campo Fecha elegido ha sido removido. Selecciona otro o crea uno nuevo para iniciar tu Automation.',
  },
  automation_grid_start_automation_errors: {
    error_code_197:
      'Habilita la funcionalidad de Seguimiento en Sitio para activar la Campaña.',
    error_code_214:
      'Agrega un Sitio Web a tu Automation para activar la Campaña. ',
    error_code_215:
      'Verifica el Sitio Web asociado a tu Automation para poder activar la Campaña.',
    error_code_216:
      'Esta funcionalidad está habilitada solo para cuentas con Plan Pago.',
  },
  automation_replicate: {
    modal: {
      title: 'Elige el tipo de Automation',
      description:
        'Selecciona el tipo de Automation de la réplica. Luego podrás editar todos los elementos y configurar nuevas condiciones.',
      dropdown_title: 'Tipo de Automation de la réplica',
      cancel_button: 'Cancelar',
      submit_buttton: 'Confirmar',
      warning_one_option:
        'Esta réplica no permite cambiar el tipo de automation.',
    },
  },
  automation_editor: {
    date_format: 'dd/MM/yyyy',
    breadcrumb: {
      placeholder: 'Automation sin nombre',
      scheduled_date: 'Fechas Programadas: ',
      site_behavior: 'Comportamiento en Sitio: ',
      subscription_list: 'Suscripción a Listas: ',
      rss_to_email: 'Envío de RSS: ',
      campaign_behavior: 'Comportamiento en Campaña: ',
      doppler_tip_part1:
        'Selecciona un nombre fácil de identificar. Por ejemplo, puedes llamarla ',
      doppler_tip_part2: 'Campaña saludo de cumpleaños clientes.',
      exit_editor: 'Salir del Editor',
      exit_option1: 'Campañas',
      exit_option2: 'Listas',
      exit_option3: 'Automation',
      exit_option4: 'Panel de Control',
      exit_option5: 'Inicio',
      abandoned_cart: 'Carrito Abandonado: ',
      visited_products: 'Producto Visitado: ',
      pending_order: 'Pago Pendiente: ',
      confirmation_order: 'Pago Confirmado: ',
      push_notification: 'Notificaciones Push: ',
    },
    buttons: {
      exit: 'Salir y editar luego',
      back_to_editor: 'Volver al Flujo de Automation',
      confirm: 'Confirmar',
      confirm_selection: 'Confirmar la selección',
      start_campaign: 'Iniciar Automation',
      start_campaign_warning: 'Iniciar Automation de todos modos',
      stop_campaign: 'Detener Automation',
      skip_selection: 'Saltear la selección ',
      pause_campaign: 'Pausar Automation',
      restart_campaign: 'Reiniciar Automation',
      build_campaign: 'Construir Automation',
      reactivate_campaign: 'Reactivar Automation',
    },
    canvas: {
      action_placeholder: 'Define la Acción',
      action_list_placeholder: 'Asociar Suscriptor a la Lista ',
      action_resend_email_palceholder: 'Reenviar email',
      action_remove_suscriber_placeholder: 'Desasociar Suscriptor de la Lista',
      action_change_field_placeholder: 'Modificar el Campo',
      action_change_field_with_value: 'con el valor',
      delay_icon: 'Espera',
      campaign_icon: 'Email',
      campaign_placeholder: '¿Nombre de tu Email?',
      condition_icon: 'Condición',
      condition_placeholder: 'Define los criterios de tu Condición ',
      action_icon: 'Acción',
      add_step_title: 'Añade un paso a tu Flujo de Automation',
      tip_add_element:
        'Comienza a definir los pasos <br />de tu Flujo de Automation',
      tip_initial_condition:
        'Configura el inicio del Flujo desde el menú lateral',
      wait_time_part1: 'Esperar',
      campaign_aspects: 'Define la información de tu envío',
      right_now: 'Inmediatamente',
      time_placeholder: 'tiempo',
      sms_icon: 'Sms',
      sms_placeholder: 'Define tu Sms',
      sms_part1: 'Enviar al telefono',
      sms_part2: 'el mensaje de texto',
      sms_new_step_not_credit:
        "No tienes suficiente saldo para enviar SMS.<br><a target='_self' href='/ControlPanel/AccountPreferences/GetSmsConfiguration?'>Haz click aquí</a> para realizar una recarga y poder iniciar tu Automation.",
      abandoned_cart_aspects: 'Define la información de tu envío',
      push_icon: 'Push',
      push_placeholder: 'Define el contenido de la notificación Push',
      push_title_preview: 'Título: ',
      push_body_preview: ' Mensaje: ',
      goto_step_placeholder: 'Selecciona el paso que quieres conectar',
      goto_step_connection_label: 'Conexión',
      goto_icon: 'Conectar',
      goto_tooltip_invalid_connection_to_goto:
        'Elige otro tipo de paso. <br /> No puedes vincular dos “Conectar”',
      goto_tooltip_infinite_flow_generation:
        'Elige otro paso. <br /> Si lo conectaras con este, crearías un flujo infinito.',
    },
    components: {
      initial_condition: {
        scheduled_date: {
          canvas: {
            and: ' y',
            day_month: {
              intro: 'El envío se realizará el día ',
              of_the_month: ' del mes,',
            },
            day_week: {
              intro_single: 'El envío se realizará el día ',
              intro_plural: 'El envío se realizará los días ',
            },
            day_year: {
              after: ' después',
              before: ' antes',
              criteria_are_met: ' que se cumplan los siguientes criterios ',
              day: ' día',
              days: ' días',
              intro: 'El envío se realizará ',
              intro_single:
                'El envío se realizará cuando se cumpla el criterio ',
              intro_plural:
                'El envío se realizará cuando se cumplan los siguientes criterios ',
              of_the_day: ' del día de ',
            },
            hour: 'a la ',
            hours: 'a las ',
          },
          custom_birthday: 'Cumpleaños',
          default_part1: 'Comenzar el envío el día',
          default_part2: 'a la/s HH:MM.',
          day_moment_after: 'Después',
          day_moment_before: 'Antes',
          day_moment_now: 'El mismo día',
        },
        site_behavior: {
          canvas: {
            intro: 'Un Suscriptor ha visitado ',
            at_least: ' al menos',
            more_times: 'veces',
            separator: 'la URL ',
            more_urls: ' ...',
            visited: ' ha visitado ',
            no_visited: ' no ha visitado ',
            operator_and: ' y',
            operator_or: ' o',
            a_subscriber: 'Un Suscriptor',
          },
          panel: {
            title:
              "Define la o las URL's de las páginas sobre las que deseas realizar el seguimiento de comportamiento",
            title2:
              'Indica cada cuánto tiempo un mismo Suscriptor puede volver a ingresar al Flujo de Automation',
            description:
              'Esto es importante si quieres evitar que un Suscriptor reciba el mismo Email cada vez que visita tu sitio web.',
            times_label: 'Ingresar un Suscriptor al Flujo de Automation',
            times_value0: 'Una única vez',
            times_value1: 'Una vez cada 3 meses',
            times_value2: 'Una vez cada 6 meses',
            url: '*URL',
            url_tooltip:
              'Incluye un * al final de la URL de tu sitio: fromdoppler.com/* para realizar el seguimiento de todas sus páginas.',
            url_tip:
              '¡Pst! ¿Quieres realizar el seguimiento de todas las páginas de tu sitio? Mira el tip',
            validation_messages: {
              domain_non_registered:
                '¡Ouch! El dominio ingresado no ha sido registrado.',
              domain_non_registered_link: 'AGRÉGALO AHORA',
              domain_non_verified:
                '¡Ouch! El dominio ingresado no ha sido verificado.',
              domain_non_verified_link: 'HAZLO AHORA.',
              duplicated_domain:
                '¡Ouch! El dominio ha sido agregado anteriormente.',
              url_has_parameters:
                '¡Ouch! La URL ingresada posee parámetros que no pueden ser procesados por el sistema. Intenta quitar los caracteres ubicados después del ?',
            },
            placeholder: 'URL',
            visited_page: 'Visitó la página',
            visited_count: 'vez / veces',
            verification_time_title:
              'Define cuándo quieres que verifiquemos si la Condición se ha cumplido',
            verification_time_description:
              'Pasado ese plazo, Doppler volverá a analizar si la Condición se cumplió. ¿Necesitas ayuda? Presiona ',
            verification_time: 'Tiempo de verificación',
            verification_time_placeholder: 'Ejemplo: 24',
          },
          tip_normal: 'Presiona',
          tip_strong:
            '¿Tienes dudas sobre cómo crear tu Automation por Comportamiento en Sitio?',
          tip_url:
            'https://help.fromdoppler.com/es/crear-automation-por-comportamiento-en-sitio',
        },
        subscription_list: 'Un Suscriptor ha ingresado a la Lista ',
        behavior: {
          scheduled_day: 'Realizar el envío ',
          scheduled_day_part2: 'el ',
          hours_pl: ' a las ',
          hours_sg: ' a la ',
          lists_pl: ' a las Listas ',
          lists_sg: ' a la Lista ',
          inmediately_send: 'Realizar el envío ',
          inmediately_frequency: 'inmediatamente',
          all_subscribers: ' a todos mis Suscriptores.',
        },
        days_of_the_week: {
          sunday: 'Domingo',
          monday: 'Lunes',
          tuesday: 'Martes',
          wednesday: 'Miércoles',
          thursday: 'Jueves',
          friday: 'Viernes',
          saturday: 'Sábado',
        },
        months_of_the_week: {
          january: 'Enero',
          february: 'Febrero',
          march: 'Marzo',
          april: 'Abril',
          may: 'Mayo',
          june: 'Junio',
          july: 'Julio',
          august: 'Agosto',
          september: 'Septiembre',
          october: 'Octubre',
          november: 'Noviembre',
          december: 'Diciembre',
        },
        today: 'Hoy',
        abandoned_cart: {
          main_description:
            'El suscriptor abandonó el carrito hace <strong>{{time}}</strong>',
        },
        visited_products: {
          main_description:
            'El Suscriptor visitó la página de producto hace <strong>{{time}}</strong>',
        },
        pending_order: {
          main_description:
            'El Suscriptor realizó la Compra hace <strong>{{time}}</strong> y tiene el Pago Pendiente.',
        },
        confirmation_order: {
          main_description: 'El pago se ha registrado correctamente',
        },
        push_notification: {
          scheduled_day: 'Hacer un ',
          scheduled_day_frequency: 'Envío Programado',
          scheduled_day_part2: 'el ',
          hours_pl: ' a las ',
          hours_sg: ' a la ',
          domains_pl: ' a los dominios ',
          domains_sg: ' al dominio ',
          inmediately_send: 'Hacer un ',
          inmediately_frequency: 'Envío Inmediato',
          and: ' y',
          tip_initial_condition:
            'Configura el inicio del Automation desde el menú lateral',
        },
        panel: {
          validation_messages: {
            trial_expired_error:
              'La fecha seleccionada es posterior a la expiración de la cuenta. Para poder iniciar el Automation primero debes contratar un Plan.',
            trial_upgrade: 'CONTRATAR AHORA',
          },
        },
      },
      action: {
        options: {
          placeholder: 'Selecciona una Acción',
          associate_subscriber_to_list: 'Asociar Suscriptor a Lista',
          resend_email: 'Reenviar Email modificando Asunto',
          remove_subscriber_from_list: 'Desasociar Suscriptor de la Lista',
          change_subscriber_field: 'Modificar información del Suscriptor',
        },
        list_grid: {
          title: 'Selecciona la Lista a la que quieres asociar al Suscriptor',
          subtitle:
            'Vincula un Suscriptor a una Lista específica de acuerdo a criterios que hayas definido previamente como el hecho de haber abierto una Campaña o haber hecho clic en un link, por ejemplo.',
        },
        remove_grid: {
          title:
            'Selecciona la Lista de la que quieres desasociar al Suscriptor',
          subtitle:
            'Cuando la Condición que hayas definido se cumpla, el Suscriptor será desasociado de la o las Listas que selecciones a continuación, pero permanecerá activo dentro de tu cuenta.',
        },
      },
      campaign: {
        delete_warning: {
          title:
            '¡Ouch! Este Email no puede ser eliminado por estar asociado a otros elementos. ',
        },
      },
      condition: {
        canvas_description: {
          check_for: 'Verificar durante ',
          if_subscriber: ' si',
          of_time: ' de tiempo',
          operator_and: ' y',
          operator_or: ' o',
          plural_days: ' días ',
          plural_hours: ' horas ',
          plural_minutes: ' minutos ',
          plural_weeks: ' semanas ',
          singular_days: ' día ',
          singular_hours: ' hora ',
          singular_minutes: ' minuto ',
          singular_weeks: ' semana ',
          verification_time: ' tiempo',
          verification_after: ' Luego de ',
        },
        conditionals: {
          campaign_behavior: {
            canvas_description: {
              any_link_clicked: 'ha hecho clic en cualquier link',
              email_not_open: 'no ha abierto el Email',
              intro_lower: ' el Suscriptor',
              intro_upper: 'El Suscriptor',
              link_clicked: 'ha hecho clic en el link',
              link_not_clicked: 'no ha hecho clic en el link',
              nexus_of: 'del Email ',
              no_link_clicked: 'no ha hecho clic en ningún link',
              open_email: 'ha abierto el Email',
              any_dynamic_link_clicked:
                'ha hecho clic en cualquier link dinámico',
              no_dynamic_link_clicked:
                'no ha hecho clic en ningún link dinámico',
            },
            events: {
              any_link_clicked: 'Ha hecho clic en cualquier link',
              email_not_open: 'No ha abierto el Email',
              link_clicked: 'Ha hecho clic en un link específico',
              link_not_clicked: 'No ha hecho clic en un link específico',
              no_link_clicked: 'No ha hecho clic en ningún link',
              open_email: 'Ha abierto el Email',
              any_dynamic_link_clicked:
                'Ha hecho clic en cualquier link dinámico',
              no_dynamic_link_clicked:
                'No ha hecho clic en ningún link dinámico',
            },
            label: 'Comportamiento en Campaña',
            label_email: 'Selecciona el Email',
            label_event: 'Selecciona un disparador',
            label_link: 'Selecciona el link',
          },
          error: {
            deleted_field: '¡Ouch! El Campo seleccionado no existe.',
            duplicate_conditional: '¡Ouch! Este criterio ya existe.',
            deleted_link: '¡Ouch! Este link ha sido removido.',
            no_email: '¡Ouch! Debes crear al menos un Email.',
            no_link: '¡Ouch! Este Email no posee links.',
            number_pattern: '¡Ouch! El número indicado no es válido.',
          },
          list_membership: {
            canvas_description: {
              belongs: 'pertenece a la Lista',
              intro_lower: ' el Suscriptor',
              intro_upper: 'El Suscriptor',
              not_belongs: 'no pertenece a la Lista',
            },
            events: {
              belongs: 'Pertenece',
              not_belongs: 'No pertenece',
            },
            label: 'Pertenencia a una Lista',
            label_list: 'Has seleccionado',
            list_selection: {
              title:
                'Selecciona la Lista para determinar la pertenencia de los Suscriptores',
              subtitle:
                'Identifica la Lista en base a la cual quieres determinar la pertenencia de los Suscriptores.',
            },
          },
          placeholder: 'Selecciona el tipo de Condición',
          subscriber_information: {
            boolean: {
              no: 'No',
              yes: 'Si',
            },
            canvas_description: {
              criteria: {
                contains: ' contiene ',
                ends_with: ' termina con ',
                equals_to: ' es igual a ',
                greater_than: ' es mayor a ',
                greater_than_or_equals_to: ' es mayor o igual a ',
                less_than: ' es menor a ',
                less_than_or_equals_to: ' es menor o igual a ',
                not_contains: ' no contiene ',
                not_ends_with: ' no termina con ',
                not_equals_to: ' es diferente a ',
                not_starts_with: ' no comienza con ',
                starts_with: ' comienza con ',
              },
              female: 'femenino',
              intro_lower: ' el Campo',
              intro_upper: 'El Campo',
              intro_is: ' es ',
              intro_possessive: ' su ',
              intro_subject: ' del Suscriptor',
              male: 'masculino',
              n_a: 'N/A',
              negative: 'No',
              positive: 'Si',
            },
            criteria: {
              contains: 'Contiene',
              ends_with: 'Termina con',
              equals_to: 'Igual a',
              not_contains: 'No contiene',
              not_ends_with: 'No termina con',
              not_equals_to: 'Diferente a',
              not_starts_with: 'No comienza con',
              label: 'Selecciona el Criterio',
              operators: {
                label: 'Selecciona el Operador',
                less_than: 'Menor',
                less_than_or_equals_to: 'Menor o igual',
                greater_than: 'Mayor',
                greater_than_or_equals_to: 'Mayor o igual',
                equals_to: 'Igual',
              },
              starts_with: 'Comienza con',
            },
            fields: {
              FIRST_NAME: 'Nombre',
              LAST_NAME: 'Apellido',
              EMAIL: 'Email',
              GENDER: 'Sexo',
              BIRTHDAY: 'Cumpleaños',
              COUNTRY: 'País',
              CONSENT: 'Consentimiento',
              ORIGIN: 'Origen',
              SCORE: 'Calificación',
            },
            gender: {
              female: 'Femenino',
              label: 'Selecciona el Género',
              male: 'Masculino',
              n_a: 'N/A',
            },
            label: 'Información del Suscriptor',
            label_country: 'Selecciona un país',
            label_score: 'Selecciona una Calificación',
            label_origin: 'Selecciona un Origen',
            label_field: 'Selecciona un Campo',
          },
          site_behavior: {
            label: 'Comportamiento en Sitio',
            the_subscriber: ' el Suscriptor',
            no_visited: ' no ha vistado ',
            visited: ' ha visitado ',
            separator: 'la URL ',
            more_times: 'veces',
            at_least: ' al menos',
          },
          abandoned_cart_information: {
            label: 'Informacion del Carrito',
            the_cart: ' del Carrito',
            no_visited: ' no ha vistado ',
            visited: ' ha visitado ',
            separator: 'la URL ',
            more_times: 'veces',
            at_least: ' al menos',
            fields: {
              date: 'Fecha',
              amount_of_products: 'Cantidad de Productos',
              status: 'Estado',
              total: 'Total',
            },
          },
        },
        delete_warning: {
          title: '¡Ouch! No puedes eliminar esta Condición. ',
          body: 'Antes debes eliminar todos los elementos que se encuentren dentro de una de las ramas.',
        },
        negative_branch: 'NO',
        positive_branch: 'SI',
        verification_time: {
          error_days: '¡Ouch! Tienes que indicar un número entre 1 y 7.',
          error_hours: '¡Ouch! Tienes que indicar un número entre 1 y 168.',
          error_minutes: '¡Ouch! Tienes que indicar un número entre 5 y 60.',
          error_weeks: '¡Ouch! Tienes que indicar un número entre 1 y 12.',
          label: 'Tiempo de verificación',
          subtitle:
            'Cuando el tiempo haya expirado, los usuarios que no cumplieron la Condición pasarán a la rama del NO.',
          title:
            'Define cuándo quieres que verifiquemos si la Condición se ha cumplido',
        },
      },
    },
    create_list: {
      title: 'Crea una Lista para tus envíos de prueba',
      description:
        'A estos contactos llegará tu envío de prueba. Asigna un nombre a la Lista para que puedas identificarla y no olvides agregar el Nombre y Apellido de tus Suscriptores para probar el uso de Campos Personalizados.',
      list_name: 'Nombre de la Lista:',
      add_suscriber: 'Agregar nuevo Suscriptor',
      footer_tip:
        'Genera una Lista que contenga %1 Suscriptores o menos para realizar un envío de prueba.',
      button_create: 'Crear Lista de prueba',
      duplicate_email: 'Ya has ingresado este email',
      duplicate_listname:
        '¡Oh No! Ya has utilizado este nombre para otra Lista.',
    },
    footer: {
      tip_stop: 'Para editar tu Automation, primero deberás detenerla.',
      tip_state_0: '¡Pst! Ningún paso debe quedar incompleto',
      tip_state_1:
        '¿Has olvidado algo? El último paso no tiene ninguna acción asociada',
      tip_state_2: '¡Pst! Ningún paso debe quedar incompleto',
      tip_state_8:
        "Esta funcionalidad está habilitada solo para cuentas con Plan Pago. <a href='/ControlPanel/AccountPreferences/UpgradeAccount?Plan=monthly' target='_self'><strong>COMPRAR</strong></a>.",
      tip_state_9:
        "Utilízala GRATIS por tiempo limitado. <a href='/Automation/EditorConfig?idTaskType=0' target='_self'><strong>ACTIVA EL PERIODO DE PRUEBA</strong></a>.",
      tip_state_10:
        "¡Ouch! Para iniciar tu Automation necesitas conectar Doppler con tu E-commerce. <a href='/ControlPanel/ControlPanel' target='_self'><strong>CONÉCTALO</strong></a>.",
      tip_state_11:
        'La fecha seleccionada es posterior a la expiración de la cuenta.',
      tip_state_error:
        '¡Ouch! Parece que algo no está bien en las condiciones iniciales del flujo.',
      tip_not_sms_credit:
        "¡No olvides <a href='/ControlPanel/AccountPreferences/GetSmsConfiguration' target='_self'><strong>recargar</strong></a> saldo para tus envíos SMS antes de iniciar tu Automation!",
    },
    header: {
      tip_templates: '¿Quieres elegir la Plantilla más tarde?',
      undo: 'Deshacer',
      redo: 'Rehacer',
    },
    import_file: {
      title: 'Importa el contenido de la Campaña',
      description:
        '¡Ha llegado el momento de importar tu archivo .html o .zip! Puedes buscarlo o arrastrarlo hacia el lugar que se indica debajo. ¿Tienes dudas? Podemos ayudarte, solo presiona ',
      help_url: 'https://help.fromdoppler.com/es/como-importar-un-html/',
      cancel_button: 'Cancelar',
      drag_text: 'Arrastra el <b>archivo de tu Campaña</b> aquí o ',
      importing: 'Importando <b>{{fileName}}</b>',
      imported: 'Has importado <b>{{fileName}}</b>',
      drag_button: 'Busca tu archivo',
      drag_button_imported: 'Reemplazar archivo',
      drag_button_imported_error: 'Importa otro archivo',
      drag_description:
        'Puedes importar un archivo .html o .zip. Si tu campaña posee imágenes, deberás incluirlas junto con el .html dentro del .zip. ¿Tienes dudas? Podemos ayudarte, solo presiona ',
      drag_help_url: 'https://help.fromdoppler.com/es/como-importar-un-html/',
      error_max_files: '¡Ouch! No puedes subir dos archivos en simultáneo.',
      error_file_size: '¡Ouch! El tamaño de tu archivo supera los fileSize MB',
      tip: 'Importa un archivo y continúa con la edición de tu Campaña de Email Automation',
      dynamic_tip_link_help: '¿Necesitas Ayuda? Presiona',
      abandoned_cart_tip_link_url:
        'https://help.fromdoppler.com/es/crear-automation-carrito-abandonado',
      visited_products_tip_link_url:
        'https://help.fromdoppler.com/es/crear-automation-producto-visitado',
    },
    blocked_list: {
      tooltip_tag: 'LISTA BLOQUEADA',
      link_text: 'Entérate más.',
      help_link: 'https://help.fromdoppler.com/en/blocked-lists',
      tooltip_text: 'Hay Suscriptores que afectan la calidad de tu Lista.',
    },
    lists_grid: {
      title: 'Selecciona la Lista que quieres asociar a tu Campaña',
      description:
        'Cuando tus Suscriptores se sumen a la Lista seleccionada recibirán tu Campaña de Email Automation. Esta funcionalidad es especial para realizar Emails de Bienvenida. ¿Tienes dudas? Podemos ayudarte, solo presiona ',
      link_url:
        'https://help.fromdoppler.com/es/como-crear-email-automation-ingreso-lista/',
      tip_help:
        'Selecciona una Lista y continúa con la edición de tu Campaña de Email Automation',
    },
    lists_grid_empty: {
      title: 'Parece que aún no has creado Listas',
      description:
        'Hazlo ahora y luego regresa a continuar la edición de tu Automation.',
      action: 'Salir y crear una Lista',
    },
    lists_scheduled_grid: {
      title: 'Selecciona la Lista o Segmento que quieres asociar a tu Campaña',
      description:
        'Identifica a quiénes quieres enviar tu Campaña de Email Automation. Puedes seleccionar Listas de Suscriptores o Segmentos identificando distintos Criterios de Filtrado.',
      list_filter: 'Listas',
      segments_filter: 'Segmentos',
      footer_tip:
        'Selecciona las Listas o Segmentos y continúa con la edición de tu Automation',
      segments: ' (Segmento)',
      doppler_tip:
        'Aprovecha para segmentar tus Suscriptores por distintos criterios como edad o país de residencia.',
      all_contacts:
        'Enviar a todos mis contactos (Todas tus Listas serán seleccionadas)',
      blocked_list:
        'Hay Suscriptores que afectan la calidad de tu Lista. Entérate más.',
      blocked_list_link: 'Entérate más.',
      blocked_list_href: 'https://help.fromdoppler.com/es/listas-bloqueadas',
      blocked_list_text: 'LISTA BLOQUEADA',
      blocked_segment:
        'Hay Suscriptores que afectan la calidad de tu Segmento.',
      blocked_segment_href:
        'https://help.fromdoppler.com/es/listas-bloqueadas#segmentos-bloqueados',
      blocked_segment_text: 'SEGMENTO BLOQUEADO',
    },
    tiny_editor: {
      title: 'Editor de Texto y HTML',
      subtitle:
        'Utiliza este Editor para crear el contenido de tu Campaña. Selecciona los Campos Personalizados que desees incluir desde el listado que aparece a la derecha, estos se agregarán automáticamente en el contenido del Email.',
      dopplerTip:
        'Humaniza tu campaña agregando la cantidad de Campos Personalizados que desees. ¿Tienes dudas? Podemos ayudarte, solo presiona ',
      dopplerTipLink:
        'https://help.fromdoppler.com/es/como-agregar-un-campo-personalizado/',
      custom_fields_title: 'Campos Personalizados',
      return_button: 'Volver al Flujo de Automation',
      confirm_button: 'Confirmar',
    },
    lists_grid_headers: {
      label: 'Etiqueta',
      list_name: 'Nombre de la Lista',
      list_segments_name: 'Nombre de la Lista o Segmento',
      last_send: 'Último envío',
      subscribers: 'Suscriptores',
    },
    templates: {
      privates_description:
        'Selecciona una Plantilla para el Email de tu Automation.',
      publics_description:
        'Selecciona una de nuestras Plantillas para el Email de tu Automation y personalízala a tu gusto.',
      privates_description_abandoned_cart:
        'Hemos diseñado Plantillas exclusivamente pensadas para ayudarte a recuperar carritos abandonados. ¡Elige la que mejor se ajuste a tus necesidades!',
      privates_description_visited_products:
        'Hemos diseñado Plantillas exclusivamente pensadas para ayudarte a lograr que aquellos que vieron tus productos, los terminen comprando. ¡Elige la que mejor se ajuste a tus necesidades!',
      privates_description_pending_order:
        'Hemos diseñado Plantillas editables para notificar a tus compradores de que tienen pagos pendientes. ¡Elige la que mejor se ajuste a tus necesidades!',
      privates_description_confirmation_order:
        'Hemos diseñado Plantillas editables para notificar a tus clientes que su pago se procesó correctamente. ¡Elige la que mejor se ajuste a tus necesidades!',
    },
    sidebar: {
      action_email_title: 'Email',
      action_title: 'Define la Acción que quieres que se ejecute',
      action_help_tip:
        '¿Tienes dudas sobre cómo crear una Acción dentro de tu Campaña de Automation?',
      action_help_tip_link:
        'https://help.fromdoppler.com/es/crear-accion-en-automation',
      action_field: 'Campo Personalizados',
      action_value: 'Valor',
      non_customs_error:
        'Para utilizar esta funcionalidad necesitas tener al menos un Campo Personalizado.',
      non_customs_error_link: 'CRÉALO AHORA.',
      non_customs_phone_error:
        'Para utilizar esta funcionalidad necesitas tener al menos un Campo Personalizado de tipo Teléfono.',
      sms_title: 'Crea tus SMS',
      characters: 'Caracteres',
      count_parts: 'Mensajes',
      main_title:
        'Configura el punto de partida para tu automation por comportamiento',
      user_has_been_section: 'El usuario ha estado en la sección:',
      start_steps:
        'Comienza a seleccionar los pasos para tu automation a través del signo en el panel derecho',
      add_step_tip:
        'Selecciona una de las opciones que aparecen en el lienzo para configurar tu Flujo de Automation',
      time_before_campaign:
        '¿Cuánto tiempo quieres que transcurra antes de que se implemente el siguiente paso?',
      delay_time: 'Tiempo de espera',
      time_unit: {
        minutes: 'Minutos',
        hours: 'Horas',
        day: 'Día',
        days: 'Días',
        weeks: 'Semanas',
      },
      delay_input_placeholder: 'Ejemplo: 24',
      form_title:
        'Completa los datos que serán utilizados al momento del envío',
      campaign_name: 'Nombre del Email',
      campaign_name_error:
        '¡Ouch! Has alcanzado la cantidad máxima de caracteres.',
      rss_url: 'URL de tu RSS',
      campaign_subject: 'Asunto',
      campaign_subject_emojis: {
        emojis_categories: {
          Emoji_Category_Faces_Emotions: 'Caras y emociones',
          Emoji_Category_People_Body: 'Personas y cuerpo',
          Emoji_Category_Animals_Nature: 'Animales y naturaleza',
          Emoji_Category_Food_Drinks: 'Alimentos y bebidas',
          Emoji_Category_Activities: 'Actividades',
          Emoji_Category_Travel: 'Viajes',
          Emoji_Category_Objects: 'Objectos',
          Emoji_Category_Symbols: 'Símbolos',
          Emoji_Category_Flags: 'Banderas',
        },
      },
      campaign_subject_tip:
        'Sé creativo en la elección del Asunto de tu Campaña. El mismo es un factor clave en el porcentaje de Apertura.',
      subject_hide_advice: 'Ocultar consejos',
      subject_show_advice: 'Mostrar consejos',
      subject_suggestion_title: 'Consejos',
      subject_suggestion_short_title:
        'Emplea hasta 40 caracteres. ¡Cuanto más corto, mejor!',
      subject_suggestion_short_description:
        'Así te aseguras de que se vea bien en todos los dispositivos.',
      subject_suggestion_emojis_title: 'Aprovecha el poder de los Emojis',
      subject_suggestion_emojis_description:
        '¡Tus Contactos los amarán! Pero incluye solo uno por Asunto.',
      subject_suggestion_custom_title:
        'Incluye hasta dos Campos Personalizados',
      subject_suggestion_custom_description:
        "Insértalos desde el botón  <span class='btn-aspect'>[ ]</span>.",
      subject_suggestion_special_char_title: 'Limita el uso de signos ¿? ¡!',
      subject_suggestion_special_char_description:
        '¡Escógelos con cuidado! Evita usar más de tres pares.',
      subject_score_noSubject: '........................',
      subject_score_veryLow: 'Muy baja :(',
      subject_score_low: 'Baja',
      subject_score_medium: 'Media',
      subject_score_high: 'Alta',
      subject_score_veryHigh: '¡Muy alta!',
      subject_beta_feature: 'VERSIÓN BETA',
      subject_effective_tittle: 'Efectividad del Asunto:',
      subject_effective_ia_explain:
        'Día a día analizamos los Asuntos de nuestros usuarios, para brindarte estas recomendaciones que te ayuden a optimizar los tuyos.',
      subject_keyWords: 'Palabras Clave:',
      subject_effective_ia_content:
        '¡Psst! Estas palabras pueden influir positiva o negativamente en la efectividad de tu Asunto.',
      subject_effective_tooltip:
        'Las palabras en verde son una buena elección. Las que están en amarillo son de dudosa eficacia. Las palabras en rojo es mejor evitarlas.',
      subject_effective_ia_error: '¡Ouch! Algo salió mal. Inténtalo más tarde.',
      subject_industry_title: 'Industria',
      subject_industry_change: 'Cambiar',
      subject_industry_confirm: 'Confirmar',
      subject_industry_select: 'Seleccionar',
      subject_choose_industry: 'Selecciona tu industria',
      subject_industry_save_success: 'Cambios guardados con éxito.',
      subject_industry_save_warning:
        'Elige una <strong>industria específica</strong> para ver información más precisa sobre la efectividad de tu Asunto.',
      subject_industry_save_suggestion:
        'Elige una <strong>industria específica</strong> para ver información más precisa sobre la efectividad de tu Asunto.',
      campaign_pre_header: 'Pre Encabezado',
      campaign_pre_header_tip_part1:
        'Aprovecha la pequeña porción de texto que se encuentra debajo del Asunto cuando un Email llega a la bandeja de entrada de tu Suscriptor y aumenta tu Tasa de Apertura.',
      campaign_pre_header_tip_part2: '¿Necesitas ayuda?',
      campaign_pre_header_tip_link:
        'https://help.fromdoppler.com/es/que-es-el-pre-encabezado-y-como-utilizarlo/',
      campaign_pre_header_help_link_text: 'Help',
      campaign_dmarc_validation_part1:
        'Utilizar dominios públicos como Hotmail, Gmail, Yahoo u otros, afecta la Tasa de Entrega. ',
      campaign_dmarc_validation_subscribers_part1:
        'Por la cantidad de Contactos que tienes en la cuenta, para hacer el envío debes configurar un dominio propio. ',
      campaign_dmarc_validation_part2: 'Si tienes dudas, presiona ',
      campaign_dmarc_validation_linkText: 'HELP',
      campaign_dmarc_validation_linkUrl:
        'https://help.fromdoppler.com/es/como-activar-domain-keys/',
      campaign_dmarc_validation_AcceptButton: 'ENTENDIDO',
      campaign_dmarc_validation_subscribers_linkUrl:
        'https://help.fromdoppler.com/es/como-activar-domain-keys/',
      campaign_dmarc_validation_subscribers_AcceptButton:
        'CONFIGURA TU DOMINIO',
      contact_policy_title: 'Ignorar Política de Contacto',
      contact_policy_tooltip:
        'Si ignoras la Política de Contacto, el límite que has definido no se aplicará en esta Campaña.',
      contact_policy_radio_no: 'No',
      contact_policy_radio_yes: 'Si',
      contact_policy_legend:
        'Aún no has definido una Política de Contacto. Aprende cómo configurarla en nuestro ',
      contact_policy_help_link:
        'https://help.fromdoppler.com/es/politica-de-contacto',
      contact_policy_help_text: 'HELP',
      campaign_sender_email: 'Email del Remitente',
      campaign_sender_name: 'Nombre del Remitente',
      campaign_answer_email: 'Email de Respuesta',
      campaign_shares_title:
        'Configura la viralización de tu Email a través de Redes Sociales',
      campaign_shares_add: 'Agregar compartir en',
      campaign_email_content_title: 'Contenido del Email',
      campaign_import_file: 'Importar archivo',
      campaign_templates_editor: 'Editor de Plantillas',
      campaign_text_html_editor: 'Editor de Texto y HTML',
      campaign_send_test_title: 'Realiza un envío de prueba',
      campaign_send_test_warning_incomplete:
        '¡Ouch! Antes necesitas completar los datos de este envío.',
      campaign_send_test_subscribers_title:
        'Enviar a una Lista de Suscriptores',
      campaign_send_test_subscribers_subtitle:
        'Selecciona entre tus Listas, una que contenga {{ maxSubsInList }} Suscriptores o menos para realizar un envío de prueba y verificar que tu Campaña esté como la deseas.',
      campaign_send_test_subscribers_select_placeholder:
        'Selecciona una Lista de Suscriptores',
      campaign_send_test_send_button: 'Enviar',
      campaign_send_test_email_title:
        'Realizar una prueba a un Email específico',
      campaign_send_test_email_subtitle:
        'Escribe el Email al que quieras realizar tus envíos de prueba.',
      campaign_send_test_ok_message:
        '¡Excelente! El envío de prueba ha sido realizado. Verifica tu Campaña.',
      campaign_send_test_max_amount_sent_reached:
        'Máxima cantidad de tests alcanzada',
      campaign_send_test_create_list: 'Crear una Lista para envíos de prueba',
      campaign_title: 'Define el momento de envío',
      campaign_send_now_title: 'Envío Inmediato',
      campaign_send_now_description:
        'La Campaña se enviará al momento en el que hagas click en el botón Iniciar Automation.',
      campaign_send_scheduled_title: 'Entrega Programada',
      campaign_send_scheduled_description:
        'La Campaña se enviará en la fecha y hora que selecciones.',
      campaign_tip:
        '¿Tienes dudas sobre cómo crear tu Automation por Comportamiento en Campaña?',
      campaign_tip_link_url:
        'https://help.fromdoppler.com/es/crear-automation-por-comportamiento-en-campania/',
      campaign_field_date: 'Fecha:',
      campaign_field_hour: 'Hora:',
      campaign_notification_title:
        'Enviar confirmación a los siguientes Emails',
      campaign_notification_text:
        '¿Deseas recibir una notificación cuando tu Campaña haya sido enviada? ',
      campaign_max_emails: 'Ingresa hasta {{maxConfEmails}} Emails.',
      campaign_add_email: 'Agregar nuevo Email',
      campaign_domain_error_part1: 'Valida este dominio.',
      campaign_domain_error_part2: 'Te enviaremos un código, ingrésalo debajo.',
      campaign_domain_error_part3:
        'Protege tu reputación como remitente, evita llegar a Spam y que otros utilicen tu dominio sin permiso. ¿Tienes dudas? Presiona ',
      campaign_domain_error_help_link:
        'https://help.fromdoppler.com/es/validacion-dominio-remitente/',
      campaign_domain_send_email_title:
        'Email en el que quieres recibir el código de verificación',
      campaign_domain_send_email_btn: 'Enviar',
      campaign_domain_send_code_title: 'Código de verificación recibido',
      campaign_domain_send_code_btn: 'Verificar',
      campaign_domain_code_validation_ok:
        'El dominio ha sido añadido exitosamente.',
      campaign_domain_code_validation_max_domain_part1:
        '¡Ouch! Has superado la cantidad permitida de dominios disponibles.',
      campaign_domain_code_validation_max_domain_part2:
        'Ingresa un Email con dominio ya validado o elimina alguno existente desde el',
      campaign_domain_code_validation_max_domain_part3: 'Administrador.',
      campaign_domain_code_validation_max_domain_part4:
        '¿Tienes dudas? Presiona ',
      campaign_domain_code_validation_max_domain_part5:
        'https://help.fromdoppler.com/es/como-activar-domain-keys/',
      campaign_domain_code_validation_failed:
        '¡Ouch! El código ingresado no es válido. Inténtalo nuevamente.',
      campaign_domain_send_success: 'Tu código ha sido enviado exitosamente.',
      campaign_domain_send_error:
        '¡Ouch! Has superado la cantidad máxima de envíos del código de verificación. Vuelve a intentarlo dentro de 24 horas.',
      condition_title: 'Escribe un nombre para la Condición',
      condition_define_conditions: 'Define los criterios de tu Condición',
      condition_title_tip:
        'Procura que sea fácilmente identificable ya que será la forma en la que se visualizará tu Condición en el lienzo.',
      condition_define_conditions_tip:
        'Cuantos más criterios reúnas, más segmentado y orientado será tu envío.',
      condition_help_tip:
        '¿Tienes dudas sobre cómo crear Condiciones para tus Campañas de Automation?',
      condition_help_tip_url:
        'https://help.fromdoppler.com/es/crear-condiciones-para-automation',
      condition_add_tip: 'Añade más criterios a tu Condición',
      condition_and_tip: 'Todos los criterios deben cumplirse',
      condition_or_tip: 'Al menos uno de los criterios debe cumplirse',
      date_picker_current_text: 'Hoy',
      list_blocked: 'Lista bloqueda',
      list_title:
        'Elige la Lista que quieres asociar a tu Campaña de Automation:',
      list_select_button: 'Seleccionar Lista',
      list_replace_button: 'Reemplazar Listas asociadas',
      list_tip:
        '¿Tienes dudas sobre cómo crear tu Campaña de Automation por Suscripción a Lista?',
      list_tip_part2: 'Presiona',
      list_selected: 'Has seleccionado',
      list_all_my_contacts_selected: 'Todos mis contactos',
      list_tip_link_text: 'Help',
      list_tip_link_url:
        'https://help.fromdoppler.com/es/como-crear-email-automation-ingreso-lista/',
      list_segments_error:
        '¡Ouch! Has seleccionado un Segmento en lugar de una Lista.',
      phone_type: 'Campo teléfono',
      phone_name: 'Nombre del SMS',
      sms_text: 'Mensaje de texto',
      sms_text_desc:
        'Si agregas caracteres especiales, puede ocurrir que a la hora del envío se sumen más SMS.',
      sms_colombian_warning_msg:
        'Existe una limitación a 146 caracteres para envíos de SMS a Colombia.',
      sms_colombian_warning_link_label: 'VER DETALLES',
      sms_colombian_warning_link:
        'https://help.fromdoppler.com/es/por-que-mis-contactos-no-reciben-los-sms-que-envie',
      sms_help_tip:
        '¿Tienes dudas sobre cómo crear un Sms dentro de tu Campaña de Automation?',
      sms_help_tip_link:
        'https://help.fromdoppler.com/es/crear-accion-en-automation',
      sms_text_test: 'Realiza un envío de prueba a un teléfono específico',
      sms_text_test_desc:
        'Escribe el número de teléfono al que quieres realizar tu envío de prueba. El costo de este envío de prueba se descontará de tu dinero disponible.',
      scheduled_date_title:
        'Elige qué tipo de fecha utilizarás para darle una frecuencia a tu Campaña de Email Automation',
      scheduled_date_tip:
        '¿Tienes dudas sobre cómo crear tu Campaña de Automation por Fechas Programadas?',
      scheduled_date_tip_part2: 'Presiona',
      scheduled_date_tip_link_url:
        'https://help.fromdoppler.com/es/campanas-de-email-automation-por-fechas-programadas/',
      scheduled_date_day_week_title: 'Día de la Semana',
      scheduled_date_day_week_description:
        'Programa un Email que se envíe, por ejemplo, todos los jueves de cada semana.',
      scheduled_date_day_month_title: 'Día del Mes',
      scheduled_date_day_month_description:
        'Especial para ciclos de facturación, envía tu Campaña un día específico de cada mes.',
      scheduled_date_day_number_error:
        '¡Ouch! El número indicado no es válido.',
      scheduled_date_day_year_title: 'Día del Año',
      scheduled_date_day_year_description:
        'Pensada para fechas específicas. Saluda a tus Suscriptores por su cumpleaños o aniversario.',
      scheduled_date_add_custom_field:
        'Agregar un nuevo Campo Personalizado de Fecha',
      scheduled_date_select_custom_field:
        'Utiliza el siguiente Campo Personalizado como referencia',
      scheduled_date_select_day_moment: 'Enviar este Email',
      scheduled_date_select_day_moment_tip:
        '* que se cumpla la fecha seleccionada.',
      scheduled_date_select_week_days_title:
        'Selecciona el día de la semana en el que quieres que se realicen tus envíos',
      scheduled_date_select_week_time: 'Hora del envío',
      scheduled_date_select_month_day_title:
        'Selecciona un día del mes en el que quieres que se realicen tus envíos',
      scheduled_date_select_month_day_tip:
        '* Se realizará el envío el día seleccionado de cada mes.',
      scheduled_date_day1: 'Lunes',
      scheduled_date_day2: 'Martes',
      scheduled_date_day3: 'Miércoles',
      scheduled_date_day4: 'Jueves',
      scheduled_date_day5: 'Viernes',
      scheduled_date_day6: 'Sábado',
      scheduled_date_day0: 'Domingo',
      scheduled_date_select_list_title:
        'Elige la Lista o Segmento que quieres asociar a tu Campaña de Email Automation',
      scheduled_date_select_list_button: 'Seleccionar Lista o Segmento',
      Push_notification_domains_selection_title:
        'Enviar notificaciones Push a los visitantes del dominio:',
      Domains_Selected: 'Has seleccionado',
      Domains_replace_button: 'Reemplazar dominio',
      Domains_select_button: 'Seleccionar dominio',
      Push_notification_campaign_tip:
        '¿Tienes dudas sobre cómo crear un Automation de notificaciones Push?',
      Push_notification_campaign_tip_part2: 'Revisa el',
      Push_notification_campaign_tip_link_url:
        'https://help.fromdoppler.com/es/automation-notificaciones-push',
      Push_notification_campaign_tip_link_text: 'HELP',
      Push_notification_campaign_title: 'Define el tipo de envío',
      Push_notification_campaign_send_now_title: 'Envío Inmediato',
      Push_notification_campaign_send_now_description:
        'Las notificaciones Push se enviarán al hacer clic en el botón Iniciar Automation.',
      Push_notification_campaign_send_scheduled_title: 'Envío Programado',
      Push_notification_campaign_send_scheduled_description:
        'Las notificaciones Push se enviarán el día y la hora que tú determines.',
      Push_notification_campaign_field_date: 'Fecha:',
      Push_notification_campaign_date_picker_current_text: 'Hoy',
      Push_notification_campaign_field_hour: 'Hora:',
      goto_title: '¿Con qué paso lo quieres conectar?',
      goto_title_tip:
        'Elige una opción del siguiente listado o selecciona un paso en el lienzo.',
      goto_bottom_detail:
        'Algunos pasos están deshabilitados para evitar crear flujos infinitos.',
      goto_help_tip: 'Si tienes dudas, puedes visitar nuestro artículo',
      goto_help_tip_link:
        'https://help.fromdoppler.com/es/como-conectar-ramas-en-tu-flujo-de-automation?utm_source=direct',
      goto_help_tip_link_text:
        '”Cómo conectar pasos dentro de tu flujo de Automation”',
      replicaSetinitConditioMsg:
        'Cuando realizas una réplica es necesario que definas nuevamente la configuración inicial del flujo de automation.',
      abandoned_cart: {
        title: 'Configura tu Automation de Carrito Abandonado',
        ecommerce_label: 'E-commerce que deseas integrar',
        time_label: 'Enviar el Email {{time}} después de abandonado el carrito',
        wait_label: 'Volver a ingresar un Suscriptor después de',
        wait_title:
          'Indica cada cuánto tiempo un mismo Suscriptor puede volver a ingresar al Flujo de Automation',
        stock_label: 'Excluir productos agotados',
        list_tip:
          '¿Tienes dudas acerca de cómo crear un Automation de Carrito Abandonado?',
        list_tip_link_url:
          'https://help.fromdoppler.com/es/crear-automation-carrito-abandonado',
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
          option120: '2 horas',
          option360: '6 horas',
          option1440: '24 horas',
        },
        drop_down_wait_options: {
          option0: '0 horas',
        },
      },
      visited_products: {
        title: 'Configura tu Automation de Producto Visitado',
        ecommerce_label: 'E-commerce que deseas integrar',
        time_label: 'Enviar el Email {{time}} después de visitado el producto',
        wait_label: 'Volver a ingresar un Suscriptor después de',
        wait_title:
          'Indica cada cuánto tiempo un mismo Suscriptor puede volver a ingresar al Flujo de Automation',
        stock_label: 'Excluir productos agotados',
        list_tip:
          '¿Tienes dudas acerca de cómo crear un Automation de Producto Visitado?',
        list_tip_link_url:
          'https://help.fromdoppler.com/es/crear-automation-producto-visitado',
        drop_down_options: {
          option1: 'MercadoShops',
          option2: 'TokkoBroker',
          option3: 'Tiendanube',
          option4: 'Datahub',
          option5: 'Vtex',
          option6: 'Prestashop',
          option7: 'Shopify',
          option8: 'Magento',
          option10: 'WooCommerce',
          option11: 'easycommerce',
          option14: 'MiTienda',
        },
        drop_down_time_options: {
          option0: '24 horas',
          option1440: '24 horas',
          option2880: '48 horas',
          option4320: '72 horas',
        },
        drop_down_wait_options: {
          option10080: '1 Semana',
          option20160: '2 Semanas',
          option30240: '3 Semanas',
        },
        drop_down_ecommerce_errors: {
          error2:
            "¡Ouch! No has habilitado el periodo de prueba de Seguimiento en Sitio. <a href='/Automation/EditorConfig?idTaskType=0' class='text--underline' target='_self'>HABILÍTALO AHORA</a>.",
          error3:
            "¡Ouch! No has habilitado la funcionalidad de Seguimiento en Sitio. <a href='/ControlPanel/CampaignsPreferences/SiteTrackingSettings' class='text--underline' target='_self'>HABILÍTALA AHORA</a>.",
          error4:
            "¡Ouch! No has agregado y verificado el dominio del Sitio Web sobre el que quieres hacer el seguimiento. <a href='/ControlPanel/CampaignsPreferences/SiteTrackingSettings' class='text--underline' target='_self'>HAZLO AHORA</a>.",
        },
      },
      pending_order: {
        title: 'Configura tu Automation de Pago Pendiente',
        ecommerce_label: 'E-commerce que deseas integrar',
        time_label: 'Enviar el Email {{time}} después de abandonada la orden',
        wait_label: 'Volver a ingresar un Suscriptor después de',
        wait_title:
          'Indica cada cuánto tiempo un mismo Suscriptor puede volver a ingresar al Flujo de Automation',
        stock_label: 'Excluir productos agotados',
        list_tip:
          '¿Tienes dudas sobre cómo crear un Automation de Pago Pendiente?',
        list_tip_link_url:
          'https://help.fromdoppler.com/es/como-crear-automation-de-pago-pendiente',
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
          option120: '2 horas',
          option360: '6 horas',
          option1440: '24 horas',
          option2880: '48 horas',
        },
        drop_down_wait_options: {
          option0: '0 horas',
        },
      },
      confirmation_order: {
        title: 'Configura tus Campañas de Pago Confirmado',
        ecommerce_label: 'E-commerce que deseas integrar',
        list_tip:
          '¿Tienes dudas sobre cómo crear un Automation de Pago Confirmado?',
        list_tip_link_url:
          'https://help.fromdoppler.com/es/como-crear-automation-pago-confirmado',
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
      push_title: 'Define el contenido de la notificación Push',
      push_message_title: 'Título',
      push_message_body: 'Mensaje',
      push_message_body_desc:
        'Tip. Puedes usar emojis 😃🤩🥳. Los emojis cuentan como más de un caracter sobre el máximo permitido del mensaje.',
      push_message_on_click_link: 'URL de destino (opcional)',
      push_uploader_title: 'Imagen (opcional)',
      push_uploader_retry_button: 'reintentar',
      push_uploader_drag_title: 'Arrastra Aquí o',
      push_uploader_button: 'Selecciona una Imagen',
    },
    steps: {
      without_recorded: 'SIN PASOS REGISTRADOS',
      all_completed: 'TODOS LOS PASOS COMPLETOS',
      one_incompleted: 'PASO INCOMPLETO',
      more_incompleted: 'PASOS INCOMPLETOS',
      delay_not_defined: 'Espera sin definir',
      delays_not_defined: 'Esperas sin definir',
      campaign_not_defined: 'Email sin definir',
      campaigns_not_defined: 'Emails sin definir',
      condition_not_defined: 'Condición sin definir',
      conditions_not_defined: 'Condiciones sin definir',
      action_not_defined: 'Acción sin definir',
      actions_not_defined: 'Acciones sin definir',
      sms_not_defined: 'Sms sin definir',
      smss_not_defined: 'Sms sin definir',
      push_notification_not_defined: 'Push sin definir',
      push_notifications_not_defined: 'Push sin definir',
      goto_not_defined: 'Ir al Paso sin definir',
      gotos_not_defined: 'Ir a los Pasos sin definir',
    },
    saved: 'Guardado',
    saving: 'Guardando',
    reports: {
      title: 'Resumen de Métricas de tu Automation',
      full_report: 'Ver Reporte completo >>',
      delivered_mails: 'Total de Emails Entregados',
      open_rate: 'Tasa de Apertura',
      click_rate: 'Tasa de Clic (CTOR)',
      last_activity: 'Fecha de última actividad registrada',
      paused_date: 'Pausada el',
      stopped_date: 'Detenida el',
      paused_title: 'Automation Pausada',
      stopped_title: 'Automation Detenida',
      paused_description:
        '¡Psst! Desde esta edición solo puedes modificar el contenido de los Emails del flujo y la configuración de los Tiempos de espera. Una vez que hagas los ajustes necesarios, reinicia tu Automation.',
      stopped_description_one:
        '¡Psst! Al reactivar tu Automation, esta <strong>comenzará desde el inicio</strong>, como si fuera la primera vez que la activas.',
      stopped_description_two:
        'Puedes descargar un Reporte de su desempeño desde el Centro de Descargas.',
    },
    pause_modal: {
      title: 'Pausar Automation',
      description_one:
        'Mientras esté pausada tu Campaña <strong>no ingresarán nuevos Suscriptores al flujo.</strong>',
      description_two:
        'Cuando reinicies tu Automation, se reanudará para aquellos Suscriptores que estaban dentro del flujo, sin importar el tiempo que haya transcurrido.',
      description_three:
        'Solo podrás modificar elementos como <strong>Emails y Tiempos de espera.</strong>',
      description_four: '¿Estás seguro de que quieres pausarlo?',
      stop: 'SÍ, PAUSAR AUTOMATION',
      cancel: 'NO, QUIZÁ DESPUÉS',
    },
    stop_modal: {
      title: 'Detener Automation',
      description_one:
        'Los Suscriptores de tu Automation NO continuarán avanzando dentro del flujo.',
      description_two:
        'Podrás descargar un Reporte sobre el desempeño de tu Campaña.',
      description_three:
        '<b>IMPORTANTE:</b> Al reactivar la Campaña, esta volverá a comenzar desde el inicio, como si fuera la primera vez que la activas.',
      description_four: '¿Estás seguro de que deseas detenerla?',
      stop: 'SÍ, DETENER AUTOMATION',
      cancel: 'NO, QUIZÁ DESPUÉS',
    },
    pause_confirmation_modal: {
      title:
        'Una vez que realices los ajustes necesarios, reinicia tu Automation',
      description:
        'Desde esta vista de edición solo puedes modificar el contenido de los Emails del flujo y la configuración de los Tiempos de espera.',
      ok: 'entendido',
    },
    no_dynamic_element_modal: {
      title: 'AVISO IMPORTANTE',
      description_abandoned_cart:
        'Estás por iniciar el Automation sin mostrar elementos del Carrito Abandonado de tus usuarios en ningún Email.',
      description_visited_products:
        'Estás por iniciar el Automation sin mostrar elementos de Productos Visitados por tus usuarios en ningún Email.',
      description_pending_order:
        'Tu Email no posee el <b>elemento Detalle de Compra</b>, por lo que la información sobre los productos pendientes de pago no se mostrará. ¿Tienes dudas? Revisa el <a class="help-text" href="https://help.fromdoppler.com/es/como-crear-automation-de-pago-pendiente" target="_blank">HELP</a>.',
      description_confirmation_order:
        'Tu Email no posee el <b>elemento Detalle de Compra</b>, por lo que la información sobre los productos no se mostrará. ¿Tienes dudas? Revisa el <a class="help-text" href="https://help.fromdoppler.com/es/como-crear-automation-pago-confirmado" target="_blank">HELP</a>.',
      cancel: 'VOLVER',
      start: 'INICIAR DE TODAS FORMAS',
    },
    Domains_grid: {
      empty_title: 'Parece que aún no tienes dominios activos',
      empty_description:
        'Hazlo y luego regresa a continuar la edición de tu Automation.',
      scheduled_title:
        'Selecciona los dominios que quieres asociar a tu Automation',
      scheduled_subtitle: 'Los dominios listados son tus dominios activos.',
      header_domain_column: 'Dominios',
    },
  },
  automationTypes: {
    info: {
      title3: 'Fechas Programadas',
      description3:
        'Programa envíos para saludar a tus contactos en su cumpleaños, enviar promociones o recordarles el vencimiento de facturas.',
      title1: 'Suscripción a Listas',
      description1:
        'Programa envíos para darle la bienvenida a los Suscriptores que se suman a tus Listas y sorprenderlos con contenidos exclusivos.',
      title5: 'Comportamiento en Campaña',
      description5:
        'Programa un flujo que dispare Emails o acciones teniendo en cuenta la interacción de tus Suscriptores con tus envíos.',
      title4: 'Envío de RSS',
      description4:
        'Programa Campañas para mantener a tus Suscriptores al tanto de las últimas publicaciones que has realizado en tu blog.',
      title6: 'Comportamiento en Sitio',
      description6:
        'Programa Emails personalizados de acuerdo a las interacciones que los usuarios hayan tenido con tu sitio web.',
      start6_message: 'Tienes un dominio verificado. CREAR AUTOMATION',
      title7: 'Carrito Abandonado',
      description7:
        'Recuérdales a los usuarios que dejaron artículos en su carrito y anímalos a completar su compra.',
      start7_message: 'Ya has integrado Doppler con ',
      title8: 'Producto Visitado',
      description8:
        'Anima a los usuarios a comprar los productos que hayan visto en tu E-commerce.',
      start8_message: 'Ya has integrado Doppler con ',
      title9: 'Pago Pendiente',
      description9:
        'Recuérdales a tus usuarios que tienen un Pago Pendiente y anímalos a completar la compra.',
      tiendanube_content: 'Ahora para Tiendanube, <br />¡pronto para todos!',
      start9_message: 'Ya has integrado Doppler con ',
      title10: 'Pago Confirmado',
      description10:
        'Programa Emails para notificar a tus clientes que has recibido su pago.',
      start10_message: 'Ya has integrado Doppler con ',
      title11: 'Notificaciones Push',
      description11:
        'Envía alertas con ofertas o información relevante a los visitantes de tu Sitio Web o Tienda Online.',
      start11_message:
        'Tienes al menos un dominio verificado. CREAR AUTOMATION',
      buy: 'COMPRAR',
      error_message: '¡Ouch! No hay dominios verificados.',
      continue: 'CONTINUAR',
      warning_message:
        '¡Psst! Necesitas habilitar la funcionalidad y verificar los dominios agregados.',
      demo_message: 'Utilízala GRATIS por tiempo limitado.',
      activate: 'ACTIVA EL PERIODO DE PRUEBA.',
      new_feature: 'Nueva funcionalidad',
      integration: 'DESCUBRE LAS INTEGRACIONES DISPONIBLES.',
      repeated_message:
        'Ya tienes un Automation activo asociado a tu tienda. ¿Quieres integrar tu cuenta con otro E-commerce?',
      repeated_message_for_unique_available_integration:
        'Ya tienes un Automation asociado a tu tienda.',
      integration_message:
        'Para usar este Automation conecta Doppler con tu E-commerce',
      edit_automation: 'EDITAR AUTOMATION',
      integration_names_dynamic: {
        message_part2: '{{ecommerceName}}',
        message_part2_separator1: ' y ',
        message_part2_separator2: ', ',
        message_part3: '. CREA TU AUTOMATION AHORA.',
      },
    },
    automation_task_header: {
      title: 'Define el Tipo de Campaña de Automation',
      description:
        'Tienes diferentes formas de configurar tus Campañas de Automation. Puedes decidir entre crear uno o más envíos dentro de una misma Campaña.',
      tip: 'Utiliza los distintos tipos de Campaña de Automation según el objetivo que quieres lograr. Planifica un flujo de envíos y actívalo.',
    },
    automation_breadcrumb: {
      all_automations: 'Todas mis Campañas de Automation',
      automation_types: 'Tipos de Automation',
      site_behavior: 'Comportamiento en Sitio',
    },
    modal_trial: {
      title: 'Prueba Automation por Comportamiento GRATIS',
      description:
        'Envía Emails automáticos y 100% personalizados a quienes visiten una página específica de tu sitio web o tienda online. Por ejemplo, puedes enviar un descuento a los usuarios que visitaron la página de un producto en particular para hacer que regresen a comprarlo.',
      title2: '¿Cuándo finaliza el periodo de prueba?',
      description2:
        'Nuestro objetivo es que puedas ver de qué forma utilizar esta funcionalidad en tu negocio y comprobar sus beneficios, por lo que por el momento podrás utilizarla sin limitaciones.',
      title3:
        '¿Qué sucederá con las Automations creadas cuando finalice el periodo de prueba?',
      description3:
        'Permanecerán inactivas, y no podrás editarlas hasta que contrates el módulo especial que incluye este servicio.',
      activateAutomation: 'Activar periodo de prueba',
    },
    modal_domains: {
      title:
        '¡Ya casi! Para comenzar a utilizar la funcionalidad necesitas agregar tu dominio',
      description:
        "Desde el Panel de Control podrás agregar y verificar el dominio de tu Sitio Web. ¡Es muy sencillo! Y además te lo explicamos paso a paso en un tutorial de nuestro <a class='link--default' href='https://help.fromdoppler.com/es/crear-automation-por-comportamiento-en-sitio#habilitar' target='_blank'>Help Center</a>.",
      title2: '¿Por qué es necesario que agregues y verifiques tu dominio?',
      description2:
        'De esta forma, podremos realizar el seguimiento de las páginas que determines desde tus Campañas de Automation.',
      enableDomain: 'Agregar dominio',
    },
  },
  modal_blocked_lists: {
    title:
      '¡Ouch! Este Automation contiene Listas<br> y/o Segmentos bloqueados',
    description:
      "Para poder iniciarlo, te sugerimos <b>limpiar tus Listas</b> y eliminar a los Suscriptores que afectan su calidad. También puedes <b>revertir la última importación de Suscriptores</b> que hayas realizado en una Lista bloqueada. ¿Tienes dudas? Revisa nuestro <a class='link--default' href='https://help.fromdoppler.com/es/listas-bloqueadas' target='_blank'>HELP</a>.",
    button_cancel: 'Ir más tarde',
    button_action: 'Ver Listas',
  },
  General_Required_Field: '¡Ouch! Este es un campo requerido.',

  ScheduledTask_AutomationMain_Grid_Pager: 'Mostrar mas resultados',
  CompleteInformation_Title: 'Completa la información faltante',
  CompleteInformation_Subtitle:
    'Para continuar, necesitamos saber más sobre ti. Por favor completa la información faltante en el siguiente Formulario.',
  CompleteInformation_FirstName: 'Nombre',
  CompleteInformation_LastName: 'Apellido',
  CompleteInformation_Address: 'Dirección',
  CompleteInformation_Country: 'País',
  CompleteInformation_State: 'Estado/Provincia',
  CompleteInformation_City: 'Ciudad',
  CompleteInformation_PhoneNumber: 'Teléfono',
  CompleteInformation_ZipCode: 'Código Postal',
  CompleteInformation_RequiredMessage:
    'Estamos seguros que ya lo sabes. Pero los campos con * son requeridos. ¡Gracias!',
  CompleteInformation_SaveButton: 'Guardar',
  CompleteInformation_Company: 'Empresa',
  CompleteInformation_Industry: 'Industria',
  CompleteInformation_IndustryDefault: 'Selecciona tu industria',
  General_Invalid_Field: '¡Ouch! El dato ingresado no es válido.',
  General_MaxLength_Field:
    '¡Ouch! Has alcanzado la cantidad máxima de caracteres.',

  automation_grid_header: {
    title: 'Campañas de Automation',
    description:
      'Aquí encontrarás todas tus Campañas de Automation ya sea que estén en borrador, pausadas o activas. ',
    quantity_part1: 'Actualmente tienes ',
    empty_part1: 'Actualmente no tienes ',
    empty_part2: 'ninguna Campaña.',
    quantity_part2: '  Campañas.',
    quantity_campaign: ' Campaña.',
    button: 'Crear Campaña de Automation',
  },
  automation_grid_search: 'Buscar...',
  automation_grid_headers: {
    status: 'Estado',
    type: 'Tipo',
    name: 'Nombre Campaña Automation',
    creation_date: 'Creación',
    email_sent_amount: 'Envíos',
    actions: 'Acciones',
  },
  automation_grid_reports: 'Reportes',
  automation_grid_status: {
    draft: 'Borrador',
    active: 'Activo',
    paused: 'Pausado',
    stopped: 'Detenido',
  },
  automation_grid_emtpy: {
    title: '¡Bienvenido a Automation!',
    description:
      'Programa una serie de Emails para que se envíen automáticamente cuando se cumplan criterios específicos como por ejemplo la fecha de aniversario de tus clientes, la suscripción a tu Blog, la interacción con tus Campañas anteriores o la navegación por tu Sitio Web o Tienda Online.',
    description2:
      'Capta Suscriptores, fideliza y multiplica tus ventas, ahorrando tiempo, esfuerzo y dinero.',
    link_text: 'Aprende más sobre Automation',
    link_url: 'https://help.fromdoppler.com/es/como-utilizar-email-automation/',
  },
  grid_messages: {
    delete_message:
      'La Campaña <strong>"{{campaignName}}"</strong> se eliminará permanentemente. ¿Estás seguro?',
    custom_field_deleted:
      'El Campo Fecha elegido ha sido removido. Selecciona otro o crea uno nuevo para iniciar tu Automation.',
  },
  automation_grid_start_automation_errors: {
    error_code_197:
      'Habilita la funcionalidad de Seguimiento en Sitio para activar la Campaña.',
    error_code_214:
      'Agrega un Sitio Web a tu Automation para activar la Campaña. ',
    error_code_215:
      'Verifica el Sitio Web asociado a tu Automation para poder activar la Campaña.',
    error_code_216:
      'Esta funcionalidad está habilitada solo para cuentas con Plan Pago.',
  },
  automation_replicate: {
    modal: {
      title: 'Elige el tipo de Automation',
      description:
        'Selecciona el tipo de Automation de la réplica. Luego podrás editar todos los elementos y configurar nuevas condiciones.',
      dropdown_title: 'Tipo de Automation de la réplica',
      cancel_button: 'Cancelar',
      submit_buttton: 'Confirmar',
      warning_one_option:
        'Esta réplica no permite cambiar el tipo de automation.',
    },
  },
  modal_maxsubscribers: {
    form_help: '* ¿Quieres saber porqué te solicitamos esta información?',
    form_help_link_text: 'Entérate aquí',
    title: 'Valida el origen de tus Suscriptores',
    subtitle:
      'Por favor, bríndanos tus datos de contacto para esta acción. Nos comunicaremos a la brevedad.Completa el siguiente Formulario para que podamos validar el origen de tus Suscriptores. Sólo llevará un minuto. Muchas gracias.',
    info_text:
      '** Este proceso puede presentar demoras ya que debemos analizar los datos en profundidad. Gracias por tu paciencia.',
    request_processed:
      '¡Perfecto! Estamos validando el origen de tus Suscriptores. Por favor, recuerda que este proceso puede demorar.',
  },
  modal_upgrade_plan: {
    label_plans: 'Elige tu nuevo Plan',
    label_message:
      'Cuéntanos tus necesidades y diseñaremos el Plan perfecto para ti',
    title: 'Actualiza tu Plan Mensual',
    title_top_plan: 'Solicita una actualización de tu Plan',
    success_message: '¡Hecho! Tu solicitud ha sido enviada',
    button_update: 'Actualizar Plan',
    subtitle_upgrade_plan:
      'Elige tu nuevo Plan y comienza a usarlo ahora mismo. ¡Sin validaciones extras!',
  },
  validation_messages: {
    maxlength: '¡Ouch! Has alcanzado la cantidad máxima de caracteres.',
    minlength: '¡Ouch! El número ingresado es demasiado corto.',
    required: '¡Ouch! Este es un campo requerido.',
    required_checkbox: '¡Ouch! Tienes que seleccionar al menos una opción.',
    number_pattern: 'Número inválido.',
    number_pattern_3digits:
      '¡Ouch! El número ingresado no es válido. Escribe un valor entre 0 y 999.',
    email: '¡Ouch! El Email ingresado no es válido.',
    url: '¡Ouch! La URL ingresada no es válida.',
    connection_error:
      '¡Ouch! Ha ocurrido un error de conexión. Vuelve a intentarlo más tarde.',
    rss_invalid:
      '¡Ouch! No es posible interpretar el RSS indicado. Verifícalo aquí. ',
    rss_invalid_check: 'Ej.: ',
    rss_invalid_link: 'https://validator.w3.org/feed/',
    invalid_date_time: '¡Ouch! La fecha/hora ingresada no es válida.',
    duplicated_email:
      'Ya has ingresado este Email de confirmación. ¡Prometemos recordarlo! ',
    inexistent_field: '¡Ouch! El Campo seleccionado no existe.',
    domain: '¡Ouch! El dominio ingresado no posee el formato correcto.',
    read_only_input: '¡Ouch! Para la campaña para poder editar',
    paused_input: 'Este elemento no se encuentra habilitado para la edición.',
    sms_pattern: '¡Ouch! El Sms ingresado no es válido.',
    phone_pattern: '¡Ouch! El número de Teléfono ingresado no es válido.',
    phone_pattern_too_long: '¡Ouch! El número de teléfono es demasiado largo.',
    phone_pattern_too_short: '¡Ouch! El número de teléfono es demasiado corto.',
    phone_funds_insuficient:
      '¡Ouch! No tienes fondos suficientes para realizar esta prueba.',
    phone_generic_error:
      '¡Ouch! Ha ocurrido un error, por favor inténtalo de nuevo más tarde.',
    phone_country_not_active:
      '¡Ouch! {{countryName}} no se encuentra activo en tu Panel de SMS.',
    invalid_cuit: 'CUIT inválido.',
    invalid_nit: 'NIT inválido.',
    invalid_rfc: 'RFC inválido.',
    exp_date: '¡Ouch! La Fecha de expiración ingresada no es valida.',
    generic_error_msg: '¡Ouch! Algo salió mal. Intenta nuevamente por favor.',
    url_pattern_error_message: '¡Ouch! La URL no es válida.',
    https_url_pattern_error_message:
      '¡Ouch! Ingresa una URL que comience con https://',
  },
  footer: {
    allRightReserved: 'Todos los derechos reservados',
    iso: 'Certificación de Calidad ISO 9001:2008',
    privacy: 'Políticas de privacidad y legales.',
    privacy_link: 'https://fromdoppler.com/privacidad',
  },
  form_labels: {
    email: 'Email',
    name: 'Nombre',
    lastname: 'Apellido',
    fullname: 'Nombre y Apellido',
    phone: 'Teléfono',
    address: 'Dirección',
    zip_code: 'Código Postal',
    country: 'País',
    state: 'Estado/Provincia',
    city: 'Ciudad',
    document_number: 'Número de Documento',
    document_type: 'Tipo de Documento',
    arg_dni: 'DNI/CUIL',
    arg_dni_clarification: '(Consumidor Final)',
    payment_ways: {
      credit_card: {
        type: 'Tipo de Tarjeta de Crédito',
        number: 'Número de Tarjeta',
        exp_date: 'Fecha de Expiración',
        cvv: 'Código de verificación',
      },
      transfer: {
        consumer_type: 'Tipo de Consumidor',
        cuit: 'CUIT',
        company_name: 'Razón Social',
        rfc: 'RFC',
        cdfi: 'Uso de CFDI',
        payment_method: 'Método de Pago',
        payment_type: 'Forma de Pago',
        bank_name: 'Nombre del banco',
        last_4_digits: 'Últimos 4 números de tu cuenta',
        NIT: 'NIT',
        ResponsableIVA: 'Responsable IVA',
      },
    },
  },
  button_cancel: 'Cancelar',
  button_send: 'Enviar',
  button_accept: 'Aceptar',
  button_yes: 'Si',
  button_no: 'No',
  help_link_text: 'HELP',
  actions: {
    back: 'Atrás',
    cancel: 'Cancelar',
    delete: 'Eliminar',
    edit: 'Editar',
    save: 'Guardar',
    configure: 'Configurar',
    add: 'Agregar',
    copy: 'Copiar',
    verify: 'Verificar',
    duplicate: 'Replicar',
    publish: 'Tipos de Distribución',
    start: 'Comenzar',
    enable: 'Habilitar',
    buy: 'Comprar',
    close: 'Cerrar',
    understand: 'Entendido',
    connect: 'Conectar',
    disconnect: 'Desconectar',
    activate_now: 'ACTÍVALO AHORA.',
    buy_now: 'COMPRA AHORA.',
    coming_soon: 'Próximamente',
    replicate_automation: 'Replicar Automation',
    replicate_automation_coming_soon: 'Replicar Automation (próximamente)',
    replicate_automation_disabled: 'No es posible replicar',
  },
  modal_process_file: {
    title: 'Remueve varios Suscriptores de una vez',
    subtitle:
      'Importa un archivo con el listado de Emails que deseas quitar de tus Listas de Suscriptores. ¡Atención! Una vez removidos, si deseas añadirlos nuevamente, deberás pedirles a esos Suscriptores que acepten volver a sumarse a tus Listas.',
    button_remove_subs: 'Remover Suscriptores',
    processed_title:
      ' Los Suscriptores que has indicado están siendo removidos',
    processed_subtitle:
      ' Te enviaremos un reporte a tu correo cuando el proceso haya finalizado.',
    button_processed_add: 'Cargar otra Lista',
    import_dragAndDrop_description:
      'Puedes elegir entre un archivo separado por comas (.csv) o de texto plano (.txt). Si es muy grande, puedes importarlo en formato .zip. Si tienes dudas podemos ayudarte, solo presiona ',
    import_dragAndDrop_InvalidFileType:
      '¡Ouch! Recuerda que tu archivo debe ser: .csv, .txt. o .zip.',
    dragAndDrop_FallbackMsg: "Tu browser no soporta drag'n'drop.",
    helpLink: 'http://help.fromdoppler.com/',
    dropButton_ready: 'Busca tu archivo',
    dropMessage_ready: 'Arrastra el <b>Archivo</b> aquí o ',
    dropMessage_importing: 'Importando <b>{{fileName}}</b>',
    dropMessage_imported: 'Has importado <b>{{fileName}}</b>',
    dropButton_importedWithError: 'Importa otro archivo',
    errorMessage_maxFiles: '¡Ouch! No puedes subir dos archivos en simultáneo.',
    errorMessage_fileSize:
      '¡Ouch! El tamaño de tu archivo supera los fileSize MB',
    dropButton_imported: 'Reemplazar archivo',
    selected_file: 'Has seleccionado <b>{{fileName}}</b>',
  },
  empty_filter: 'Sin Filtro',
  empty_label: 'Sin Etiqueta',
  empty_search: '¡Ups! No se han encontrado resultados para tu búsqueda.',
  control_panel: {
    dkim: {
      title: 'Configuración de DKIM y SPF',
      subtitle:
        'Activa esta tecnología para mejorar la seguridad de tus Emails y así evitar que lleguen a la bandeja de correo no deseado. ¿Necesitas ayuda? Presiona ',
      subtitle_link_text: 'Help',
      subtitle_link:
        'https://help.fromdoppler.com/es/como-activar-domain-keys/',
      grid_description:
        'Agrega todos los dominios que podrías utilizar en el Email de Remitente de tus Campañas.',
      grid_amount_of_domains_allowed_part1: 'Actualmente tienes ',
      grid_amount_of_domains_allowed_part2: '{{domainsCount}} dominios.',
      grid_amount_of_domains_allowed_part3:
        'Recuerda que puedes agregar hasta {{maxDomains}}.',
      grid_title: 'Administrador de dominios',
      create_button: 'Agregar dominio',
      grid_columns: {
        domain_name: 'Dominio',
        domain_status: 'Estado',
        is_default: 'Predeterminado',
        dkim_state: 'Estado DKIM',
        spf_state: 'Estado SPF',
        validation_date: 'Última verificación',
        confirmed: 'OptIn',
        actions: 'Acciones',
      },
      no_domains: 'No has agregado ningún dominio aún.',
      grid_states: {
        active: 'Activo',
        inactive: 'Inactivo',
        missing_user_conf: 'Pendiente',
        waiting_admin_validation: 'Verificando.',
      },
      validation_states: {
        'message-1': 'Verificado con Error. ',
        'message-2': 'Verificado. ',
        'message-3': 'No configurado. ',
        'message-4': 'Pendiente. ',
        'description-1':
          "Asegúrate de que has <br/> cumplido correctamente con todos los <br/> pasos de configuración. <a class='help' target='_blank' href='https://help.fromdoppler.com/es/como-activar-domain-keys/'>HELP</a>.",
        'description-2': 'Ya puedes comenzar <br/> a utilizar tu dominio.',
        'description-3':
          "Aún no has <br/> configurado tu {{protocol}}. Haz clic en <span class='icon-configure'></span> <br/> y sigue los pasos detallados allí.",
        'description-4':
          "Aún no has verificado tu dominio. <br/> Haz clic en el botón \"Verificar\". ¿Tienes <br/> dudas? Presiona <a class='help' target='_blank' href='https://help.fromdoppler.com/es/como-activar-domain-keys/'>HELP</a>.",
        'description-5':
          '¡Ouch! Aún no has verificado el dominio del Sitio Web sobre el que quieres realizar el seguimiento.',
        verifying: 'Estamos validando <br/> la disponibilidad del dominio.',
      },
      delete_message:
        'El Dominio <strong>"{{domainName}}"</strong> se eliminará permanentemente. ¿Estás seguro?',
      add_domain: {
        title: 'Agregar un nuevo dominio',
        subtitle:
          'Escribe el dominio que quieres agregar. Recuerda que debe respetar el siguiente formato: tusitio.com',
        domain: '* Dominio',
        domain_created:
          'Has solicitado la activación de DKIM. Estamos verificando tu pedido para el dominio <strong>{{domain}}</strong>. Te notificaremos vía Email cuando esté listo.',
        domain_duplicated_other_user:
          '¡Ouch! El dominio <strong>{{domain}}</strong> está siendo utilizado por otro usuario. Verificaremos tu pedido y te notificaremos vía Email cómo proseguir.',
        duplicated: '¡Ouch! El dominio ha sido agregado anteriormente.',
        domain_belongs_to_other:
          '¡Ouch! No puedes agregar dominios que pertenecen a terceros. <br/>Intenta nuevamente con uno propio.',
      },
      configure_domain: {
        title: 'Configurar el dominio',
        dkim_title: 'DKIM',
        dkim_subtitle:
          'Accede a la configuración de la zona DNS de tu proveedor de dominios e ingresa tu nombre de registro y clave pública. Tu DKIM no funcionará hasta que completes este paso. Si necesitas ayuda presiona ',
        dkim_help_link:
          'https://help.fromdoppler.com/es/como-activar-domain-keys',
        dkim_selector: 'Nombre del registro',
        dkim_public_key: 'Clave pública',
        spf_title: 'SPF',
        spf_subtitle:
          'Copia el registro SPF e ingrésalo también en tu proveedor de dominios.',
        spf_field: 'Registro SPF',
      },
    },
    integrations: {
      connection_issues: {
        title: 'Resolver problemas de conexión',
        subtitle: 'Detectamos errores en la conexión de Doppler y',
        list_title: 'Por favor, verifica que:',
        text_list_1: 'Tu cuenta esté activa y vigente.',
        text_list_2: 'La API de la herramienta esté funcionando correctamente.',
        text_list_3: 'Todos los permisos estén habilitados.',
        text_list_4:
          'También puedes contactar a los desarrolladores de la herramienta para identificar otros motivos posibles.',
        last_connection_text: 'Fecha primer error de conexión:',
        days_to_disconnect_plural_1: 'Si el problema persiste en los próximos',
        days_to_disconnect_plural_2:
          'días deberemos desconectarla. Te avisaremos si lo hacemos.',
        days_to_disconnect_singular:
          'Si el problema persiste nos veremos obligados a desconectarla mañana. Te avisaremos si lo hacemos.',
      },
    },
  },
  grid: {
    headers: {
      status: 'Estado',
      name: 'Nombre',
      type: 'Tipo',
      creation_date: 'Fecha de Creación',
      actions: 'Acciones',
      country: 'País',
    },
    search: 'Buscar...',
    convertion_rate_tooltip:
      '% de Usuarios que completaron el Formulario sobre el número de personas únicas que lo visitaron.',
  },
  status: {
    draft: 'Borrador',
    send: 'Publicado',
    publish_with_changes: 'Cambios sin publicar',
  },
  header: {
    availables: 'disponibles',
    enabled: 'HABILITADO',
    plan_emails: 'Envíos realizados',
    plan_prepaid: 'Plan Premium por Créditos',
    plan_suscribers: 'Suscriptores',
    profile: 'Perfil:',
    send_emails: 'Envío de Emails',
    send_request: 'SOLICITUD ENVIADA',
    tooltip_help:
      'Estamos diseñando un Plan a la medida de tus necesidades. ¡Te contactaremos pronto!',
  },
  'confirmation-upgrade-plan-popup': {
    title: '¡Hecho!',
    subtitle_subscribers:
      'Acabas de contratar un nuevo Plan Mensual para enviar Campañas ilimitadas hasta <b>{{subscribersNumber}} Contactos.</b> Te enviaremos un email con el detalle del nuevo Plan.',
    subtitle_high_volumen:
      'Acabas de contratar un nuevo Plan Mensual para enviar Campañas ilimitadas hasta <b>{{subscribersNumber}} Envíos.</b> Te enviaremos un email con el detalle del nuevo Plan.',
  },
  General_Required_Field: '¡Ouch! Este es un campo requerido.',
  ScheduledTask_Reports_LinkToList: 'Listado Campañas Email Automation',
  ScheduledTask_Reports_Title: 'Tasa de Entrega y Resumen',
  ScheduledTask_Reports_Subtitle:
    'El siguiente reporte ofrece una visualización general del rendimiento de tu Campaña.',
  ScheduledTask_Reports_LastWeek: 'Última semana',
  ScheduledTask_Reports_LastMonth: 'Último mes',
  ScheduledTask_Reports_LastYear: 'Último año',
  ScheduledTask_Reports_All: 'Desde el inicio ',
  ScheduledTask_Reports_Grid_Header_SentEmails: 'Emails enviados',
  ScheduledTask_Reports_Grid_Header_OpenEmails: 'Emails abiertos',
  ScheduledTask_Reports_Grid_Header_TotalClicks: 'Clicks totales',
  ScheduledTask_Reports_Grid_Header_Unsubscribe: 'Removidos',
  ScheduledTask_Reports_Grid_Title: 'Grilla diaria',
  ScheduledTask_Reports_Grid_Subtitle:
    'Analiza de manera detallada información valiosa de tu Campaña de Email Automation.',
  ScheduledTask_Reports_Grid_Day: 'Fecha',
  ScheduledTask_Reports_Grid_Sent: 'Enviados',
  ScheduledTask_Reports_Grid_Delivered: 'Entregados',
  ScheduledTask_Reports_Grid_Open: 'Aperturas',
  ScheduledTask_Reports_Grid_Clicks: 'Clicks',
  ScheduledTask_Reports_Grid_Unsubscriber: 'Removidos',
  ScheduledTask_Reports_Grid_Shared: 'Compartidos',
  ScheduledTask_Reports_Grid_CTOR: 'CTOR',
  ScheduledTask_Reports_Filter_Action: 'Filtro por Campaña',
  ScheduledTask_Reports_CancelFilter: 'Cancelar',
  ScheduledTask_Reports_Filter: 'Filtrar',
  ScheduledTask_Reports_GraphicReport: 'Gráficos',
  ScheduledTask_Reports_DetailReport: 'Grilla diaria',
  ScheduledTask_Reports_Open: 'Abiertos',
  ScheduledTask_Reports_NotOpen: 'No Abiertos',
  ScheduledTask_Reports_Bounced: 'Rebotes',
  ScheduledTask_Reports_MenuOpened: 'Abiertos',
  ScheduledTask_Reports_MenuNotOpened: 'No Abiertos',
  ScheduledTask_Reports_MenuBounced: 'Rebotes',
  ScheduledTask_Reports_ClickRate: 'Click Through Open Rate:',
  ScheduledTask_Reports_DonutData_Title: 'Resumen de Campaña',
  ScheduledTask_Reports_DonutData_SentEmails: 'Emails enviados',
  ScheduledTask_Reports_DonutData_DeliveredEmail: 'Emails Entregados',
  ScheduledTask_Reports_DonutData_Resent: 'Cantidad de Reenvíos',
  ScheduledTask_Reports_DonutData_Opens: 'Total de Aperturas',
  ScheduledTask_Reports_DonutData_LastOpen: 'Última Apertura',
  ScheduledTask_Reports_DonutData_UniqueClick: 'Clicks Únicos',
  ScheduledTask_Reports_DonutData_UniqueOpen: 'Aperturas Únicas',
  ScheduledTask_Reports_DonutData_TotalClick: 'Clicks Totales',
  ScheduledTask_Reports_DonutData_LastClick: 'Último Click',
  ScheduledTask_Reports_DonutData_AmountRemoved: 'Cantidad de Remociones',
  ScheduledTask_Summary_Subtitle_FrequencyType1_Part0:
    'El envío de esta secuencia comienza al cumplirse el siguiente criterio:',
  ScheduledTask_Summary_Subtitle_FrequencyType2_Part1: 'Cada {{dayPerWeek}}',
  ScheduledTask_Summary_Subtitle_FrequencyType3_Part1:
    'Día {{dayPerMonth}} de cada mes',
  ScheduledTask_Reports_Opens_Title: 'Reporte de Aperturas',
  ScheduledTask_Reports_Opens_Subtitle:
    'En el siguiente gráfico podrás visualizar las aperturas que ha obtenido tu Campaña, o cada uno de los Emails que contenga, dentro del período que has seleccionado.',
  ScheduledTask_Reports_Clicks_Title: 'Reporte de Clicks',
  ScheduledTask_Reports_Clicks_Subtitle:
    'Visualiza los Clicks que ha obtenido tu Campaña, o cada uno de los Emails que contenga, dentro del período que has seleccionado.',
  ScheduledTask_Summary_Day_Sunday: 'Domingo',
  ScheduledTask_Summary_Day_Monday: 'Lunes',
  ScheduledTask_Summary_Day_Tuesday: 'Martes',
  ScheduledTask_Summary_Day_Wednesday: 'Miércoles',
  ScheduledTask_Summary_Day_Thursday: 'Jueves',
  ScheduledTask_Summary_Day_Friday: 'Viernes',
  ScheduledTask_Summary_Day_Saturday: 'Sábado',
  ScheduledTask_Summary_Day_And: 'y',
  ScheduledTask_Reports_OpenRate: 'Tasa de Entrega',
  ScheduledTask_Reports_NoOpens: 'Recolectando datos',
  ScheduledTask_Reports_Funnel_Title: 'Embudo de Conversión',
  ScheduledTask_Reports_Funnel_Subtitle:
    'Analiza el camino que recorren tus Suscriptores hacia tu objetivo final.',
  ScheduledTask_Reports_Engagement_Title: 'Fidelidad',
  ScheduledTask_Reports_Engagement_Subtitle:
    'Descubre Suscriptores que poseen mayor interés en tus envíos.',
  ScheduledTask_Reports_OpenGraph_tooltip: 'Aperturas',
  ScheduledTask_Reports_Engagement_Points: 'Puntos',
  ScheduledTask_Reports_Engagement_Email: 'Email',
  ScheduledTask_Reports_Engagement_Name: 'Nombre',
  ScheduledTask_Reports_Engagement_DownloadList: 'Descargar Lista',
  ScheduledTask_Reports_Graphic_Subtitle:
    'En el siguiente Reporte podrás medir la tasa de entrega, apertura y rebotes de tu Campaña.',
  ScheduledTask_Reports_Graphic_EmptyEngagement:
    'No se registra actividad en el reporte de Fidelidad.',
  ScheduledTask_Reports_FunnelOpen: 'Abiertos',
  ScheduledTask_Reports_Total_Sms: 'SMS Enviados',
  ScheduledTask_Reports_Delivered_Sms: 'Destinatarios',
  ScheduledTask_Reports_Reached_Subscriptors: 'SMS Entregados',
  ScheduledTask_Reports_Not_Reached_Subscriptors: 'SMS No Entregados',
  ScheduledTask_Reports_Sms_Link:
    'Descargar el Reporte completo del periodo seleccionado >>',
  ScheduledTask_Sms_Title: 'Reporte de Entrega de SMS',
  ScheduledTask_Reports_Sms_Country_Title: 'Resultados por país',
  ScheduledTask_Reports_Sms_reports_export_title: 'Pedido de Exportación',
  ScheduledTask_Reports_Sms_reports_export_subtitle:
    'Por favor, seleccione el formato de Excel en el que desea recibir el informe',
  ScheduledTask_Reports_Sms_reports_export_check:
    'Quiero recibir un email cuando el archivo esté listo para descargar.',
  ScheduledTask_Reports_Sms_reports_export_button: 'Enviar Solicitud',
  xls_2003_option: 'XLS Office 2003',
  xlsx_2007_option: 'XLSX Office 2007',
  ScheduledTask_Reports_Sms_reports_export_label:
    'Email en el que deseas recibir el link de descarga:',
  ExportReports: {
    title: 'Solicitud Aprobada',
    description:
      'El sistema está procesando la información. Recuerda revisar tu casilla de correo ya que es allí donde recibirás el enlace de descarga de este reporte.',
    description2:
      'Si deseas conocer el estado de esta u otras solicitudes por favor dirígete a la página Administrador de Descargas',
    buttonLabel: 'Ir al Centro de Descargas',
  },
  ScheduledTask_Reports_Sms_title: 'Campañas de SMS',
  ScheduledTask_Reports_Sms_subtitle:
    'Conoce la cantidad de SMS enviados, entregados y no entregados en total y por país.',
  ScheduledTask_Reports_Campaigns_title: 'Campañas de Email',
  ScheduledTask_Reports_Push_title: 'Campañas de Notificaciones Push',
  ScheduledTask_Push_Title: 'Reporte de Entrega de Notificaciones Push',
  ScheduledTask_Reports_Push_subtitle:
    'Conoce la cantidad de Notificaciones Push enviadas, entregadas y no entregadas en total.',
  ScheduledTask_Reports_Push_Reached_Subscriptors: 'Entregadas',
  ScheduledTask_Reports_Push_Not_Reached_Subscriptors: 'No Entregadas',
  ScheduledTask_Reports_Total_Push: 'Enviadas',
  ScheduledTask_Reports_Push_Link:
    'Descargar el Reporte completo del periodo seleccionado >>',
  ScheduledTask_Export_Automation_Campaign_Title:
    'Reporte por campaña de automation',
  ScheduledTask_Export_Automation_Campaign_Description:
    'Podrás visualizar las métricas relacionadas a tus campañas de automation, tales como número de entregas, aperturas, rebotes y clics.',
  ScheduledTask_Export_Automation_Subscriber_Title: 'Reporte por contacto',
  ScheduledTask_Export_Automation_Subscriber_Description:
    'Podrás visualizar las métricas relacionadas a tus campañas de automation detallado por contacto, número de aperturas y clics.',
  ScheduledTask_Export_Automation_Download: 'Descargar',
};
