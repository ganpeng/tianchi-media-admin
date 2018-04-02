<!--个人中心更改密码组件-->
<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>个人中心</el-breadcrumb-item>
            <el-breadcrumb-item>修改密码</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form :model="passwordForm" status-icon :rules="rules2" ref="passwordForm" label-width="100px"
                 class="demo-ruleForm">
            <el-form-item label="原密码" prop="originPassword">
                <el-input v-model="passwordForm.originPassword" placeholder="请输入原密码"></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="newPassword">
                <el-input type="password" v-model="passwordForm.newPassword" auto-complete="off"
                          placeholder="请输入新密码"></el-input>
            </el-form-item>
            <el-form-item label="确认新密码" prop="checkPassword">
                <el-input type="password" v-model="passwordForm.checkPassword" auto-complete="off"
                          placeholder="请重新输入新密码"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('passwordForm')">提交</el-button>
                <el-button @click="resetForm('passwordForm')">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import util from '../../util/extend'

    export default {
        name: 'modifyPassword',
        data() {
            let checkOriginPassword = (rule, value, callback) => {
                if (!util.trim(value)) {
                    return callback(new Error('原密码不能为空'))
                } else if (!/^[a-zA-Z0-9]{6-8}$/.test(util.trim(value))) {
                    return callback(new Error('请输入6-8位原密码'))
                } else {
                    callback()
                }
            }
            let validateNewPassword = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入新密码'))
                } else if (!/^[a-zA-Z0-9]{6-8}$/.test(util.trim(value))) {
                    return callback(new Error('请输入6-8位新密码'))
                } else {
                    callback()
                }
            }
            let validatePassword2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'))
                } else if (value !== this.passwordForm.password) {
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
                rules2: {
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
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        alert('submit!')
                    } else {
                        console.error('error submit!!')
                        return false
                    }
                })
            },
            resetForm(formName) {
                this.$refs[formName].resetFields()
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
