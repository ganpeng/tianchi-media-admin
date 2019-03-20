<template>
    <div class="shuffle-btn-container">
        <el-dropdown
            @command="addShuffleLayout($event)" placement="bottom">
            <el-button class="my-add-cycle">
                <svg-icon icon-class="add"></svg-icon>
            </el-button>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="FILTER">筛选</el-dropdown-item>
                <el-dropdown-item command="LINK">网页</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
    </div>
</template>
<script>
export default {
    name: 'ShuffleBtn',
    props: {
        addShuffleLayout: {
            type: Function,
            default: () => {}
        }
    }
};
</script>
<style lang="scss" scoped>
.shuffle-btn-container {
    position: absolute;
    right: 20px;
    top: 10px;
}
</style>
