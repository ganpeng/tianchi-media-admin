<template>
    <div class="mark-container">
        <!--
        <div class="left-top-field">
            <img :src="getCornerMarkByKey('leftTop') | setPlatformImage" alt="">
        </div>
        <div v-if="getCornerMarkByKey('leftBottom')" class="left-bottom-field">
            {{getCornerMarkByKey('leftBottom')}}
        </div>
        -->
        <div :style="rightTopStyle" class="right-top-field">
        </div>
        <div v-if="rightBottomText" class="right-bottom-field">
            {{rightBottomText}}
        </div>
        <div class="mask"></div>
        <div class="layout-item-type-title">
            {{layoutItemType}}
        </div>
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
            getLayoutItemType: 'pageLayout/getLayoutItemType',
            getLayoutItemByNavbarId: 'pageLayout/getLayoutItemByNavbarId'
        }),
        layoutItemType() {
            let layoutItemType = '';
            let params = '';

            if (this.navbarId && _.isNumber(this.index) && _.isNumber(this.squareIndex)) {
                let layoutItem = this.getLayoutItemByNavbarId(this.navbarId, this.index, this.squareIndex);
                layoutItemType = this.getLayoutItemType(this.navbarId, this.index, this.squareIndex);
                params = _.get(layoutItem, 'params');
            }

            if (layoutItemType === 'PROGRAMME_SUBJECT') {
                return '节目专题';
            } else if (layoutItemType === 'FIGURE_SUBJECT') {
                return '人物专题';
            } else if ((layoutItemType === 'PROGRAMME') || (layoutItemType === 'PROGRAMME_LIST' && _.isEmpty(params))) {
                return '节目';
            } else if ((layoutItemType === 'PROGRAMME_LIST' && !_.isEmpty(params)) || layoutItemType === 'PROGRAMME_VIDEO') {
                return '节目内视频';
            } else if (layoutItemType === 'LINK') {
                return '网页';
            } else if (layoutItemType === 'CHANNEL') {
                return '频道';
            } else if (layoutItemType === 'FIGURE') {
                return '人物';
            } else if (layoutItemType === 'ALL') {
                return '更多';
            } else if (layoutItemType === 'SUBJECT_VIDEO') {
                return '专题内视频';
            } else if (layoutItemType) {
                return '筛选';
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
            let text = (_.get(this.cornerMark, 'leftBottom.caption') || _.get(this.cornerMark, 'rightBottom.caption'));
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
        text-align: center;
        font-size: 12px;
        color: #A8ABB3;
        bottom: -30px;
    }
}
</style>
