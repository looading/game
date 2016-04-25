// map modal
var map = require('./map')

// hero modal
var hero = require('./hero')

// event modal
var event = require('./event')

// obstacle modal
var obstacle = require('./obstacle')

// robot modal
var robot = require('./robot')

// power-up modal
var power = require('./v')

var attr = require('./attr')


var setup = require('./setup')

map.render()

attr.render()

/**
 * game main entry
 */

setup.bind()

event.init()


