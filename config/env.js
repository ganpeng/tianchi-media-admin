'use strict'

/**
 * @fileOverview Define proxy url in the develop environment
 */

const npmEventName = process.env.npm_lifecycle_event
let proxyTarget
switch (npmEventName) {
    // develop url
    case 'dev':
    case 'dev:dev':
        proxyTarget = 'http://dev-gateway.backend.tianchimedia.com'
        break
    // test url
    case 'dev:test':
        proxyTarget = 'http://test-gateway.backend.tianchimedia.com'
        break
    // test url
    case 'dev:prod':
        proxyTarget = 'http://gateway.backend.tianchimedia.com'
        break
    // xiongbao gateway
    case 'dev:xiongbao':
        proxyTarget = 'http://10.0.3.244:8100'
        break
    // default is dev url
    default:
        proxyTarget = 'http://dev-gateway.backend.tianchimedia.com'
        break
}


module.exports = {proxyTarget}
