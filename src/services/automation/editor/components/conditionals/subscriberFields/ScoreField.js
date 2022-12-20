(function() {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .factory('ScoreField', ['BaseField', function(BaseField) {

      function ScoreField(data) {
        // Inherited constructor.
        BaseField.call(this, data);
        this.score = {
          id: 0,
          name: ''
        };

        if (data) {
          this.setData(data);
        }
      }

      // Prototype inherence from BaseField.
      ScoreField.prototype = Object.create(BaseField.prototype);
      ScoreField.prototype.setData = function(data) {
        BaseField.prototype.setData.call(this, data);
        if (data.hasOwnProperty('score')) {
          this.score = data.score;
        }
      };

      ScoreField.prototype.checkCompleted = function() {
        return (!this.deleted && this.score.id !== 0);
      };

      return ScoreField;
    }]);
})();

