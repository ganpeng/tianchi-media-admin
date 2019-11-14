<!--个人中心更改密码组件-->
<template>
    <div class="modify-moon-container">
        <h2 class="content-title">修改密码</h2>
        <div class="seperator-line"></div>
        <el-form
            :model="infoForm"
            status-icon
            :rules="moonRules"
            ref="infoForm"
            label-width="110px">
            <el-form-item label="原密码" prop="moon" required>
                <el-input
                    v-model="infoForm.moon"
                    placeholder="请输入原密码"
                    clearable>
                </el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="newMoon" required>
                <el-input type="moon"
                          v-model="infoForm.newMoon"
                          auto-complete="off"
                          placeholder="请输入6-20位新密码，必须包含数字、字母和特殊字符"
                          clearable>
                </el-input>
            </el-form-item>
            <el-form-item label="确认新密码" prop="checkMoon" required>
                <el-input type="moon"
                          v-model="infoForm.checkMoon"
                          auto-complete="off"
                          placeholder="请重新输入新密码"
                          clearable>
                </el-input>
            </el-form-item>
        </el-form>
        <div class="operate-item">
            <el-button class="btn-style-two" type="primary" @click="submitForm">保存</el-button>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'ModifyMoon',
        props: {
            force: {
                type: Boolean,
                default: false
            }
        },
        data() {
            let checkOldMoon = (rule, value, callback) => {
                if (this.$util.isEmpty(value)) {
                    return callback(new Error('原密码不能为空'));
                } else if (!this.$util.isPassword(value)) {
                    return callback(new Error('请输入6-8位原密码'));
                } else {
                    callback();
                }
            };
            let validateNewMoon = (rule, value, callback) => {
                if (this.$util.isEmpty(value)) {
                    callback(new Error('请输入新密码'));
                } else if (!this.$util.isPassword(value)) {
                    return callback(new Error('请输入6-8位新密码'));
                } else {
                    callback();
                }
            };
            let validateMoon2 = (rule, value, callback) => {
                if (this.$util.isEmpty(value)) {
                    callback(new Error('请再次输入密码'));
                } else if (this.$util.trim(value) !== this.$util.trim(this.infoForm.newMoon)) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            return {
                input: '',
                infoForm: {
                    moon: '',
                    newMoon: '',
                    checkMoon: ''
                },
                moonRules: {
                    moon: [
                        {validator: checkOldMoon, trigger: 'blur'},
                        {validator: checkOldMoon, trigger: 'change'}
                    ],
                    newMoon: [
                        {validator: validateNewMoon, trigger: 'blur'},
                        {validator: validateNewMoon, trigger: 'change'}
                    ],
                    checkMoon: [
                        {validator: validateMoon2, trigger: 'blur'},
                        {validator: validateMoon2, trigger: 'change'}
                    ]
                }
            };
        },
        methods: {
            submitForm() {
                this.$refs['infoForm'].validate((valid) => {
                    if (valid) {
                        this.updateMoon();
                    } else {
                        return false;
                    }
                });
            },
            updateMoon() {
                this.$service.updateAdminSelfPassword({
                    password: this.infoForm.moon,
                    newPassword: this.infoForm.newMoon
                }).then(response => {
                    if (response && response.code === 0) {
                        this.$message({
                            message: '您的密码更新成功',
                            type: 'success'
                        });
                        if (this.force) {
                            this.$store.dispatch('user/setReset', '');
                            this.$router.push({name: 'Home'});
                        }
                    } else if (response && response.code === 505) {
                        this.$message.warning(response.message);
                    }
                });
            },
            resetForm() {
                this.$refs['infoForm'].resetFields();
            }
        }
    };
</script>

<style lang="scss" scoped>

    .el-form {
        width: 700px;
    }

    .operate-item {
        position: fixed;
        bottom: 45px;
        width: 100%;
        left: 0px;
        text-align: center;
    }

</style>
