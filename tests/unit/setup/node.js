var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');

chai.use(sinonChai);

global.sinon = sinon;
global.expect = chai.expect;

var $ = require('jquery');
var Backbone = require('backbone');
Backbone.$ = $;

global.Behavior = require('../../../.tmp/behavior');
