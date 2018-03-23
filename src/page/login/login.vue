<template>
    <el-container>
        <!--头部-->
        <el-header>
            <img src="../../assets/images/logo.png">
            <label>天驰传媒后台管理系统</label>
        </el-header>
        <!--内容部分-->
        <el-main>
            <div class="form-box">
                <el-form :model="formData" status-icon :rules="rules" ref="login" label-width="50px"
                         class="demo-ruleForm">
                    <el-form-item label="账号" prop="account" class="input-box">
                        <el-input v-model="formData.account" auto-complete="off" placeholder="请输入账号"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="pass" class="input-box">
                        <el-input type="password" v-model="formData.pass" auto-complete="off"
                                  placeholder="请输入密码"></el-input>
                    </el-form-item>
                    <el-form-item class="login-box">
                        <el-button type="primary" @click="login">登录</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-checkbox label="记住密码" name="type" v-model="memory"></el-checkbox>
                        <label @click="register">注册</label>
                    </el-form-item>
                </el-form>
            </div>
        </el-main>
        <!--底部-->
        <el-footer>
            <small>天驰传媒股份有限公司 版权所有</small>
            <small>地址：北京市朝阳区东三环中路9号33层3302</small>
        </el-footer>
    </el-container>
</template>

<script>
    export default {
        name: 'login',
        data() {
            var validateAccount = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('用户名不能为空'))
                } else {
                    callback()
                }
            }
            var validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'))
                } else if (!/^[\da-zA-Z]{6,8}$/.test(value)) {
                    callback(new Error('请输入6-8位密码!'))
                } else {
                    callback()
                }
            }
            return {
                formData: {
                    account: '',
                    pass: ''
                },
                memory: false,
                rules: {
                    account: [
                        {validator: validateAccount, trigger: 'blur'}
                    ],
                    pass: [
                        {validator: validatePass, trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            // 登录
            login() {
                var _this = this
                this.$refs.login.validate((valid) => {
                    if (valid) {
                        this.$axios.post('/register', this.formData).then(function (response) {
                            console.log(response)
                        }).catch(function (err) {
                            console.log(err)
                        })
                        setTimeout(function () {
                            _this.$router.push({name: 'home'})
                        }, 3000)
                    } else {
                        setTimeout(function () {
                            _this.$router.push({name: 'home'})
                        }, 3000)
                        return false
                    }
                })
            },
            // 跳转注册
            register() {
                this.$router.push({name: 'register'})
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
    .el-container {
        height: 100%;
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
        min-width: 800px;
        background-color: #E9EEF3;
        color: #333;
        text-align: center;
        line-height: 160px;
        div.form-box {
            float: right;
            margin-top: 120px;
            margin-right: 250px;
            width: 400px;
            border: 1px solid #fff;
            background: #fff;
            border-radius: 8px;
        }
        .el-form {
            padding: 40px 40px 15px 30px;
            .input-box {
                margin-bottom: 45px;
            }
            .login-box {
                margin-bottom: 0;
                .el-button {
                    width: 100%;
                    text-align: center;
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
                &:hover {
                    color: #409EFF;
                }
            }
        }
    }
</style>
