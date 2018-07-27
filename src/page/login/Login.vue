<template>
    <el-container id="container">
        <el-main>
            <div class="form-box" @keyup.enter="submitForm">
                <h3>用户登录</h3>
                <el-form :model="formData" status-icon :rules="rules" ref="login">
                    <el-form-item prop="name" class="name">
                        <md-input icon="tickets"
                                  v-model="formData.name">用户名
                        </md-input>
                    </el-form-item>
                    <el-form-item prop="password" class="password">
                        <md-input icon="goods"
                                  type="password"
                                  v-model="formData.password">密码
                        </md-input>
                    </el-form-item>
                    <el-form-item class="password-relate">
                        <el-checkbox label="记住密码" name="type" v-model="memory"></el-checkbox>
                        <label @click="retrievePass">忘记密码</label>
                    </el-form-item>
                    <el-form-item class="login-box">
                        <el-button type="primary" @click="submitForm">登录</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <img src="~assets/img/login_logo.png" class="login-logo">
        </el-main>
        <v-footer></v-footer>
    </el-container>
</template>

<script>

    import MdInput from 'sysComponents/custom_components/widget/MdInput';
    import VFooter from '../layout/VFooter';

    export default {
        name: 'Login',
        components: {
            MdInput,
            VFooter
        },
        data() {
            let validateAccount = (rule, value, callback) => {
                if (this.$util.isEmpty(value)) {
                    return callback(new Error('用户名不能为空'));
                } else if (!this.$util.isMobile(value) && !this.$util.isEmail(value)) {
                    return callback(new Error('请填写正确账号'));
                } else {
                    callback();
                }
            };
            let validatePassword = (rule, value, callback) => {
                if (this.$util.isEmpty(value)) {
                    callback(new Error('请输入密码'));
                } else if (!this.$util.isPassword(value)) {
                    callback(new Error('请输入6-8位密码!'));
                } else {
                    callback();
                }
            };
            return {
                formData: {
                    name: '',
                    password: ''
                },
                memory: false,
                rules: {
                    name: [
                        {validator: validateAccount, trigger: 'blur'}
                    ],
                    password: [
                        {validator: validatePassword, trigger: 'blur'}
                    ]
                }
            };
        },
        methods: {
            // 登录
            submitForm() {
                this.$refs.login.validate((valid) => {
                    if (valid) {
                        this.$store.dispatch('user/login', this.formData).then(response => {
                            if (response) {
                                this.$router.push({name: 'Home'});
                            }
                        });
                    } else {
                        return false;
                    }
                });
            },
            retrievePass() {
                this.$message({
                    message: '请联系超级管理员咨询账号问题',
                    type: 'success'
                });
            }
        }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    .el-container {
        display: flex;
        flex-direction: column;
        height: 100%;
    }

    h3 {
        margin: 20px 0px;
        color: $loginFontColor;
        text-align: center;
    }

    .el-main {
        position: relative;
        min-width: 800px;
        background: url("../../assets/img/login_bg.png") no-repeat $generalBgColor;
        background-size: cover;
        .login-logo {
            position: absolute;
            left: 60px;
            bottom: 100px;
            height: 80px;
            width: 457px;
        }
        div.form-box {
            position: absolute;
            right: 8%;
            top: 20%;
            width: 420px;
            height: 420px;
            background: rgba(255, 255, 255, 0.80);
            box-shadow: 1px 2px 10px 0 rgba(185, 185, 185, 0.50);
            border-radius: 4px;
        }
        .el-form {
            margin: 0px 50px;
            input {
                background-color: transparent;
            }
            .login-box {
                margin-top: 40px;
                .el-button {
                    width: 100%;
                    font-size: $normalFontSize;
                }
            }
            .el-checkbox {
                float: left;
                padding-left: 5px;
            }
            label {
                float: right;
                padding-right: 5px;
                cursor: pointer;
                font-size: $normalFontSize;
                &:hover {
                    color: #409EFF;
                }
            }
        }
    }
</style>
