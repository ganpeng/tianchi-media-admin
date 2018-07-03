'use strict';

/**
 * @fileOverview Define proxy url in the develop environment
 */

const npmEventName = process.env.npm_lifecycle_event;
let proxyTarget;
let uploadProxyTarget;
switch (npmEventName) {
    // develop url
    case 'dev':
    case 'dev:dev':
        proxyTarget = 'http://dev-gateway.tianchiapi.com';
        uploadProxyTarget = 'http://dev-storage.tianchiapi.com';
        break;
    // test url
    case 'dev:test':
        proxyTarget = 'http://test-gateway.tianchiapi.com';
        break;
    // test url
    case 'dev:prod':
        proxyTarget = 'http://gateway.tianchiapi.com';
        break;
    // xiongbao gateway
    case 'dev:xiongbao':
        proxyTarget = 'http://10.0.3.250:8100';
        break;
    case 'dev:lian':
        proxyTarget = 'http://10.0.3.237:8100';
        uploadProxyTarget = 'http://10.0.3.237:8230';
        break;
    // default is dev url
    default:
        proxyTarget = 'http://dev-gateway.backend.tianchimedia.com';
        break;
}

module.exports = {proxyTarget, uploadProxyTarget};
