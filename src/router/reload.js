/**
 * @fileOverview Set the store data when the page is reloaded.
 */

import store from '../store';
import service from '../service';
import Cookies from 'js-cookie';
import wsCache from '@/util/webStorage';
import util from '@/util/extend';

if (Cookies.get('token') && !store.state.user.token) {
    // 设置cookie中的系统用户信息
    store.dispatch('user/reLogin', {
        name: Cookies.get('name'),
        token: Cookies.get('token')
    });
    // 设置localStorage中的系统信息
    if (wsCache.localStorage.get('layout')) {
        store.commit('layout/setState', wsCache.localStorage.get('layout'));
    }
    // 获取区域列表
    if (!wsCache.localStorage.get('areaList')) {
        service.fetchAreaList()
            .then((res) => {
                if (res && res.code === 0) {
                    wsCache.localStorage.set('areaList', res.data);
                }
            });
    }
    // 设置项目title
    let siteName = (wsCache.localStorage.get('siteInfo') && wsCache.localStorage.get('siteInfo').siteName) ? wsCache.localStorage.get('siteInfo').siteName : '';
    util.setProjectTitle(siteName);
}
