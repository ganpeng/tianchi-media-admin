<!--个人中心更改密码组件-->
<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>个人中心</el-breadcrumb-item>
            <el-breadcrumb-item>修改密码</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form :model="form" status-icon :rules="passwordRules" ref="form" label-width="100px"
                 class="demo-ruleForm">
            <el-form-item label="原密码" prop="password">
                <el-input v-model="form.password" placeholder="请输入原密码"></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="newPassword">
                <el-input type="password" v-model="form.newPassword" auto-complete="off"
                          placeholder="请输入6-8位新密码"></el-input>
            </el-form-item>
            <el-form-item label="确认新密码" prop="checkPassword">
                <el-input type="password" v-model="form.checkPassword" auto-complete="off"
                          placeholder="请重新输入新密码"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm">更 新</el-button>
                <el-button @click="resetForm">重 置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>

    export default {
        name: 'ModifyPassword',
        data() {
            let checkOldPassword = (rule, value, callback) => {
                if (this.$util.isEmpty(value)) {
                    return callback(new Error('原密码不能为空'));
                } else if (!this.$util.isPassword(value)) {
                    return callback(new Error('请输入6-8位原密码'));
                } else {
                    callback();
                }
            };
            let validateNewPassword = (rule, value, callback) => {
                if (this.$util.isEmpty(value)) {
                    callback(new Error('请输入新密码'));
                } else if (!this.$util.isPassword(value)) {
                    return callback(new Error('请输入6-8位新密码'));
                } else {
                    callback();
                }
            };
            let validatePassword2 = (rule, value, callback) => {
                if (this.$util.isEmpty(value)) {
                    callback(new Error('请再次输入密码'));
                } else if (this.$util.trim(value) !== this.$util.trim(this.form.newPassword)) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            return {
                form: {
                    password: '',
                    newPassword: '',
                    checkPassword: ''
                },
                passwordRules: {
                    password: [
                        {validator: checkOldPassword, trigger: 'blur'}
                    ],
                    newPassword: [
                        {validator: validateNewPassword, trigger: 'blur'}
                    ],
                    checkPassword: [
                        {validator: validatePassword2, trigger: 'blur'}
                    ]
                }
            };
        },
        methods: {
            submitForm() {
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        this.updatePassword();
                    } else {
                        return false;
                    }
                });
            },
            resetForm() {
                this.$refs['form'].resetFields();
            },
            updatePassword() {
                // 请求接口
                this.$service.updateAdminSelfPassword({
                    password: this.form.password,
                    newPassword: this.form.newPassword
                }).then(response => {
                    if (response) {
                        this.$message('您的密码更新成功');
                    }
                });
            }
        }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
    .el-form {
        margin-top: 40px;
        width: 650px;
    }
</style>
