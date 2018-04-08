<!--创建管理员账号组件-->
<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>管理员管理</el-breadcrumb-item>
            <el-breadcrumb-item>创建管理员</el-breadcrumb-item>
        </el-breadcrumb>
        <el-row>
            <el-col :span="12">
                <div class="grid-content bg-purple">
                    <el-form :model="createInfo" :rules="infoRules" status-icon ref="createInfo"
                             label-width="100px"
                             class="demo-ruleForm">
                        <el-form-item label="姓名" prop="username" required>
                            <el-input v-model="createInfo.username" placeholder="请填写姓名"></el-input>
                        </el-form-item>
                        <el-form-item label="部门" required prop="department">
                            <el-select placeholder="请选择部门" v-model="createInfo.department">
                                <el-option label="剪辑部" value="0"></el-option>
                                <el-option label="录入部" value="1"></el-option>
                            </el-select>
                            <el-button type="primary" @click="dialogFormVisible = true">新增</el-button>
                        </el-form-item>
                        <el-form-item label="职位" required prop="position">
                            <el-select placeholder="请选择部门" v-model="createInfo.position">
                                <el-option label="剪辑师" value="0"></el-option>
                                <el-option label="文字专员" value="1"></el-option>
                            </el-select>
                            <el-button type="primary" @click="dialogFormVisible = true">新增</el-button>
                        </el-form-item>
                        <el-form-item label="邮箱" prop="email" required>
                            <el-input v-model="createInfo.email" placeholder="请填写邮箱地址"></el-input>
                        </el-form-item>
                        <el-form-item label="电话" prop="telephone">
                            <el-input v-model="createInfo.telephone" placeholder="请填写电话号码"></el-input>
                        </el-form-item>
                        <el-form-item label="手机" prop="mobile" required>
                            <el-input v-model="createInfo.mobile" placeholder="请填写手机号码"></el-input>
                        </el-form-item>
                        <el-form-item class="tips">
                            <label class="tips">带 <i>*</i> 号的为必填项</label>
                        </el-form-item>
                        <el-form-item class="operate">
                            <el-button type="primary" @click="createAdmin">创 建</el-button>
                            <el-button @click="reset">重 置</el-button>
                        </el-form-item>
                        <el-dialog title="新增部门" :visible.sync="dialogFormVisible">
                            <el-form :model="form">
                                <el-form-item label="部门名称" label-width="120px">
                                    <el-input v-model="form.name" auto-complete="off"
                                              placeholder="请填写部门名称"></el-input>
                                </el-form-item>
                            </el-form>
                            <div slot="footer" class="dialog-footer">
                                <el-button @click="dialogFormVisible = false">取 消</el-button>
                                <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
                            </div>
                        </el-dialog>
                    </el-form>
                </div>
            </el-col>
            <el-col :span="12">
                <div class="grid-content bg-purple-light">
                    <el-upload
                        class="avatar-uploader"
                        action="https://jsonplaceholder.typicode.com/posts/"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload">
                        <img v-if="imageUrl" :src="imageUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                    <label>用户头像</label>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import util from '../../util/extend'

    export default {
        name: 'CreateAdmin',
        data() {
            let checkUsername = (rule, value, callback) => {
                if (util.isEmpty(value)) {
                    return callback(new Error('姓名不能为空'))
                } else {
                    callback()
                }
            }
            let checkDepartment = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请选择部门'))
                } else {
                    callback()
                }
            }
            let checkPosition = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请选择职位'))
                } else {
                    callback()
                }
            }
            let checkEmail = (rule, value, callback) => {
                if (util.isEmpty(value)) {
                    return callback(new Error('邮箱地址不能为空'))
                } else if (!util.isEmail(value)) {
                    return callback(new Error('请填写正确的邮箱地址'))
                } else {
                    callback()
                }
            }
            let checkTelephone = (rule, value, callback) => {
                if (!util.isEmpty(value) && !util.isTelephone(value)) {
                    return callback(new Error('请填写正确的电话号码'))
                } else {
                    callback()
                }
            }
            let checkMobile = (rule, value, callback) => {
                if (util.isEmpty(value)) {
                    return callback(new Error('手机号码不能为空'))
                } else if (!util.isMobile(value)) {
                    return callback(new Error('请填写正确的手机号码'))
                } else {
                    callback()
                }
            }
            return {
                createInfo: {
                    username: '',
                    department: '',
                    position: '',
                    telephone: '',
                    email: '',
                    mobile: ''
                },
                infoRules: {
                    username: [
                        {validator: checkUsername, trigger: 'blur'}
                    ],
                    department: [
                        {validator: checkDepartment, trigger: 'blur'}
                    ],
                    position: [
                        {validator: checkPosition, trigger: 'blur'}
                    ],
                    email: [
                        {validator: checkEmail, trigger: 'blur'}
                    ],
                    telephone: [
                        {validator: checkTelephone, trigger: 'blur'}
                    ],
                    mobile: [
                        {validator: checkMobile, trigger: 'blur'}
                    ]
                },
                dialogFormVisible: false,
                form: {
                    name: ''
                },
                imageUrl: ''
            }
        },
        mounted: function () {
            this.initData()
        },
        methods: {
            // 初始化部门和职位信息
            initData() {

            },
            // 创建管理员
            createAdmin() {
                this.$refs['createInfo'].validate((valid) => {
                    if (valid) {
                        // 请求接口
                        this.$axios.post('/api/v1/admin', {
                            email: this.createInfo.email,
                            mobile: this.createInfo.mobile,
                            username: this.createInfo.username
                        }).then(response => {
                            if (response.code === 0) {
                                this.$message(response.data.username + '的账号创建成功')
                            } else {
                                this.$message(response.message)
                            }
                        }).catch(() => {
                            this.$message('网络异常')
                        })
                    } else {
                        return false
                    }
                })
            },
            reset() {
                this.$refs['createInfo'].resetFields()
            },
            // 成功上传回调
            handleAvatarSuccess(res, file) {
                this.imageUrl = URL.createObjectURL(file.raw)
            },
            // 上传图片之前回调
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg'
                const isLt2M = file.size / 1024 / 1024 < 2

                if (!isJPG) {
                    this.$message.error('上传头像图片只能是 JPG 格式!')
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!')
                }
                return isJPG && isLt2M
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>

    .demo-ruleForm {
        margin-top: 60px;
        width: 100%;
        text-align: left;
        .el-input {
            width: 70%;
        }
        .el-select {
            margin-right: 10px;
            width: 70%;
        }
        .operate {
            margin-right: 100px;
            text-align: center;
        }
        .tips {
            text-align: left;
            i {
                color: #f56c6c;
            }
        }

    }

    .avatar-uploader i {
        margin-bottom: 20px;
        margin-top: 70px;
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        &:hover {
            border-color: #409EFF;
        }
    }

    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }

    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
</style>
