var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');

chai.use(sinonChai);

if (!global.document || !global.window) {
  var jsdom = require('jsdom').jsdom;
  global.document = jsdom('<html><head><script></script></head><body></body></html>');
  global.window = document.createWindow();
}

var $ = require('jquery');
var Backbone = require('backbone');
Backbone.$ = $;
var Behavior = require('../../../.tmp/behavior');

global.sinon = sinon;
global.expect = chai.expect;
global.Backbone = Backbone;
global.Behavior = Behavior;
