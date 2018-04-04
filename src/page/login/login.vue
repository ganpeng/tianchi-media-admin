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
                    <el-form-item label="账号" prop="username" class="input-box">
                        <el-input v-model="formData.username" auto-complete="off"
                                  placeholder="请输入工作邮箱或者手机号码"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password" class="input-box">
                        <el-input type="password" v-model="formData.password" auto-complete="off"
                                  placeholder="请输入密码"></el-input>
                    </el-form-item>
                    <el-form-item class="login-box">
                        <el-button type="primary" @click="submitForm">登录</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-checkbox label="记住密码" name="type" v-model="memory"></el-checkbox>
                        <label @click="retrievePass">忘记密码</label>
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
    import util from '../../util/extend'

    export default {
        name: 'login',
        data() {
            let validateAccount = (rule, value, callback) => {
                if (util.isEmpty(value)) {
                    return callback(new Error('用户名不能为空'))
                } else if (!util.isMobile(value) && !util.isEmail(value)) {
                    return callback(new Error('请填写正确账号'))
                } else {
                    callback()
                }
            }
            let validatePass = (rule, value, callback) => {
                if (util.isEmpty(value)) {
                    callback(new Error('请输入密码'))
                } else if (!util.isPassword(value)) {
                    callback(new Error('请输入6-8位密码!'))
                } else {
                    callback()
                }
            }
            return {
                formData: {
                    username: '',
                    password: ''
                },
                memory: false,
                rules: {
                    username: [
                        {validator: validateAccount, trigger: 'blur'}
                    ],
                    password: [
                        {validator: validatePass, trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            // 登录
            submitForm() {
                this.$refs.login.validate((valid) => {
                    if (valid) {
                        this.$store.dispatch('user/login', this.formData).then(response => {
                            const data = response.data
                            if (data.code === 0) {
                                this.$router.push({name: 'home'})
                            } else {
                                this.$message(data.message)
                            }
                        }).catch(() => {
                            this.$message('网络异常')
                        })
                    } else {
                        return false
                    }
                })
            },
            // 跳转找回密码
            retrievePass() {
                this.$router.push({name: 'retrievePassword'})
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
