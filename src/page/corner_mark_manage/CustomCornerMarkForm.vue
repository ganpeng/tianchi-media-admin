<!--运营角标表单组件-->
<template>
    <el-form
        :model="cornerMarkInfo"
        :rules="infoRules"
        status-icon
        ref="subjectInfo"
        label-width="120px"
        class="form-block fill-form">
        <el-form-item label="角标类型">
            <label class="type">运营角标</label>
        </el-form-item>
        <el-form-item label="角标名称" prop="name" required>
            <el-input v-model="cornerMarkInfo.name" placeholder="请填写角标名称"></el-input>
        </el-form-item>
        <el-form-item label="角标图片" required>
            <label> (大角标125*99，小角标76*46)</label>
        </el-form-item>
    </el-form>
</template>

<script>

    export default {
        name: 'CustomCornerMarkForm',
        data() {
            let checkName = (rule, value, callback) => {
                if (this.$util.isEmpty(value)) {
                    return callback(new Error('角标名称不能为空'));
                } else if (this.$util.trim(value).length > 30) {
                    return callback(new Error('角标名称不能超过30字'));
                } else {
                    callback();
                }
            };
            return {
                cornerMarkInfo: {
                    name: ''
                },
                infoRules: {
                    name: [
                        {validator: checkName, trigger: 'blur'}
                    ]
                }
            };
        },
        methods: {}
    };
</script>

<style lang="scss" scoped>

    .el-form {
        min-height: 350px;
        .type {
            font-size: 16px;
            color: #6F7480;
        }
    }

</style>
