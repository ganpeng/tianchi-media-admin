<template>
    <div class="teleplay-fixed-module-container">
        <div class="btn-field text-right">
            <el-button class="btn-style-two">编辑</el-button>
        </div>
        <div class="content-field">
            <div class="top-field">
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
            <div class="bottom-field">
                <div class="wrapper">
                    <div class="bottom-left-field"></div>
                </div>
                <div class="wrapper">
                    <div class="bottom-middle-field"></div>
                </div>
                <div class="wrapper">
                    <div class="bottom-right-field"></div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'TeleplayFixedModule',
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
.teleplay-fixed-module-container {
    .btn-field {
        margin: 40px 0 10px 0;
    }
    .content-field {
        .top-field {
            display: flex;
            margin-bottom: 2%;
            .wrapper {
                &:first-child,
                &:last-child {
                    width: 19.3333%
                }
                &.middle-wrapper {
                    flex: 1;
                    margin: 0 2%;
                }
                .left-field {
                    @include paddingBg(138.4236%);
                }
                .middle-field {
                    @include paddingBg(46.6662%);
                }
                .right-field {
                    @include paddingBg(138.4236%);
                }
            }
        }
        .bottom-field {
            display: flex;
            .wrapper {
                flex: 1;
                .bottom-left-field,
                .bottom-middle-field,
                .bottom-right-field {
                    @include paddingBg(53.4534%);
                }

            }
            .wrapper + .wrapper {
                margin-left: 2%;
            }
        }
    }
}
</style>
