<template>
    <div class="shuffle-btn-container">
        <el-dropdown
            @command="addShuffleLayout($event)" placement="bottom">
            <el-button class="my-add-cycle">
                <svg-icon icon-class="add"></svg-icon>
            </el-button>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-if="!showAll" command="PROGRAMME">节目</el-dropdown-item>
                <el-dropdown-item v-if="showAll" command="ALL">全部</el-dropdown-item>
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
        },
        showAll: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {};
    },
    methods: {
        addLayout() {}
    }
};
</script>
<style lang="scss" scoped>
.shuffle-btn-container {
    position: absolute;
    right: 10px;
    top: 2px;
}
</style>
