'use strict'

/**
 * @fileOverview Define proxy url in the develop environment
 */

const util = require('../build/extend')

const npmEventName = process.env.npm_lifecycle_event
let proxyENV
switch (npmEventName) {
    // develop url
    case 'dev:dev':
        proxyENV = 'dev-'
        break
    // test url
    case 'dev:test':
        proxyENV = 'test-'
        break
    // test url
    case 'dev:prod':
        proxyENV = ''
        break
    // default is dev url
    default:
        proxyENV = 'dev-'
        break
}

const proxyTarget = util.format('http://{0}gateway.backend.tianchimedia.com', proxyENV)

module.exports = {proxyTarget}
