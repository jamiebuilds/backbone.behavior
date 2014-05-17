var classTypes = ['Model', 'Collection', 'View'];
var whitelist = { View: ['$el', 'id', 'className', 'attributes'] };

var behaviorProps = {};
var backboneEventsKeys = _.keys(Backbone.Events);

_.each(classTypes, function (type) {
  var backboneClassKeys = _.keys(Backbone[type].prototype);

  var validKeys = _.reject(backboneClassKeys, function (backboneClassKey) {
    return _.contains(backboneEventsKeys, backboneClassKey);
  });

  behaviorProps[type] = validKeys.concat(whitelist[type]);
});

var Behavior = function (context, options) {
  var originalTrigger = context.trigger;

  context.trigger = _.bind(function () {
    this.trigger.apply(this, arguments);
    originalTrigger.apply(context, arguments);
  }, this);

  var classType = _.find(classTypes, function (classType) {
    return context instanceof Backbone[classType] || context._classType === classType;
  });

  if (!classType) {
    throw new TypeError('Behavior only works with Models, Collections, or Views.');
  }

  this._classType = classType;

  var props = behaviorProps[classType];

  _.each(props, function (prop) {
    if (_.isUndefined(context[prop]) || !!this[prop]) {
      return;
    }

    if (_.isFunction(context[prop])) {
      this[prop] = _.bind(context[prop], context);
    } else {
      this[prop] = context[prop];
    }
  }, this);

  this.initialize(options);

  return {
    stop: this.stop
  };
};

_.extend(Behavior.prototype, Backbone.Events, {
  initialize: function () {},
  stop: function () {
    this.stopListening();
  }
});

Behavior.extend = Backbone.View.extend;
