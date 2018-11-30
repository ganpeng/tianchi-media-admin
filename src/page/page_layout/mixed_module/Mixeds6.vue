<template>
    <div class="mixeds6-container">
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
                <div class="field"></div>
            </div>
            <div class="wrapper">
                <div class="field"></div>
            </div>
            <div class="wrapper">
                <div class="field"></div>
            </div>
            <div class="wrapper">
                <div class="field"></div>
            </div>
            <div class="wrapper">
                <div class="field"></div>
            </div>
            <div class="wrapper">
                <div class="field"></div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'Mixeds6',
    props: {
        isEdit: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {};
    },
    computed: {},
    methods: {
        editHandler() {},
        deleteHandler() {}
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
.mixeds6-container {
    .header {
        margin: 40px 0 10px 0;
    }
    .content-field {
        display: flex;
        .wrapper {
            flex: 1;
            .field {
                @include paddingBg(100%);
            }
        }
        .wrapper + .wrapper {
            margin-left: 2%;
        }
    }
}
</style>
