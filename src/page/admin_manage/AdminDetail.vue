<!--管理员详情组件-->
<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>管理员管理</el-breadcrumb-item>
            <el-breadcrumb-item>管理员列表</el-breadcrumb-item>
            <el-breadcrumb-item>管理员详情</el-breadcrumb-item>
        </el-breadcrumb>
        <el-row>
            <el-col :span="10">
                <div class="block-title">管理员信息</div>
                <div class="grid-content bg-purple">
                    <el-form :model="adminInfo" :rules="infoRules" :status-icon='editStatus' ref="adminInfo"
                             label-width="100px"
                             class="demo-ruleForm">
                        <el-form-item label="姓名" prop="name">
                            <el-input v-model="adminInfo.name" readonly></el-input>
                        </el-form-item>
                        <el-form-item label="部门" prop="department">
                            <el-input v-model="adminInfo.department" readonly></el-input>
                        </el-form-item>
                        <el-form-item label="职位" prop="position">
                            <el-input v-model="adminInfo.position" readonly></el-input>
                        </el-form-item>
                        <el-form-item label="邮箱" prop="email">
                            <el-input v-model="adminInfo.email" :readonly="!editStatus"></el-input>
                        </el-form-item>
                        <el-form-item label="手机" prop="phone">
                            <el-input v-model="adminInfo.phone" :readonly="!editStatus"></el-input>
                        </el-form-item>
                        <el-form-item class="tips">
                            <label class="tips">此账号创建于2018年3月29日</label>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="editStatus = true" v-if="!editStatus">编辑信息
                            </el-button>
                            <template v-else>
                                <el-button type="primary" @click="submitForm('adminInfo')">确定</el-button>
                                <el-button @click="resetForm('adminInfo')">重置</el-button>
                            </template>
                        </el-form-item>
                    </el-form>
                </div>
            </el-col>
            <el-col :span="14">
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
        name: 'AdminDetail',
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
                adminInfo: {
                    name: '花想容',
                    department: '技术部',
                    position: '文字专员',
                    email: 'liuxiaofei2010S@163.com',
                    phone: '15022547876'
                },
                editStatus: false,
                infoRules: {
                    email: [
                        {validator: checkEmail, trigger: 'blur'}
                    ],
                    phone: [
                        {validator: checkPhone, trigger: 'blur'}
                    ]
                },
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
    .block-title {
        padding: 30px 0 20px 20px;
        line-height: 2;
        text-align: left;
        font-size: 22px;
    }

    .tips {
        text-align: left;
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
