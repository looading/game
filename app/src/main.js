// map modal
const map = require('./map')

// hero modal
const hero = require('./hero')

// event modal
const event = require('./event')

// obstacle modal
const obstacle = require('./obstacle')

// robot modal
const robot = require('./robot')

// power-up modal
const power = require('./v')

const attr = require('./attr')


const setup = require('./setup')

map.render()

attr.render()

/**
 * game main entry
 */

setup.bind()

event.init()


