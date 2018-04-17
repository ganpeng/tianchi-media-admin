<!--个人中心更改密码组件-->
<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>个人中心</el-breadcrumb-item>
            <el-breadcrumb-item>修改密码</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form :model="passwordForm" status-icon :rules="passwordRules" ref="passwordForm" label-width="100px"
                 class="demo-ruleForm">
            <el-form-item label="原密码" prop="originPassword">
                <el-input v-model="passwordForm.originPassword" placeholder="请输入原密码"></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="newPassword">
                <el-input type="password" v-model="passwordForm.newPassword" auto-complete="off"
                          placeholder="请输入6-8位新密码"></el-input>
            </el-form-item>
            <el-form-item label="确认新密码" prop="checkPassword">
                <el-input type="password" v-model="passwordForm.checkPassword" auto-complete="off"
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
            let checkOriginPassword = (rule, value, callback) => {
                if (this.$util.isEmpty(value)) {
                    return callback(new Error('原密码不能为空'))
                } else if (!this.$util.isPassword(value)) {
                    return callback(new Error('请输入6-8位原密码'))
                } else {
                    callback()
                }
            }
            let validateNewPassword = (rule, value, callback) => {
                if (this.$util.isEmpty(value)) {
                    callback(new Error('请输入新密码'))
                } else if (!this.$util.isPassword(value)) {
                    return callback(new Error('请输入6-8位新密码'))
                } else {
                    callback()
                }
            }
            let validatePassword2 = (rule, value, callback) => {
                if (this.$util.isEmpty(value)) {
                    callback(new Error('请再次输入密码'))
                } else if (this.$util.trim(value) !== this.$util.trim(this.passwordForm.password)) {
                    callback(new Error('两次输入密码不一致!'))
                } else {
                    callback()
                }
            }
            return {
                passwordForm: {
                    originPassword: '',
                    newPassword: '',
                    checkPassword: ''
                },
                passwordRules: {
                    originPassword: [
                        {validator: checkOriginPassword, trigger: 'blur'}
                    ],
                    newPassword: [
                        {validator: validateNewPassword, trigger: 'blur'}
                    ],
                    checkPassword: [
                        {validator: validatePassword2, trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            submitForm() {
                this.$refs['passwordForm'].validate((valid) => {
                    if (valid) {
                        this.updatePassword()
                    } else {
                        return false
                    }
                })
            },
            resetForm() {
                this.$refs['passwordForm'].resetFields()
            },
            updatePassword() {
                // 请求接口
                this.$axios.put('/v1/admin', {
                    id: this.editInfo.id,
                    email: this.editInfo.email,
                    telephone: this.editInfo.telephone,
                    mobile: this.editInfo.mobile,
                    name: this.editInfo.name
                }).then(response => {
                    if (response) {
                        this.$message(response.data.name + '的账号更新成功')
                    }
                })
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
    .el-form {
        margin-top: 40px;
        width: 650px;
    }
</style>
