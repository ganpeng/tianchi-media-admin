<!--个人中心更改密码组件-->
<template>
    <div class="modify-password-container">
        <h2 class="content-title">修改密码</h2>
        <div class="seperator-line"></div>
        <div class="form-container">
            <el-row>
                <el-col :span="8">
                    <el-form
                        :model="passwordForm"
                        status-icon
                        :rules="passwordRules"
                        ref="passwordForm"
                        label-width="110px">
                        <el-form-item label="原密码" prop="password" required>
                            <el-input
                                v-model="passwordForm.password"
                                placeholder="请输入原密码"
                                clearable>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="新密码" prop="newPassword" required>
                            <el-input type="password"
                                    v-model="passwordForm.newPassword"
                                    auto-complete="off"
                                    placeholder="请输入6-20位新密码，必须包含数字、字母和特殊字符"
                                    clearable>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="确认新密码" prop="checkPassword" required>
                            <el-input type="password"
                                    v-model="passwordForm.checkPassword"
                                    auto-complete="off"
                                    placeholder="请重新输入新密码"
                                    clearable>
                            </el-input>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
        </div>
        <div class="fixed-btn-container">
            <el-button class="btn-style-two" type="primary" @click="submitForm">保存</el-button>
        </div>
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
                } else if (this.$util.trim(value) !== this.$util.trim(this.passwordForm.newPassword)) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            return {
                passwordForm: {
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
                this.$refs['passwordForm'].validate((valid) => {
                    if (valid) {
                        this.updatePassword();
                    } else {
                        return false;
                    }
                });
            },
            updatePassword() {
                this.$service.updateAdminSelfPassword({
                    password: this.passwordForm.password,
                    newPassword: this.passwordForm.newPassword
                }).then(response => {
                    if (response && response.code === 0) {
                        this.$message({
                            message: '您的密码更新成功',
                            type: 'success'
                        });
                    }
                });
            },
            resetForm() {
                this.$refs['passwordForm'].resetFields();
            }
        }
    };
</script>
<style lang="scss" scoped>
</style>
