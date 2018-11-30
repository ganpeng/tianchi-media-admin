<template>
    <div class="mixed26-container">
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
                    <div class="bottom-1-field"></div>
                </div>
                <div class="wrapper">
                    <div class="bottom-2-field"></div>
                </div>
                <div class="wrapper">
                    <div class="bottom-3-field"></div>
                </div>
                <div class="wrapper">
                    <div class="bottom-4-field"></div>
                </div>
                <div class="wrapper">
                    <div class="bottom-5-field"></div>
                </div>
                <div class="wrapper">
                    <div class="bottom-6-field"></div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'Mixed26',
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
.mixed26-container {
    .header {
        margin: 40px 0 10px 0;
    }
    .content-field {
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
                    @include paddingBg(51.1627%);
                }
            }
        }
        .bottom-field {
            display: flex;
            .wrapper {
                flex: 1;
            }
            .wrapper + .wrapper {
                margin-left: 2%;
            }
            .bottom-1-field,
            .bottom-2-field,
            .bottom-3-field,
            .bottom-4-field,
            .bottom-5-field,
            .bottom-6-field {
                @include paddingBg(150%);
            }
        }
    }
}
</style>
