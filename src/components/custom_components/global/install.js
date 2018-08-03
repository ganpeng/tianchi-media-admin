// 项目组件全局注册
import Vue from 'vue';
import CustomBreadcrumb from './widget/CustomBreadcrumb';

const WIDGET_LIST = [
    {name: 'custom-breadcrumb', instance: CustomBreadcrumb}
];

for (let i = 0; i < WIDGET_LIST.length; i++) {
    Vue.component(WIDGET_LIST[i].name, WIDGET_LIST[i].instance);
}
