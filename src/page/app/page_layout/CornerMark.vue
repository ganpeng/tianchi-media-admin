<template>
    <div class="mark-container">
        <div :style="rightTopStyle" class="right-top-field">
        </div>
        <div v-if="rightBottomText" :class="['right-bottom-field', isLeftBottom && 'is-leftbottom']">
            {{rightBottomText}}
        </div>
        <div class="mask"></div>
        <div class="layout-item-title">
            {{programmeInfo.name}}
        </div>
        <div class="layout-item-desc">
            {{programmeInfo.desc}}
        </div>
    </div>
</template>
<script>
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
        },
        layoutItem: {
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
        programmeInfo() {
            return _.pick(this.layoutItem, ['name', 'desc']);
        },
        rightTopStyle() {
            let image = _.get(this.cornerMark, 'rightTop.appImage');
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
        },
        isLeftBottom() {
            return _.get(this.cornerMark, 'leftBottom.caption');
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
        font-size: 20px;
        background: rgba(0, 0, 0, 0.8);
    }
    .right-top-field {
        position: absolute;
        top: 0px;
        right: 10px;
        z-index: 8px;
        @include common(yellow);
    }
    .right-bottom-field {
        position: absolute;
        bottom: 10px;
        right: 10px;
        padding: 2px 10px;
        border-radius: 4px;
        color: #FF3C2E;
        font-size: 20px;
        background: rgba(0, 0, 0, 0.8);
        z-index: 8;
        &.is-leftbottom {
            color: #fff;
        }
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
    .layout-item-title {
        position: absolute;
        bottom: -35px;
        width: 100%;
        height: 30px;
        line-height: 30px;
        text-align: left;
        font-size: 20px;
        font-weight: 400;
        color: rgba(168,171,179,1);
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }
    .layout-item-desc {
        position: absolute;
        width: 100%;
        line-height: 24px;
        text-align: left;
        bottom: -60px;
        font-size: 16px;
        font-weight: 400;
        color: rgba(111,116,128,1);
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }
}
</style>
