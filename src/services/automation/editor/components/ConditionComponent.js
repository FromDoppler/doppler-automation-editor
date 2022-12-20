(function() {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .factory('ConditionComponent', ['$injector', 'BaseComponent', 'COMPONENT_TYPE', 'CONDITION_BRANCH', 'CONDITION_OPERATOR', 'CONDITIONAL_TYPE', 'conditionsDataservice', function($injector, BaseComponent, COMPONENT_TYPE, CONDITION_BRANCH, CONDITION_OPERATOR, CONDITIONAL_TYPE, conditionsDataservice) {

      function ConditionComponent(data) {
        // Inherited constructor.
        BaseComponent.call(this, {
          type: COMPONENT_TYPE.CONDITION
        });

        this.name = '';
        this.conditionals = [];
        this.operator = CONDITION_OPERATOR.AND;
        this.time = '';
        this.timeUnit = 'hours';
        this.positiveSiblings = [];
        this.negativeSiblings = [];

        if (data) {
          this.setData(data);
        }
      }

      // Prototype inherence from BaseComponent.
      ConditionComponent.prototype = Object.create(BaseComponent.prototype);
      ConditionComponent.prototype.markup = '<dp-editor-condition class="component--container condition" component="component" branch="branch"></dp-editor-condition>';
      ConditionComponent.prototype.panelTemplate = '<div dp-editor-panel-condition class="dp-editor-panel-condition"></div>';
      ConditionComponent.prototype.setData = function(data) {
        var self = this;
        var automation = $injector.get('automation');

        BaseComponent.prototype.setData.call(self, data);
        automation.addComponentAsParent(this);
        conditionsDataservice.addConditionReference(this.uid);

        if (data.hasOwnProperty('name')) {
          self.name = data.name;
        }
        if (data.hasOwnProperty('conditionals')) {
          _.each(data.conditionals, function(conditionalData) {
            self.addConditional(automation.createConditional(conditionalData));
          });
        }
        if (data.hasOwnProperty('operator')) {
          self.operator = data.operator;
        }
        if (data.hasOwnProperty('time')) {
          self.time = data.time;
        }
        if (data.hasOwnProperty('timeUnit') && data.timeUnit) {
          self.timeUnit = data.timeUnit;
        }
        if (data.hasOwnProperty('positiveSiblings')) {
          _.each(data.positiveSiblings, function(child, index) {
            automation.addComponent(child, index, CONDITION_BRANCH.POSITIVE);
          });
        }
        if (data.hasOwnProperty('negativeSiblings')) {
          _.each(data.negativeSiblings, function(child, index) {
            automation.addComponent(child, index, CONDITION_BRANCH.NEGATIVE);
          });
        }
      };

      ConditionComponent.prototype.addChildComponent = function(child, index, branch) {
        this[branch].splice(index, 0, child);
        conditionsDataservice.addChildReference(this.uid, child, branch);
      };

      ConditionComponent.prototype.removeChildComponent = function(component, branch) {
        this[branch].splice(this[branch].indexOf(component), 1);
        conditionsDataservice.removeChildReference(this.uid, component.uid);
      };

      ConditionComponent.prototype.addConditional = function(newConditional, oldConditional, index) {
        var conditionals = this.conditionals;
        if (oldConditional) {
          conditionals = _.without(conditionals, oldConditional);
          conditionsDataservice.removeConditionalReference(oldConditional);
        }
        newConditional.conditionUid = this.uid;
        conditionals.splice(index >= 0 ? index : conditionals.length, 0, newConditional);
        conditionsDataservice.addConditionalReference(newConditional);
        this.conditionals = conditionals;
      };

      ConditionComponent.prototype.removeConditional = function(conditionalToRemove) {
        this.conditionals = _.filter(this.conditionals, function(conditional) {
          return conditional.uid !== conditionalToRemove.uid;
        });
        conditionsDataservice.removeConditionalReference(conditionalToRemove);
      };

      ConditionComponent.prototype.getChildIndex = function(child, branch) {
        return this[branch].indexOf(child);
      };

      ConditionComponent.prototype.getConditionalIndex = function(conditional) {
        return this.conditionals.indexOf(conditional);
      };

      ConditionComponent.prototype.getChildByUid = function(uid) {
        return conditionsDataservice.getChildReference(this.uid, uid);
      };

      ConditionComponent.prototype.getEmailChildById = function(idEmail) {
        return conditionsDataservice.getEmailChildReference(this.uid, idEmail);
      };

      ConditionComponent.prototype.getEmailChildrenComponents = function() {
        return conditionsDataservice.getAllEmailChildReference(this.uid);
      };

      ConditionComponent.prototype.getEmailChildren = function(childUid, childIndex) {
        var self = this;
        var emailComponents = [];
        var branch = conditionsDataservice.getChildBranch(this.uid, childUid);

        _.each(_.filter(this[branch], function(child) {
          var index = self.getChildIndex(child, branch);
          return child.type === COMPONENT_TYPE.CAMPAIGN && index < childIndex;
        }), function(emailComponent) {
          emailComponents.push({
            label: emailComponent.name,
            idEmail: emailComponent.id,
            uidEmail: emailComponent.uid
          });
        });

        return emailComponents.length > 1 ? emailComponents.reverse() : emailComponents;
      };

      ConditionComponent.prototype.getChildrenToTransfer = function(index, branch) {
        return this[branch].slice(index, this[branch].length);
      };

      ConditionComponent.prototype.hasNextComponent = function(component, branch) {
        if (!branch || !this[branch].length) {
          return false;
        }
        var nextIndex = this[branch].indexOf(component) + 1;
        return !!this[branch][nextIndex];
      };

      ConditionComponent.prototype.checkCompleted = function() {
        var completed = this.conditionals.length > 0;
        var hasAtLeastOneCampaignOrSiteBehavior = !!_.find(this.conditionals, function(conditional) {
          return conditional.type === CONDITIONAL_TYPE.CAMPAIGN_BEHAVIOR
          || conditional.type === CONDITIONAL_TYPE.SITE_BEHAVIOR;
        });

        _.each(this.conditionals, function(conditional) {
          conditional.checkCompleted();
          if (completed && !conditional.completed) {
            completed = conditional.completed;
          }
        });
        if (completed && hasAtLeastOneCampaignOrSiteBehavior) {
          completed = Number.isInteger(parseInt(this.time));
        }

        if (this.type === CONDITIONAL_TYPE.SITE_BEHAVIOR) {
          var onlyUrls = this.conditionals.map(function(object) {
            return object.domain.url;
          });

          if (_.uniq(onlyUrls, false).length < this.conditionals.length) {
            completed = false;
          }
        }

        this.completed = completed;
      };

      ConditionComponent.prototype.hasWarnings = function() {
        var hasWarnings = false;

        hasWarnings = !this.positiveSiblings.length && !this.negativeSiblings.length;
        if (!hasWarnings) {
          hasWarnings = !!(this.positiveSiblings.length
            && this.positiveSiblings[this.positiveSiblings.length - 1].type === COMPONENT_TYPE.DELAY
            || this.negativeSiblings.length
            && this.negativeSiblings[this.negativeSiblings.length - 1].type === COMPONENT_TYPE.DELAY);
        }

        return hasWarnings;
      };

      ConditionComponent.prototype.isFlowComplete = function(atLeastOneCampaign) {
        var isFlowComplete = true;
        var hasWarnings = false;
        var conditionFlowComplete;
        var hasAtLeastOneCampaign = atLeastOneCampaign;
        var allChildren = conditionsDataservice.getAllConditionChildren(this.uid);
        var index = 0;

        while (isFlowComplete && index < allChildren.length) {
          if (!allChildren[index].completed && isFlowComplete) {
            isFlowComplete = false;
          }
          if (isFlowComplete && !hasAtLeastOneCampaign && allChildren[index].type === COMPONENT_TYPE.CAMPAIGN) {
            hasAtLeastOneCampaign = true;
          }
          if (isFlowComplete && allChildren[index].type === COMPONENT_TYPE.CONDITION) {
            conditionFlowComplete = allChildren[index].isFlowComplete(hasAtLeastOneCampaign);
            isFlowComplete = conditionFlowComplete.isFlowComplete;
            hasAtLeastOneCampaign = conditionFlowComplete.hasAtLeastOneCampaign;
            if (isFlowComplete && !hasWarnings) {
              hasWarnings = allChildren[index].hasWarnings();
            }
          }
          index++;
        }

        return {
          isFlowComplete: isFlowComplete,
          hasAtLeastOneCampaign: hasAtLeastOneCampaign,
          hasWarnings: hasWarnings
        };
      };

      ConditionComponent.prototype.getPropertiesToWatch = function() {
        return [
          'name',
          'operator',
          'time',
          'timeUnit'
        ];
      };

      return ConditionComponent;
    }]);
})();
