'use strict';
/**
 * @fileOverview Define proxy url in the develop environment
 */

const npmEventName = process.env.npm_lifecycle_event;
let h5NginxProxyTarget;

switch (npmEventName) {
    // develop url
    case 'dev':
    case 'dev:dev':
        h5NginxProxyTarget = 'http://dev-admin.tianchiapi.com';
        break;
    // test url
    case 'dev:test':
        h5NginxProxyTarget = 'http://test-admin.tianchiapi.com';
        break;
    // test url
    case 'dev:prod':
        break;
    // xiongbao gateway
    case 'dev:xiongbao':
        break;
    case 'dev:chongqing':
        h5NginxProxyTarget = 'http://admin.tianchiapi.com';
        break;
    case 'dev:lian':
        break;
    // default is dev url
    default:
        h5NginxProxyTarget = 'http://dev-admin.tianchiapi.com';
        break;
}

module.exports = {h5NginxProxyTarget};
