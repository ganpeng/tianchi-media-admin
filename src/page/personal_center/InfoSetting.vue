<!--个人中心信息设置组件-->
<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>个人中心</el-breadcrumb-item>
            <el-breadcrumb-item>信息设置</el-breadcrumb-item>
        </el-breadcrumb>
        <el-row>
            <el-col :span="10">
                <div class="block-title">我的信息</div>
                <div class="grid-content bg-purple">
                    <el-form :model="updateInfo" :rules="infoRules" :status-icon='editStatus' ref="updateInfo"
                             label-width="100px"
                             class="demo-ruleForm">
                        <el-form-item label="姓名" prop="name">
                            <el-input v-model="updateInfo.name" readonly></el-input>
                        </el-form-item>
                        <el-form-item label="邮箱" prop="email">
                            <el-input v-model="updateInfo.email" :readonly="!editStatus"></el-input>
                        </el-form-item>
                        <el-form-item label="手机" prop="mobile">
                            <el-input v-model="updateInfo.mobile" :readonly="!editStatus"></el-input>
                        </el-form-item>
                        <el-form-item label="电话" prop="telephone">
                            <el-input v-model="updateInfo.telephone" :readonly="!editStatus"></el-input>
                        </el-form-item>
                        <el-form-item class="tips">
                            <label class="tips">此账号创建于2018年3月29日</label>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="editStatus = true" v-if="!editStatus">编辑信息
                            </el-button>
                            <template v-else>
                                <el-button type="primary" @click="updateForm">确定</el-button>
                                <el-button @click="resetForm">重置</el-button>
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
                        <img v-if="updateInfo.imageUrl" :src="updateInfo.imageUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                    <label>用户头像</label>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>

    export default {
        name: 'InfoSetting',
        data() {
            let checkEmail = (rule, value, callback) => {
                if (!this.editStatus) {
                    callback()
                    return
                }
                if (this.$util.isEmpty(value)) {
                    return callback(new Error('邮箱地址不能为空'))
                } else if (!this.$util.isEmail(value)) {
                    return callback(new Error('请填写正确的邮箱地址'))
                } else {
                    callback()
                }
            }
            let checkMobile = (rule, value, callback) => {
                if (!this.editStatus) {
                    callback()
                    return
                }
                if (this.$util.isEmpty(value)) {
                    return callback(new Error('手机号码不能为空'))
                } else if (!this.$util.isMobile(value)) {
                    return callback(new Error('请填写正确的手机号码'))
                } else {
                    callback()
                }
            }
            let checkTelephone = (rule, value, callback) => {
                if (!this.editStatus) {
                    callback()
                    return
                }
                if (!this.$util.isEmpty(value) && !this.$util.isTelephone(value)) {
                    return callback(new Error('请填写正确的电话号码'))
                } else {
                    callback()
                }
            }
            return {
                updateInfo: {
                    id: '',
                    name: '',
                    email: '',
                    mobile: '',
                    telephone: '',
                    imageUrl: ''
                },
                editStatus: false,
                infoRules: {
                    email: [
                        {validator: checkEmail, trigger: 'blur'}
                    ],
                    mobile: [
                        {validator: checkMobile, trigger: 'blur'}
                    ],
                    telephone: [
                        {validator: checkTelephone, trigger: 'blur'}
                    ]
                }
            }
        },
        mounted() {
            this.initData()
        },
        methods: {
            // 初始化个人信息
            initData() {
                this.$axios.get(this.$util.format('/v1/admin/{0}', this.$route.params.id)).then(response => {
                    if (response) {
                        this.updateInfo = response.data
                    }
                })
            },
            // 更新信息
            updateForm() {
                this.$refs['updateInfo'].validate((valid) => {
                    if (valid) {
                        // 请求接口
                        this.$axios.put('/v1/admin', {
                            id: this.editInfo.id,
                            email: this.editInfo.email,
                            telephone: this.editInfo.telephone,
                            mobile: this.editInfo.mobile,
                            name: this.editInfo.name
                        }).then(response => {
                            if (response) {
                                this.$message('您的账号信息更新成功')
                            }
                        })
                    } else {
                        return false
                    }
                })
            },
            resetForm() {
                this.$refs['updateInfo'].resetFields()
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
