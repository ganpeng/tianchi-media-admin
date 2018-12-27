<template>
    <el-container id="login-container">
        <el-main>
            <div class="form-box" @keyup.enter="submitForm">
                <h3>登录</h3>
                <div class="site-name">{{siteName ? siteName:'站点未配置'}}</div>
                <el-form
                    ref="login"
                    :model="formData"
                    status-icon
                    :rules="rules">
                    <el-form-item prop="name" class="name">
                        <el-input
                            v-model="formData.name"
                            clearable
                            class="border-input"
                            placeholder="用户名">
                            <svg-icon icon-class="personal_center" slot="prefix"></svg-icon>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="password" class="password">
                        <el-input
                            v-model="formData.password"
                            clearable
                            class="border-input"
                            placeholder="密码">
                            <svg-icon icon-class="password" slot="prefix"></svg-icon>
                        </el-input>
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
        </el-main>
        <svg-icon
            icon-class="login_bg"
            class-name="login-bg">
        </svg-icon>
        <svg-icon
            icon-class="login_footer_info"
            class-name="login-footer-info">
        </svg-icon>
    </el-container>
</template>

<script>

    export default {
        name: 'Login',
        data() {
            let validateAccount = (rule, value, callback) => {
                if (this.$util.isEmpty(value)) {
                    return callback(new Error('用户名不能为空'));
                } else if (!this.$util.isMobile(value) && !this.$util.isEmail(value)) {
                    return callback(new Error('请填写正确的账号'));
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
                siteName: '',
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
        mounted() {
            this.init();
        },
        methods: {
            // 初始化站点名称
            init() {
                this.$service.getSiteInfo().then(response => {
                    if (response && response.code === 0) {
                        this.siteName = response.data.siteName;
                        this.$wsCache.localStorage.set('siteInfo', response.data);
                    }
                });
            },
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

<style scoped lang="scss">

    .el-container {
        display: flex;
        flex-direction: column;
        height: 100%;
    }

    h3 {
        margin-bottom: 25px;
        margin-top: 20px;
        font-size: 20px;
        color: #FFFFFF;
        text-align: center;
        line-height: 20px;
    }

    .site-name {
        display: inline-block;
        margin-bottom: 35px;
        padding: 5px 12px;
        font-size: 20px;
        color: #637497;
        text-align: center;
        line-height: 20px;
        background: #191D26;
        border-radius: 10px;
    }

    .el-main {
        position: relative;
        min-width: 800px;
        background: #1A2233;
        .login-logo {
            position: absolute;
            left: 60px;
            bottom: 100px;
            height: 72px;
            width: 457px;
        }
        div.form-box {
            position: absolute;
            right: 8%;
            top: 20%;
            width: 420px;
            height: 420px;
            background: rgba(41, 53, 80, 0.98);
            border: 0.5px solid #637497;
            box-shadow: 2px 4px 10px 0 rgba(0, 0, 0, 0.30);
            border-radius: 8px;
            z-index: 400;
        }
        .el-form {
            margin: 0px 50px;
            input {
                background-color: transparent;
            }
            .svg-icon-personal_center {
                height: 30px !important;
                width: 30px !important;
            }
            .svg-icon-password {
                margin-left: 7px;
                height: 30px !important;
                width: 15px !important;
            }
            .login-box {
                margin-top: 40px;
                .el-button {
                    width: 100%;
                    height: 40px;
                    font-size: $normalFontSize;
                    background: #0062C4;
                    border: none;
                }
            }
            .el-checkbox {
                float: left;
                padding: 5px 0px 0px 0px;
                font-size: 14px;
                color: #6F7480;
            }
            label {
                float: right;
                padding-right: 5px;
                cursor: pointer;
                font-size: 14px;
                color: #6F7480;
                &:hover {
                    color: #409EFF;
                }
            }
        }
    }

    .login-bg {
        position: fixed;
        top: 0px;
        right: 0px;
        bottom: 0px;
        left: -400px;
        height: 100% !important;
        width: 100% !important;
        z-index: 200;
    }

    .login-footer-info {
        position: absolute;
        right: 21px;
        bottom: 18px;
        z-index: 400;
        width: 275px !important;
        height: 127px !important;
    }

</style>

<style lang="scss">

    #login-container {
        .el-input__inner {
            padding-left: 50px !important;
        }
    }

</style>
