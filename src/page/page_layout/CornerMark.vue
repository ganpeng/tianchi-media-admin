<template>
    <div class="mark-container">
        <div :style="rightTopStyle" class="right-top-field">
        </div>
        <div v-if="rightBottomText" class="right-bottom-field">
            {{rightBottomText}}
        </div>
        <div class="mask"></div>
        <div v-html="layoutItemType" class="layout-item-type-title"></div>
    </div>
</template>
<script>
import {mapGetters} from 'vuex';
import _ from 'lodash';
export default {
    name: 'CornerMark',
    props: {
        squareIndex: {
            type: Number,
            default: 0
        },
        cornerMark: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
            navbarId: '',
            index: 0
        };
    },
    computed: {
        ...mapGetters({
            //  2.3.0新增
            activeLayout: 'pageLayout/getActiveLayout'
        }),
        layoutItemType() {
            let layoutItemType = '';
            let params = '';
            let name = '';

            if (this.navbarId && _.isNumber(this.index) && _.isNumber(this.squareIndex)) {
                layoutItemType = _.get(this.activeLayout, `${this.index}.layoutItemMultiList.${this.squareIndex}.layoutItemType`);
                params = _.get(this.activeLayout, `${this.index}.layoutItemMultiList.${this.squareIndex}.params`);
                name = _.get(this.activeLayout, `${this.index}.layoutItemMultiList.${this.squareIndex}.name`);
            }

            if (layoutItemType === 'PROGRAMME_SUBJECT') {
                return `<span class"type">节目专题</span>: <span title="${name}" class="name">${name}</span>`;
            } else if (layoutItemType === 'FIGURE_SUBJECT') {
                return `<span class"type">人物专题</span>: <span title="${name}" class="name">${name}</span>`;
            } else if ((layoutItemType === 'PROGRAMME') || (layoutItemType === 'PROGRAMME_LIST' && _.isEmpty(params))) {
                return `<span class"type">节目</span>: <span title="${name}" class="name">${name}</span>`;
            } else if ((layoutItemType === 'PROGRAMME_LIST' && !_.isEmpty(params)) || layoutItemType === 'PROGRAMME_VIDEO') {
                let data = JSON.parse(params);
                let programmeName = _.get(data, 'programmeName') || '';
                let videoName = _.get(data, 'name') || '';
                let desc = `${name}--${programmeName}--${videoName}`;
                return `<span class="type">节目内视频</span>: <span title="${desc}" class="name">${desc}</span>`;
            } else if (layoutItemType === 'LINK') {
                let data = JSON.parse(params);
                let href = _.get(data, 'href') || '';
                let desc = name || href;
                return `<span class"type">网页</span>: <span title="${desc}" class="name">${desc}</span>`;
            } else if (layoutItemType === 'CHANNEL') {
                return `<span class"type">频道</span>: <span title="${name}" class="name">${name}</span>`;
            } else if (layoutItemType === 'FIGURE') {
                return '人物';
            } else if (layoutItemType === 'ALL') {
                return '更多';
            } else if (layoutItemType === 'SUBJECT_VIDEO') {
                let data = JSON.parse(params);
                let programmeName = _.get(data, 'programmeName') || '';
                let videoName = _.get(data, 'name') || '';
                let desc = `${name}--${programmeName}--${videoName}`;
                return `<span class"type">专题内视频</span>: <span title="${desc}" class="name">${desc}</span>`;
            } else if (layoutItemType) {
                let data = JSON.parse(params);
                let name = _.get(data, 'name');
                let typeName = _.get(data, 'typeName');
                let desc = `${name}--${typeName}`;
                return `<span class"type">筛选</span>: <span title="${desc}" class="name">${desc}</span>`;
            } else {
                return '';
            }
        },
        rightTopStyle() {
            let image = _.get(this.cornerMark, 'rightTop.image');
            if (_.isEmpty(image)) {
                return '';
            } else {
                return `width:${image.width * 0.6}px;height:${image.height * 0.6}px;background-image:url(${image.uri})`;
            }
        },
        getCornerMarkByKey() {
            return (key) => {
                return _.get(this.cornerMark, `${key}.caption`);
            };
        },
        rightBottomText() {
            let text = _.get(this.cornerMark, 'rightBottom.caption') || _.get(this.cornerMark, 'leftBottom.caption');
            return text;
        }
    },
    created() {
        let {navbarId, index} = this.$route.params;
        this.navbarId = navbarId;
        this.index = parseInt(index);
    },
    methods: {}
};
</script>
<style lang="scss" scoped>
@mixin common($color) {
    background-repeat: no-repeat;
    background-position: center center;
    background-size: 100% 100%;
}
.mark-container {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    .left-top-field {
        position: absolute;
        top: 10px;
        left: 10px;
        @include common(red);
    }
    .left-bottom-field {
        position: absolute;
        bottom: 10px;
        left: 10px;
        padding: 2px 10px;
        border-radius: 4px;
        color: #fff;
        font-size: 22px;
        background: rgba(0, 0, 0, 0.8);
    }
    .right-top-field {
        position: absolute;
        top: 10px;
        right: 10px;
        @include common(yellow);
    }
    .right-bottom-field {
        position: absolute;
        bottom: 10px;
        right: 10px;
        padding: 2px 10px;
        border-radius: 4px;
        color: yellow;
        font-size: 22px;
        background: rgba(0, 0, 0, 0.8);
    }
    .mask {
        display: none;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0, 0.9);
        border-radius: 8px;
        border: 1px solid $mainColor;
    }
    .layout-item-type-title {
        position: absolute;
        width: 100%;
        height: 30px;
        line-height: 30px;
        // text-align: center;
        text-align: left;
        font-size: 12px;
        color: #A8ABB3;
        bottom: -30px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
}
</style>
