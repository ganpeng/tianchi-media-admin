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
        h5NginxProxyTarget = 'http://dev2-admin.tianchiapi.com';
        // h5NginxProxyTarget = 'http://114.251.90.251:80';
        break;
    // test url
    case 'dev:test':
        h5NginxProxyTarget = 'http://test2-admin.tianchiapi.com';
        break;
    // test url
    case 'dev:prod':
        break;
    // xiongbao gateway
    case 'dev:xiongbao':
        h5NginxProxyTarget = '10.0.3.140:8240';
        break;
    // wubinhong gateway
    case 'dev:wubinhong':
        h5NginxProxyTarget = 'http://172.16.41.200:8100';
        break;
    case 'dev:xingyu':
        h5NginxProxyTarget = 'http://10.0.3.133:8100';
        break;
    case 'dev:chongqing':
        h5NginxProxyTarget = 'http://admin.tianchiapi.com';
        break;
    case 'dev:wuchuan':
        h5NginxProxyTarget = 'http://admin.tianchiapi.com';
        break;
    case 'dev:demo':
        h5NginxProxyTarget = 'http://demo2-admin.tianchiapi.com';
        break;
    case 'dev:honghe':
        h5NginxProxyTarget = 'http://honghe-admin.tianchiapi.com';
        break;
    case 'dev:lian':
        h5NginxProxyTarget = 'http://10.0.3.147:8100';
        break;
    // default is dev url
    default:
        h5NginxProxyTarget = 'http://dev-admin.tianchiapi.com';
        break;
}

module.exports = {h5NginxProxyTarget};
