<!--内容管理-栏目管理-广告选择第三步组件-->
<template>
    <div>
        <el-form label-width="80px">
            <el-form-item label="广告名称">
                <el-input v-model="name" placeholder="请填写广告名称"></el-input>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        name: 'AdThirdStep',
        data() {
            return {
                name: ''
            };
        },
        mounted() {
        },
        methods: {}
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
    .el-form {
        margin-top: 50px;
        .el-form-item {
            width: 600px;
        }
    }
</style>
