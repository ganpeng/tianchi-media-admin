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
                        <el-form-item label="姓名" prop="name" required>
                            <el-input v-model="createInfo.name"></el-input>
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
                            <el-input v-model="createInfo.email"></el-input>
                        </el-form-item>
                        <el-form-item label="电话" prop="telephone">
                            <el-input v-model="createInfo.telephone"></el-input>
                        </el-form-item>
                        <el-form-item label="手机" prop="phone" required>
                            <el-input v-model="createInfo.phone"></el-input>
                        </el-form-item>
                        <el-form-item class="tips">
                            <label class="tips">带 <i>*</i> 号的为必填项</label>
                        </el-form-item>
                        <el-form-item class="operate">
                            <el-button type="primary" @click="submitForm('createInfo')">创 建</el-button>
                            <el-button @click="resetForm('createInfo')">重 置</el-button>
                        </el-form-item>
                        <el-dialog title="新增部门" :visible.sync="dialogFormVisible">
                            <el-form :model="form">
                                <el-form-item label="部门名称" :label-width="formLabelWidth">
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
        name: 'createAdmin',
        data() {
            let checkEmail = (rule, value, callback) => {
                if (!this.editStatus) {
                } else if (!util.trim(value)) {
                    return callback(new Error('邮箱地址不能为空'))
                } else if (!/^[a-zA-Z0-9]+([._\\-]*[a-zA-Z0-9])*@([a-zA-Z0-9]+[-a-zA-Z0-9]*[a-zA-Z0-9]+\.){1,63}[a-zA-Z0-9]+$/.test(util.trim(value))) {
                    return callback(new Error('请填写正确的邮箱地址'))
                } else {
                    callback()
                }
            }
            let checkPhone = (rule, value, callback) => {
                if (!this.editStatus) {
                } else if (!util.trim(value)) {
                    return callback(new Error('手机号码不能为空'))
                } else if (!/^1[0-9]{10}$/.test(util.trim(value))) {
                    return callback(new Error('请填写正确的手机号码'))
                } else {
                    callback()
                }
            }
            return {
                createInfo: {
                    name: '',
                    department: '',
                    position: '',
                    telephone: '',
                    email: '',
                    phone: ''
                },
                infoRules: {
                    email: [
                        {validator: checkEmail, trigger: 'blur'}
                    ],
                    phone: [
                        {validator: checkPhone, trigger: 'blur'}
                    ]
                },
                dialogFormVisible: false,
                form: {
                    name: '',
                    region: '',
                    date1: '',
                    date2: '',
                    delivery: false,
                    type: [],
                    resource: '',
                    desc: ''
                },
                formLabelWidth: '120px',
                imageUrl: ''
            }
        },
        methods: {
            // 上传信息
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
