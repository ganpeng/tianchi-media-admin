<template>
    <div class="category-fixed-module">
        <div class="btn-field text-right">
            <el-button class="btn-style-two">编辑</el-button>
        </div>
        <div class="content-field">
            <div class="wrapper">
                <div class="left-field"></div>
            </div>
            <div class="wrapper middle-wrapper">
                <div class="middle-field"></div>
            </div>
            <div class="wrapper">
                <div class="right-field"></div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'CategoryFixedModule',
    data() {
        return {};
    }
};
</script>
<style lang="scss" scoped>
@mixin paddingBg($paddingNum) {
    height: 0;
    padding-bottom: $paddingNum;
    background: #2A3040;
    border-radius: 8px;
}
.category-fixed-module {
    .btn-field {
        margin: 40px 0 10px 0;
    }
    .content-field {
        display: flex;
        .wrapper {
            &:first-child,
            &:last-child {
                width: 26.7552%
            }
            &.middle-wrapper {
                flex: 1;
                margin: 0 2%;
            }
            .left-field {
                @include paddingBg(100%);
            }
            .middle-field {
                @include paddingBg(63%);
            }
            .right-field {
                @include paddingBg(100%);
            }
        }
    }
}
</style>
