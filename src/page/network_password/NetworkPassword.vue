<!-- 网络设置密码 -->
<template>
    <div id="network-psd-container">
        <div class="content-title">网络设置密码</div>
        <div class="seperator-line"></div>
        <div id="psd-container">
            <!-- 当前密码-->
            <div class="current-psd">
                <label>当前密码</label>
                <span>{{currentPassword}}</span>
            </div>
            <!--修改密码-->
            <div class="modify-psd-block" v-show="currentState === 1">
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
                                  placeholder="请填写新密码，8位数字"
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
            </div>
        </div>
        <div id="psd-list-block" v-if="passwordList.length !== 0">
            <div class="psd-title">历史密码</div>
            <div class="psd-table">
                <div class="psd-header">
                    <label>日期</label>
                    <span>密码</span>
                </div>
                <div class="psd-row-block" v-for="item in passwordList" :key="item.id">
                    <label>{{item.createdAt | formatDate('yyyy-MM-DD')}}</label>
                    <span>{{item.password}}</span>
                </div>
            </div>
        </div>
        <div class="operate-item">
            <el-button class="btn-style-two" type="primary" @click="currentState = 1" v-if="currentState === 0">
                编辑
            </el-button>
            <el-button class="btn-style-two" type="primary" @click="submitForm" v-else>
                保存
            </el-button>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'NetworkPassword',
        data() {
            let checkOldMoon = (rule, value, callback) => {
                if (this.$util.isEmpty(value)) {
                    return callback(new Error('原密码不能为空'));
                } else if (!/^\d{8}$/.test(value)) {
                    return callback(new Error('请输入8位原密码'));
                } else {
                    callback();
                }
            };
            let validateNewMoon = (rule, value, callback) => {
                if (this.$util.isEmpty(value)) {
                    callback(new Error('请输入新密码'));
                } else if (!/^\d{8}$/.test(value)) {
                    return callback(new Error('请输入8位新密码'));
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
                // 0代表详情状态，1代表编辑状态
                currentState: 0,
                passwordList: [],
                currentPassword: '',
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
        mounted() {
            this.getNetPsdList();
        },
        methods: {
            getNetPsdList() {
                this.$service.getNetPsdList().then(response => {
                    if (response && response.code === 0) {
                        this.currentPassword = response.data.currentPassword;
                        this.passwordList = response.data.netPasswordLogList || [];
                    }
                });
            },
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
                this.$service.updateNetPsd({
                    originPassword: this.infoForm.moon,
                    newPassword: this.infoForm.newMoon
                }).then(response => {
                    if (response && response.code === 0) {
                        this.$message.success('网络密码设置成功');
                        this.currentState = 0;
                        this.infoForm.moon = '';
                        this.infoForm.newMoon = '';
                        this.infoForm.checkMoon = '';
                        this.$refs['infoForm'].resetFields();
                        this.getNetPsdList();
                    }
                });
            }
        }
    };
</script>

<style lang="scss">

    #psd-container {
        height: 186px;
        .el-form {
            margin-right: 260px;

            .el-form-item__label {
                font-size: 14px;
            }

            .el-input__inner {
                width: 300px;
                height: 32px;
                line-height: 32px;
            }
        }
    }

</style>

<style scoped lang="scss">

    #network-psd-container {

    }

    #psd-container {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    #psd-list-block {
        .psd-title {
            margin-bottom: 12px;
            text-align: left;
            font-size: 16px;
            font-weight: 400;
            color: rgba(168, 171, 179, 1);
        }

        .psd-table {
            width: 460px;

            > div {
                display: flex;
                align-items: center;
                height: 40px;
                border-bottom: 1px solid #3E495E;

                &.psd-header {
                    border-top: 1px solid #3E495E;
                    background: rgba(37, 45, 63, 0.5);
                }

                label {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 230px;
                }

                span {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 230px;
                }
            }
        }
    }

    .current-psd {
        display: flex;
        align-items: center;
        flex-direction: column;
        width: 266px;
        height: 98px;
        background: rgba(37, 45, 63, 1);
        border-radius: 4px;

        label {
            margin: 14px 0;
            font-size: 18px;
            font-weight: 400;
            color: rgba(255, 255, 255, 1);
        }

        span {
            font-size: 24px;
            font-weight: 400;
            color: rgba(154, 196, 239, 1);
        }
    }

    .operate-item {
        position: fixed;
        bottom: 45px;
        width: 100%;
        left: 0px;
        text-align: center;
    }

</style>
