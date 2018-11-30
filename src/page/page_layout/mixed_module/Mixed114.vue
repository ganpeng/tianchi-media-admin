<template>
    <div class="mixed114-container">
        <div v-if="!isEdit" class="header layout-square-header">
            <div class="left">
                <img class="icon" />
                <span class="title"></span>
            </div>
            <div class="right">
                <el-dropdown
                    @command="addLayout($event)" placement="bottom">
                    <el-button class="btn-style-five">
                        <svg-icon icon-class="add"></svg-icon>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="PROGRAMME">节目专题</el-dropdown-item>
                        <el-dropdown-item command="FIGURE_SUBJECT">人物专题</el-dropdown-item>
                        <el-dropdown-item command="FIGURE">人物模块</el-dropdown-item>
                        <el-dropdown-item command="SPECIAL">特别模块</el-dropdown-item>
                        <el-dropdown-item command="SHUFFLE">混排模块</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <el-button @click="editHandler" class="btn-style-five">
                    <svg-icon icon-class="edit"></svg-icon>
                </el-button>
                <span @click="deleteHandler" class="delete-btn one">
                    <svg-icon icon-class="delete_btn"></svg-icon>
                </span>
            </div>
        </div>
        <div class="content-field">
            <div class="wrapper">
                <div class="left-field"></div>
            </div>
            <div class="wrapper">
                <div class="right-field">
                    <div class="right-top-field"></div>
                    <div class="right-bottom-field">
                        <div class="wrapper">
                            <div class="right-bottom-field-item"></div>
                        </div>
                        <div class="wrapper">
                            <div class="right-bottom-field-item"></div>
                        </div>
                        <div class="wrapper">
                            <div class="right-bottom-field-item"></div>
                        </div>
                        <div class="wrapper">
                            <div class="right-bottom-field-item"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'Mixed114',
    props: {
        isEdit: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {};
    }
};
</script>
<style lang="scss" scoped>
@mixin paddingBg($paddingNum) {
    position: relative;
    height: 0;
    padding-bottom: $paddingNum;
    background-color: #2A3040;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-position: center center;
    border-radius: 8px;
}
.mixed114-container {
    .header {
        margin: 40px 0 10px 0;
    }
    .content-field {
        display: flex;
        .wrapper {
            &:first-child {
                width: 31.8181%;
                .left-field {
                    @include paddingBg(130.3571%);
                }
            }
            &:last-child {
                flex: 1;
                margin-left: 2%;
                .right-field {
                    display: flex;
                    flex-direction: column;
                    .right-top-field {
                        @include paddingBg(25.2620%);
                    }
                    .right-bottom-field {
                        display: flex;
                        flex: 1;
                        margin-top: 2.6%;
                        .wrapper {
                            flex: 1;
                            .right-bottom-field-item {
                                @include paddingBg(150%);
                            }
                        }
                        .wrapper + .wrapper {
                            margin-left: 2.5%;
                        }
                    }
                }
            }
        }
    }
}
</style>
