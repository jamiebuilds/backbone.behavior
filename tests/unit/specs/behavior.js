describe('Behavior', function () {
  beforeEach(function () {
    this.Behavior = Behavior.extend({
      foo: 'bar'
    });
  });

  describe('extend', function () {
    it('should create a subclass', function () {
      expect(this.Behavior.__super__).to.equal(Behavior.prototype);
      expect(this.Behavior.prototype).to.have.property('foo', 'bar');
    });
  });

  describe('constructor', function () {
    beforeEach(function () {
      this.fooOption = 'foo';
      this.barOption = 'bar';
      this.view = new Backbone.View();

      this.initEventForwardingStub = sinon.spy(this.Behavior.prototype, 'initEventForwarding');
      this.initializeStub = sinon.spy(this.Behavior.prototype, 'initialize');
      this.stopStub = sinon.spy(this.Behavior.prototype, 'stop');

      this.behavior = new this.Behavior(this.view, this.fooOption, this.barOption).__behavior__;
      this.behavior.stop();
    });

    it('should set the parent property', function () {
      expect(this.behavior.parent).to.deep.equal(this.view);
    });

    it('should add itself to the stack', function () {
      expect(this.behavior.stack[0]).to.deep.equal(this.behavior);
    });

    it('should call initEventForwarding', function () {
      expect(this.initEventForwardingStub).to.have.been.calledWithExactly(this.fooOption);
    });

    it('should call initialize with options', function () {
      expect(this.initializeStub).to.have.been.calledWithExactly(this.fooOption, this.barOption);
    });

    it('should bind stop to itself', function () {
      expect(this.stopStub).to.have.been.calledOn(this.behavior);
    });
  });

  describe('initEventForwarding', function () {
    beforeEach(function () {
      this.fooArg = 'foo';
      this.barArg = 'bar';

      this.initEventForwarding = this.Behavior.prototype.initEventForwarding;
      this.triggerStub1 = sinon.stub();
      this.triggerStub2 = sinon.stub();
      this.stack = [{ trigger: this.triggerStub1 }, { trigger: this.triggerStub2 }];
      this.parent = new Backbone.Model();

      this.initEventForwarding();
      this.parent.trigger(this.fooArg, this.barArg);
    });

    it('should wrap parent trigger', function () {
      expect(this.parent.trigger.isWrapped).to.be.true;
    });

    it('should setup event forwarding from parent', function () {
      expect(this.triggerStub1).to.have.been.calledWithExactly(this.fooArg, this.barArg);
      expect(this.triggerStub2).to.have.been.calledWithExactly(this.fooArg, this.barArg);
    });
  });

  describe('stop', function () {
    beforeEach(function () {
      this.collection = new Backbone.Collection();
      this.stopStub = sinon.spy(this.Behavior.prototype, 'stop');
      this.behavior = new this.Behavior(this.collection);
      this.behavior.stop();
    });

    it('should call stopListening', function () {
      expect(this.stopStub).to.have.been.calledOnce;
    });
  });
});
