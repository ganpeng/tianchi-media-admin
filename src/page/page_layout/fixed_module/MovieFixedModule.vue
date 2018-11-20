<template>
    <div class="movie-fixed-module-container">
        <div class="btn-field text-right">
            <el-button class="btn-style-two">编辑</el-button>
        </div>
        <div class="content-field">
            <div class="top-field">
                <div class="wrapper">
                    <div class="top-left-field"></div>
                </div>
                <div class="wrapper">
                    <div class="top-middle-field">
                        <div class="top-middle-field-item"></div>
                        <div class="top-middle-field-item"></div>
                        <div class="top-middle-field-item"></div>
                        <div class="top-middle-field-item"></div>
                    </div>
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
                    <div class="bottom-right-field"></div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'MovieFixedModule',
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
.movie-fixed-module-container {
    .btn-field {
        margin: 40px 0 10px 0;
    }
    .content-field {
        .top-field {
            display: flex;
            margin-bottom: 2%;
            .wrapper {
                &:first-child {
                    width: 56.1904%;
                }
                &:nth-child(2) {
                    width: 22.8571%;
                    margin: 0 0.47619%;
                }
                &:last-child {
                    width: 20%;
                }
                .top-left-field {
                    @include paddingBg(54.2372%);
                }
                .top-middle-field {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    width: 100%;
                    height: 100%;
                    .top-middle-field-item {
                        @include paddingBg(32%);
                    }
                }
                .top-right-field {
                    @include paddingBg(152.3809%);
                }
            }
        }
        .bottom-field {
            display: flex;
            .wrapper {
                flex: 1;
                &:first-child {
                    margin-right: 2%;
                }
                .bottom-left-field,
                .bottom-right-field {
                    @include paddingBg(30.6201%);
                }
            }
        }
    }
}
</style>
