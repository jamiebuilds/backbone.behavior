var Behavior = function (context, options) {
  this.parent = context.parent || context;
  this.stack = context.stack || [];
  this.stack.push(this);
  this.initEventForwarding(options);
  this.initialize.apply(this, _.toArray(arguments).slice(1));
  return { stop: _.bind(this.stop, this), __behavior__: this };
};

_.extend(Behavior.prototype, Backbone.Events, {
  initialize: function () {},

  initEventForwarding: function (options) {
    if (!this.parent.trigger.isWrapped) {
      var stack = this.stack;
      var originalTrigger = this.parent.trigger;

      this.parent.trigger = function () {
        var args = arguments;

        _.each(stack, function (behavior) {
          behavior.trigger.apply(behavior, args);
        });

        originalTrigger.apply(this, args);
      };

      this.parent.trigger.isWrapped = true;
    }
  },

  stop: function () {
    this.stopListening();
  }
});

Behavior.extend = Backbone.View.extend;
