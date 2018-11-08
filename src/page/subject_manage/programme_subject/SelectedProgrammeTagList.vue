<!--选择多个节目标签列表组件-->
<template>
    <div>
        <div>
            <span>已选{{selectedProgrammeList.length}}项</span>
            <label @click="packUp">收起</label>
            <label @click="packDown">展开</label>
        </div>
        <p v-if="tagVisible">
            <el-tag v-for="(item, index) in selectedProgrammeList" :key="index">
                {{item.name}}
                <span @click="cancelSelectedProgramme(item,index)">X</span>
            </el-tag>
        </p>
    </div>
</template>

<script>
    export default {
        name: 'SelectedProgrammeTagList',
        // 当前外部选中的节目列表
        props: ['selectedProgrammeList'],
        data() {
            return {
                tagVisible: false
            };
        },
        mounted() {
        },
        methods: {
            cancelSelectedProgramme(programme, index) {
                this.$emit('cancelSelectedProgramme', programme, index);
            },
            // 收起
            packUp() {
                this.tagVisible = false;
            },
            // 展开
            packDown() {
                this.tagVisible = true;
            }
        }
    };
</script>

<style lang="scss" scoped>
</style>
