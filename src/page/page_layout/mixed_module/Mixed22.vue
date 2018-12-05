<template>
    <div class="mixed33-container">
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
                        <el-dropdown-item command="PROGRAMME_SUBJECT">节目专题</el-dropdown-item>
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
                <div class="field-1"></div>
            </div>
            <div class="wrapper">
                <div class="field-2"></div>
            </div>
            <div class="wrapper">
                <div class="field-3"></div>
            </div>
            <div class="wrapper">
                <div class="field-4"></div>
            </div>
            <div class="wrapper">
                <div class="field-5"></div>
            </div>
            <div class="wrapper">
                <div class="field-6"></div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'Mixed22',
    props: {
        isEdit: {
            type: Boolean,
            default: false
        }
    },
    methods: {}
};
</script>
<style lang="scss" scoped>

</style>
