/**
 * @fileOverview Set the store data when the page is reloaded.
 */

import store from '../store';
import Cookies from 'js-cookie';
import wsCache from '@/util/webStorage';

if (Cookies.get('token') && !store.state.user.token) {
    // 设置cookie中的系统用户信息
    store.dispatch('user/reLogin', {
        name: Cookies.get('name'),
        token: Cookies.get('token')
    });
    // 设置localStorage中的系统信息
    if (wsCache.localStorage.get('todayRecommend')) {
        store.dispatch('todayRecommend/reloadData', wsCache.localStorage.get('todayRecommend'));
    }
}
