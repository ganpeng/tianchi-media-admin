/**
 * @fileOverview Define global instance of web storage
 */

import engine from 'store/src/store-engine';
import webLocalStorage from 'store/storages/localStorage';
import webSessionStorage from 'store/storages/sessionStorage';
import defaultPlugin from 'store/plugins/defaults';
import expirePlugin from 'store/plugins/expire';

let sessionStorages = [webSessionStorage];
let localStorages = [webLocalStorage];

let plugins = [defaultPlugin, expirePlugin];

let wsCache = {
    sessionStorage: engine.createStore(sessionStorages, plugins),
    localStorage: engine.createStore(localStorages, plugins)
};

export default wsCache;
