<template>
    <div class="shuffle-btn-container">
        <el-dropdown
            @command="addShuffleLayout($event)" placement="bottom">
            <el-button class="my-add-cycle">
                <svg-icon icon-class="add"></svg-icon>
            </el-button>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="PROGRAMME">节目</el-dropdown-item>
                <el-dropdown-item command="PROGRAMME_VIDEO">节目内视频</el-dropdown-item>
                <el-dropdown-item command="PROGRAMME_SUBJECT">节目专题</el-dropdown-item>
                <el-dropdown-item command="LINK">网页</el-dropdown-item>
                <el-dropdown-item command="CHANNEL">频道</el-dropdown-item>
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
