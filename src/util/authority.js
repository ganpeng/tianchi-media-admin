import 'babel-polyfill';
import {MessageBox} from 'element-ui';
import vuexStore from '../store/index';

/**
 * 判断权限模块
 */
let authority = {
    isHasAuthority(authorityName) {
        if (vuexStore.getters['user/role'] === 'ADMIN') {
            return true;
        }
        // 处理没有角色的旧数据
        if (!vuexStore.getters['user/roleList'][0]) {
            MessageBox.alert('暂无访问权限，如需更多权限请联系超级管理员', '无权限提示', {
                confirmButtonText: '确定'
            });
            return false;
        }
        let list = vuexStore.getters['user/roleList'][0].resourceList;
        let tag = false;
        for (let i = 0; i < list.length; i++) {
            if (list[i].permission === authorityName) {
                tag = true;
            }
        }
        if (!tag) {
            MessageBox.alert('暂无访问权限，如需更多权限请联系超级管理员', '无权限提示', {
                confirmButtonText: '确定'
            });
        }
        return tag;
    }
};

export default authority;
