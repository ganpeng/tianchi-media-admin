import store from 'store';
import _ from 'lodash';
import service from '../service/index';

/**
        LT_R_1, // 右上角推荐位
        LT_4, // 一行4个
        LT_S6, // 一行6个
        LT_KID_6, // 儿童人物模块模版
        LT_F_6, //  人物模块模版
        LT_FS_6, //  人物专题模版
        LT_SP_2, // 特别模块模版
        LT_2_3, // 2+3
        LT_2_6, // 2+6
        LT_3_2, //  3+2
        LT_3_3, //  3+3
        LT_6_6, //  6+6
        LT_1_1_4, //  2+3+4
        LT_SN, //  动态增加
        FS_0, // 推荐展示模块
        FS_1, // 电视剧类展示模块
        FS_2, //  电影类展示模块
        FS_3, //  新闻类展示模块
        FS_4, //  专题类展示模块
        FS_5, //  儿童展示模块
        FS_6, //  分类展示模块
 *
 */
/**
 *  renderType 的枚举
    PROGRAMME, // 节目
    CATALOGUE  // a
    PROGRAMME_CATEGORY, // 节目类别
    PROGRAMME_TYPE, // 节目分类
    PROGRAMME_SUBJECT, // 节目专题
    FIGURE_SUBJECT, // 人物专题
    CHANNEL, // 频道
    SHUFFLE, // 混排
    FIGURE, // 人物模块
    SPECIAL, // 特别模块
 */

export const defaultLayoutItem = {
    cornerMark: {},
    coverImage: {
        height: '',
        name: '',
        uri: '',
        width: ''
    },
    coverImageBackground: {
        height: '',
        name: '',
        uri: '',
        width: ''
    },
    desc: '',
    layoutItemType: '',
    id: '',
    name: '',
    params: ''
};

function initLayoutItemByLayoutItemType(layoutItemType) {
    return Object.assign({}, defaultLayoutItem, {layoutItemType: layoutItemType || 'PROGRAMME'});
}

function initFixedModuleData(layoutTemplate) {
    switch (layoutTemplate) {
        case 'FS_0':
            return _.times(6, () => _.cloneDeep(initLayoutItemByLayoutItemType('')));
        case 'FS_1':
            return _.times(6, () => _.cloneDeep(initLayoutItemByLayoutItemType('')));
        case 'FS_2':
            return _.times(7, () => _.cloneDeep(initLayoutItemByLayoutItemType('')));
        case 'FS_3':
            return _.times(9, () => _.cloneDeep(initLayoutItemByLayoutItemType('')));
        case 'FS_4':
            return _.times(6, () => _.cloneDeep(initLayoutItemByLayoutItemType('')));
        case 'FS_5':
            return _.times(2, () => _.cloneDeep(initLayoutItemByLayoutItemType('')));
        case 'FS_6':
            return _.times(6, () => _.cloneDeep(initLayoutItemByLayoutItemType('')));
        default:
            throw new Error(`类型${layoutTemplate}不存在`);
    }
}

function checkLayoutStoreById(navbar, index) {
    let {id, name, layoutTemplate, signCode} = navbar;
    let layoutStore = store.get('layoutStore');
    let target = _.get(layoutStore, id);
    if (!target) {
        let obj = { id, name, layoutTemplate, signCode, index, changed: false, data: [] };
        obj.data[0] = {
            layoutTemplate,
            navBarId: id,
            navBarName: name,
            renderType: 'SHUFFLE',
            subjectId: '',
            title: '',
            layoutItemMultiList: initFixedModuleData(layoutTemplate)
        };
        layoutStore[id] = obj;
        store.set('layoutStore', layoutStore);
    }
}

export default function init() {
    //  初始化页面布局的本地存储数据结构
    store.get('layoutStore') || store.set('layoutStore', {});
    service.getNavbarList()
        .then((res) => {
            if (res && res.code === 0) {
                res.data.forEach((navbar, index) => {
                    checkLayoutStoreById(navbar, index);
                });
            }
        });
}
