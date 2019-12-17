<template>
    <div class="add-btn-container">
        <el-dropdown
            @command="addLayoutItem($event)" placement="bottom">
            <el-button class="my-add-cycle">
                <svg-icon icon-class="add"></svg-icon>
            </el-button>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="PROGRAMME">节目</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
    </div>
</template>
<script>
export default {
    name: 'AddBtn',
    props: {
        addLayoutItem: {
            type: Function,
            default: () => {}
        }
    }
};
</script>
<style lang="scss" scoped>
.add-btn-container {
    position: absolute;
    right: 20px;
    top: 10px;
}
</style>
