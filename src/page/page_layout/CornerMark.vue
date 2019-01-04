<template>
    <div class="mark-container">
        <div class="left-top-field">
            <img :src="getCornerMarkByKey('leftTop') | setPlatformImage" alt="">
        </div>
        <div v-if="getCornerMarkByKey('leftBottom')" class="left-bottom-field">
            {{getCornerMarkByKey('leftBottom')}}
        </div>
        <div :style="rightTopStyle" class="right-top-field">
        </div>
        <div v-if="getCornerMarkByKey('rightBottom')" class="right-bottom-field">
            {{getCornerMarkByKey('rightBottom')}}
        </div>
    </div>
</template>
<script>
import _ from 'lodash';
export default {
    name: 'CornerMark',
    props: {
        cornerMark: {
            type: Object,
            default: () => {}
        }
    },
    computed: {
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
        title() {
            let programmeTemplate = _.get(this.cornerMark, `programmeTemplate`);
            switch (programmeTemplate) {
                case 'TV_DRAMA':
                    return '集';
                case 'TV_SHOW':
                    return '期';
                default:
                    return '';
            }
        }
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
}
</style>
