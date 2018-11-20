<template>
    <div class="news-fixed-module">
        <div class="btn-field text-right">
            <el-button class="btn-style-two">编辑</el-button>
        </div>
        <div class="top-field">
            <div class="wrapper">
                <div class="top-left-field"></div>
            </div>
            <div class="wrapper">
                <div class="top-right-field">
                    <div class="top-right-top-field">
                        <div class="wrapper">
                            <div class="top-right-top-left-field"></div>
                        </div>
                        <div class="wrapper">
                            <div class="top-right-top-right-field"></div>
                        </div>
                    </div>
                    <div class="top-right-bottom-field">
                        <div class="wrapper">
                            <div class="top-right-bottom-left-field"></div>
                        </div>
                        <div class="wrapper">
                            <div class="top-right-bottom-right-field"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="bottom-field">
            <div class="wrapper">
                <div class="bottom-field-item"></div>
            </div>
            <div class="wrapper">
                <div class="bottom-field-item"></div>
            </div>
            <div class="wrapper">
                <div class="bottom-field-item"></div>
            </div>
            <div class="wrapper">
                <div class="bottom-field-item"></div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'NewsFixedModule',
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
.news-fixed-module {
    .btn-field {
        margin: 40px 0 10px 0;
    }
    .top-field {
        display: flex;
        margin-bottom: 2%;
        .wrapper {
            flex: 1;
            &:first-child {
                margin-right: 2%;
            }
            .top-left-field {
                @include paddingBg(50.998%);
            }
            .top-right-field {
                display: flex;
                flex-direction: column;
                .top-right-top-field {
                    margin-bottom: 4%;
                }
                .top-right-top-field,
                .top-right-bottom-field {
                    display: flex;
                    .wrapper {
                        flex: 1;
                        &:first-child {
                            margin-right: 4%;
                        }
                        .top-right-top-left-field,
                        .top-right-top-right-field,
                        .top-right-bottom-left-field,
                        .top-right-bottom-right-field {
                            @include paddingBg(48.6748%);
                        }
                    }
                }
            }
        }
    }
    .bottom-field {
        display: flex;
        .wrapper {
            flex: 1;
            .bottom-field-item {
                @include paddingBg(44.03292%);
            }
        }
        .wrapper + .wrapper {
            margin-left: 2%;
        }
    }
}
</style>
