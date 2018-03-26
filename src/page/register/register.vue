<template>
    <el-container class="register-container">
        <el-header>
            <img src="../../assets/images/logo.png">
            <label>后台管理系统 | 注册</label>
        </el-header>
        <el-main>
            <div class="form-box">
                <div class="login-box">
                    <label>
                        我已注册，
                        <i class="login" @click="login">直接登录</i>
                        <i class="el-icon-arrow-right"></i>
                    </label>
                </div>
                <el-form :model="registerData" status-icon :rules="rules" ref="register" label-width="80px"
                         class="demo-ruleForm">
                    <el-form-item label="手机号码" prop="phoneNumber">
                        <el-input v-model.number="registerData.phoneNumber" placeholder="请填写手机号码"></el-input>
                    </el-form-item>
                    <el-form-item label="验证码" prop="code">
                        <el-input v-model.number="registerData.code" class="verify-code"
                                  placeholder="请填写短信验证码"></el-input>
                        <el-button type="primary" class="send-code" @click="sendVerifyCode"
                                   :disabled="sendCodeDisabled">{{codeMsg}}
                        </el-button>
                    </el-form-item>
                    <el-form-item label="密码" prop="pass">
                        <el-input type="password" v-model="registerData.pass" auto-complete="off"
                                  placeholder="请填写密码"></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码" prop="checkPass">
                        <el-input type="password" v-model="registerData.checkPass" auto-complete="off"
                                  placeholder="请再次确认密码"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="register">注册</el-button>
                        <el-button @click="resetForm">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-main>
        <el-footer>
            <small>天驰传媒股份有限公司 版权所有</small>
            <small>地址：北京市朝阳区东三环中路9号33层3302</small>
        </el-footer>
    </el-container>
</template>

<script>
    export default {
        name: 'register',
        data() {
            var checkPhone = (rule, value, callback) => {
                if (!this.trim(value)) {
                    return callback(new Error('手机号码不能为空'))
                } else if (!Number.isInteger(this.trim(value))) {
                    callback(new Error('请输入数字值'))
                } else if (!/^1[0-9]\d{10}$/.test(this.trim(value))) {
                    callback(new Error('请填写11位手机号码'))
                } else {
                    callback()
                }
            }
            var checkCode = (rule, value, callback) => {
                if (!this.trim(value)) {
                    return callback(new Error('短信验证码不能为空'))
                } else {
                    callback()
                }
            }
            var validatePass = (rule, value, callback) => {
                if (this.trim(value) === '') {
                    callback(new Error('请输入密码'))
                } else {
                    if (this.registerData.checkPass !== '') {
                        this.$refs.register.validateField('checkPass')
                    }
                    callback()
                }
            }
            var validatePass2 = (rule, value, callback) => {
                if (this.trim(value) === '') {
                    callback(new Error('请再次输入密码'))
                } else if (this.trim(value) !== this.registerData.pass) {
                    callback(new Error('两次输入密码不一致!'))
                } else {
                    callback()
                }
            }
            return {
                registerData: {
                    phoneNumber: '',
                    pass: '',
                    checkPass: '',
                    code: ''
                },
                codeMsg: '点击发送短信验证码',
                sendCodeDisabled: false,
                rules: {
                    phoneNumber: [
                        {validator: checkPhone, trigger: 'blur'}
                    ],
                    code: [
                        {validator: checkCode, trigger: 'blur'}
                    ],
                    pass: [
                        {validator: validatePass, trigger: 'blur'}
                    ],
                    checkPass: [
                        {validator: validatePass2, trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            // 发送短信验证码
            sendVerifyCode() {
                let _this = this
                this.$refs.register.validateField('phoneNumber', (errMessage) => {
                    if (!errMessage) {
                        this.codeMsg = '发送中...'
                        this.sendCodeDisabled = true
                        // 发送短信验证码
                        let delayTime = 10
                        const timer = setInterval(
                            () => {
                                _this.codeMsg = '已发送(' + delayTime + 's)'
                                delayTime--
                                if (delayTime === -1) {
                                    clearInterval(timer)
                                    this.sendCodeDisabled = false
                                    this.codeMsg = '重新点击发送验证码'
                                }
                            }, 1000)
                    } else {
                        return false
                    }
                })
            },
            // 注册
            register() {
                this.$refs.register.validate((valid) => {
                    if (valid) {
                        // 请求注册接口
                        this.$message('注册成功')
                    } else {
                        return false
                    }
                })
            },
            resetForm() {
                this.$refs.register.resetFields()
            },
            // 去登陆
            login() {
                this.$router.push({name: 'login'})
            },
            // 去除字符的前后所有空格
            trim(value) {
                return value.toString().replace(/(^\s*) | (\s*$)/g, '')
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
    .el-container {
        height: 100%;
        min-width: 600px;
    }

    .el-header, .el-footer {
        background-color: #B3C0D1;
        color: #333;
        text-align: center;
        line-height: 60px;
        img {
            float: left;
            margin-top: 20px;
            width: 25px;
            height: 25px;
        }
        label {
            float: right;
        }
        small:first-child {
            margin-right: 30px;
        }
    }

    .el-main {
        background-color: #E9EEF3;
        color: #333;
        text-align: center;
        .form-box {
            margin: 40px auto 0 auto;
            width: 600px;
        }
        div {
            overflow: hidden;
            label {
                float: right;
                margin-right: 10px;
                margin-bottom: 5px;
                i.login {
                    font-style: normal;
                    color: #f66;
                    cursor: pointer;
                    &:hover {
                        color: #409EFF;
                    }
                }
            }
        }
        .el-form {
            padding: 50px 30px 20px 30px;
            border: 1px solid #fff;
            background: #fff;
            border-radius: 8px;
            .verify-code {
                width: 270px;
            }
            .send-code {
                float: right;
                margin-left: 20px;
                width: 164px;
            }
        }
    }
</style>
