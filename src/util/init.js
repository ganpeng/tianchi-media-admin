import store from 'store';
import 'babel-polyfill';
import _ from 'lodash';
import service from '../service/index';
import vuexStore from '../store/index';

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
    PROGRAMME_CATEGORY, // 节目类别
    PROGRAMME_TYPE, // 节目分类
    PROGRAMME_SUBJECT, // 节目专题
    FIGURE_SUBJECT, // 人物专题
    CHANNEL, // 频道
    SHUFFLE, // 混排
    FIGURE, // 人物模块
    SPECIAL, // 特别模块
 */
let defaultLayoutItem = {
    desc: '',
    id: '',
    layoutItemType: '',
    name: '',
    params: '',
    coverImage: {},
    coverImageBackground: {},
    cornerMark: {
        leftTop: {},
        leftBottom: {},
        rightTop: {},
        rightBottom: {}
    }
};

let defaultLayoutData = {
    iconImage: {},
    layoutItemMultiList: [],
    layoutTemplate: '',
    navBarId: '',
    navBarName: '',
    renderType: 'SHUFFLE',
    subjectId: '',
    title: ''
};

function getPagelayoutList(navbarList) {
    return Promise.all(navbarList.map((navbar) => {
        return service.getPageLayoutByNavbarId(navbar.id);
    }));
}

function initLayoutItemByLayoutItemType({layoutTemplate, navBarId, navBarName}) {
    switch (layoutTemplate) {
        case 'FS_0':
            return [Object.assign({}, _.cloneDeep(defaultLayoutData), {
                layoutItemMultiList: _.times(6, () => _.cloneDeep(defaultLayoutItem)),
                layoutTemplate,
                navBarId,
                navBarName
            })];
        case 'FS_1':
            return [Object.assign({}, _.cloneDeep(defaultLayoutData), {
                layoutItemMultiList: _.times(6, () => _.cloneDeep(defaultLayoutItem)),
                layoutTemplate,
                navBarId,
                navBarName
            })];
        case 'FS_2':
            return [Object.assign({}, _.cloneDeep(defaultLayoutData), {
                layoutItemMultiList: _.times(7, () => _.cloneDeep(defaultLayoutItem)),
                layoutTemplate,
                navBarId,
                navBarName
            })];
        case 'FS_3':
            return [Object.assign({}, _.cloneDeep(defaultLayoutData), {
                layoutItemMultiList: _.times(9, () => _.cloneDeep(defaultLayoutItem)),
                layoutTemplate,
                navBarId,
                navBarName
            })];
        case 'FS_4':
            return [Object.assign({}, _.cloneDeep(defaultLayoutData), {
                layoutItemMultiList: _.times(6, () => _.cloneDeep(defaultLayoutItem)),
                layoutTemplate,
                navBarId,
                navBarName
            })];
        case 'FS_5':
            return [Object.assign({}, _.cloneDeep(defaultLayoutData), {
                layoutItemMultiList: _.times(2, () => _.cloneDeep(defaultLayoutItem)),
                layoutTemplate,
                navBarId,
                navBarName
            })];
        case 'FS_6':
            return [Object.assign({}, _.cloneDeep(defaultLayoutData), {
                layoutItemMultiList: _.times(6, () => _.cloneDeep(defaultLayoutItem)),
                layoutTemplate,
                navBarId,
                navBarName
            })];
        case 'FS_7':
            return [Object.assign({}, _.cloneDeep(defaultLayoutData), {
                layoutItemMultiList: _.times(9, () => _.cloneDeep(defaultLayoutItem)),
                layoutTemplate,
                navBarId,
                navBarName
            })];
        case 'FS_8':
            return [Object.assign({}, _.cloneDeep(defaultLayoutData), {
                layoutItemMultiList: _.times(6, () => _.cloneDeep(defaultLayoutItem)),
                layoutTemplate,
                navBarId,
                navBarName
            })];
        default:
            throw new Error('类型不存在');
    }
}

export async function initNavbarLayout(navbarId) {
    //  初始化页面布局的本地存储数据结构
    try {
        let navbarListRes = await service.getNavbarList();
        if (navbarListRes && navbarListRes.code === 0) {
            let navbarList = navbarListRes.data;
            let navbar = navbarList.find((navbar) => navbar.id === navbarId);
            let index = navbarList.findIndex((navbar) => navbar.id === navbarId);
            if (index >= 0) {
                let data = initLayoutItemByLayoutItemType({
                    layoutTemplate: navbar.layoutTemplate,
                    navBarId: navbar.id,
                    navBarName: navbar.name
                });
                vuexStore.commit('pageLayout/setLayoutItemByNavbar', {navbar, index, data});
            }
        }
    } catch (err) {
        console.log(err);
    }
}

export default async function init() {
    //  初始化页面布局的本地存储数据结构
    try {
        if (!store.get('layoutStore')) {
            let navbarListRes = await service.getNavbarList();
            if (navbarListRes && navbarListRes.code === 0) {
                let navbarList = navbarListRes.data;
                let pagelayoutList = await getPagelayoutList(navbarList);
                if (_.isArray(pagelayoutList)) {
                    let layout = navbarList.reduce((res, curr, index) => {
                        res[curr.id] = {
                            id: curr.id,
                            index,
                            layoutTemplate: curr.layoutTemplate,
                            name: curr.name,
                            signCode: curr.signCode,
                            changed: false,
                            data: (pagelayoutList[index].data.length > 0
                                    ? pagelayoutList[index].data
                                    : initLayoutItemByLayoutItemType({
                                        layoutTemplate: curr.layoutTemplate,
                                        navBarId: curr.id,
                                        navBarName: curr.name
                                    }))
                        };
                        return res;
                    }, {});
                    store.set('layoutStore', layout);
                    vuexStore.commit('pageLayout/updateLayout');
                }
            }
        }
    } catch (err) {
        console.log(err);
    }
}
