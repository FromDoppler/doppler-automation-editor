(function() {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .factory('WhatsappComponent', ['BaseComponent', 'COMPONENT_TYPE', function(BaseComponent, COMPONENT_TYPE) {

      function WhatsappComponent(data) {
        // Inherited constructor.
        BaseComponent.call(this, {
          type: COMPONENT_TYPE.WHATSAPP
        });

        this.id = 0;
        this.name = '';
        this.room = {
          id: 0,
          name: '',
          phoneNumber: '',
        }
        this.template = {
          roomId: 0,
          id: 0,
          name: '',
          content: '',
          headerText: '',
          bodyText: '',
          footerText: '',
          variables: [],
        }
        
        if (data) {
          this.setData(data);
        }
      }

      function checkCompleted_whatsapp_template_variable(variable) {
        if(variable.length === 0) {
          return true;
        }
        return !variable.some((x) => x['field'] == undefined)
      }

      // Prototype inherence from BaseComponent.
      WhatsappComponent.prototype = Object.create(BaseComponent.prototype);
      WhatsappComponent.prototype.markup = '<dp-editor-whatsapp class="component--container whatsapp" component="component" branch="branch"></dp-editor-whatsapp>';
      WhatsappComponent.prototype.panelTemplate = '<div dp-editor-panel-whatsapp></div>';

      WhatsappComponent.prototype.setData = function(data) {
        BaseComponent.prototype.setData.call(this, data);
        //custom field to send message
        if (data.hasOwnProperty('field')) {
          this.field = data.field;
        }
        if (data.hasOwnProperty('room')) {
          this.room = data.room;
        }
        if (data.hasOwnProperty('template')) {
          this.template = data.template;
          // temporal hardcode fix beplic mock adapt
          if(data.template){
            const content = data.template.content? data.template.content.split('|'): [];
            data.template.headerText = content[0];
            data.template.bodyText = content[1];
            data.template.footerText = content[2];
          }
        }
        if (data.hasOwnProperty('name')) {
          this.name = data.name;
        }
        if (data.hasOwnProperty('id')) {
          this.id = data.id;
        }
      };

      WhatsappComponent.prototype.checkCompleted = function() {
        this.completed = !!this.field && !!this.room  && !!this.template && this.name !== '' && !!checkCompleted_whatsapp_template_variable(this.template.variables);
      };

      WhatsappComponent.prototype.getPropertiesToWatch = function() {
        var properties = BaseComponent.prototype.getPropertiesToWatch();
        return properties.concat([
          'field',
          'room',
          'template',
          'name'
        ]);
      };

      return WhatsappComponent;
    }]);
})();
