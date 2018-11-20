<template>
    <div class="recommend-fixed-module-container">
        <div class="module-row-one">
            <div class="btn-field text-right">
                <el-button class="btn-style-two">编辑</el-button>
            </div>
            <div class="content-field">
                <div class="left-field-wrapper">
                    <div class="left-field"></div>
                </div>
                <div class="right-field-wrapper">
                    <div class="right-top-field"></div>
                    <div class="right-bottom-field"></div>
                </div>
            </div>
        </div>
        <div class="module-row-two">
            <div class="btn-field text-right">
                <el-button class="btn-style-two">编辑</el-button>
            </div>
            <div class="content-field">
                <div class="top-field">
                    <div class="wrapper">
                        <div class="top-left-field"></div>
                    </div>
                    <div class="wrapper">
                        <div class="top-right-field"></div>
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
    </div>
</template>
<script>
export default {
    name: 'RecommendFixedModule',
    data() {
        return {

        };
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
.recommend-fixed-module-container {
    .btn-field {
        margin: 40px 0 10px 0;
    }
    .module-row-one {
        .content-field {
            display: flex;
            .left-field-wrapper {
                // flex: 2.15;
                width: 66.0535%;
                margin-right: 2%;
                .left-field {
                    @include paddingBg(56%);
                }
            }
            .right-field-wrapper {
                display: flex;
                flex: 1;
                flex-direction: column;
                justify-content: space-between;
                .right-top-field {
                    @include paddingBg(69.5538%);
                }
                .right-bottom-field {
                    @include paddingBg(39.7368%);
                }
            }
        }
    }
    .module-row-two {
        .top-field {
            display: flex;
            margin-bottom: 2%;
            .wrapper {
                flex: 1;
                &:first-child {
                    margin-right: 2%;
                }
                .top-left-field,
                .top-right-field {
                    @include paddingBg(50.94%);
                }
            }
        }
        .bottom-field {
            display: flex;
            .wrapper {
                flex: 1;
                &:nth-child(2) {
                    margin: 0 2%;
                }
                .bottom-left-field,
                .bottom-middle-field,
                .bottom-right-field {
                    @include paddingBg(53.54%);
                }
            }
        }
    }
}
</style>
