<!--内容管理-栏目管理-设置混排内的节目第四步--设置节目展现形式-->
<template>
    <div>
        <h3 class="text-left">请选择节目的展示方式：</h3>
        <el-radio-group
            v-model="displayMode"
            class="text-left"
            @change="selectDisplayMode">
            <el-radio label="PROGRAMME_DETAIL">点击进入节目详情页面</el-radio>
            <el-radio label="PROGRAMME_LIST">点击进入节目播放列表页面</el-radio>
        </el-radio-group>
    </div>
</template>

<script>

    export default {
        name: 'SetProgrammeDisplayMode',
        props: ['originState'],
        data() {
            return {
                displayMode: ''
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
            },
            selectDisplayMode() {
                this.$emit('setDisplayMode', this.displayMode);
            }
        }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>

    h3 {
        margin-top: 30px;
        margin-bottom: 30px;
        font-size: 18px;
    }

</style>
