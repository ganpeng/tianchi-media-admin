<!--个人中心信息设置组件-->
<template>
    <div>
        <custom-breadcrumb
            v-bind:breadcrumbList="[
            {name:'个人中心'},
            {name:'编辑信息'}]">
        </custom-breadcrumb>
        <div class="main-container">
            <el-form :model="updateInfo"
                     :rules="infoRules"
                     ref="updateInfo"
                     label-width="100px">
                <el-form-item label="用户名" prop="name">
                    <label class="value">{{updateInfo.name}}</label>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <label class="value">{{updateInfo.email}}</label>
                </el-form-item>
                <el-form-item label="手机" prop="mobile" required>
                    <el-input v-model="updateInfo.mobile" placeholder="请输入手机号" clearable></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="telephone">
                    <el-input v-model="updateInfo.telephone" placeholder="请输入电话号" clearable></el-input>
                </el-form-item>
            </el-form>
            <div class="upload-box" @click="showMessage">
                <el-upload
                    @click="showMessage"
                    class="avatar-uploader"
                    action="https://jsonplaceholder.typicode.com/posts/"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload">
                    <img v-if="updateInfo.imageUrl" :src="updateInfo.imageUrl" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
                <label>上传头像</label>
            </div>
        </div>
        <div class="btn-box">
            <el-button type="primary" @click="updateForm" class="page-main-btn">保存</el-button>
        </div>
    </div>
</template>

<script>

    export default {
        name: 'InfoSetting',
        data() {
            let checkMobile = (rule, value, callback) => {
                if (this.$util.isEmpty(value)) {
                    return callback(new Error('手机号码不能为空'));
                } else if (!this.$util.isMobile(value)) {
                    return callback(new Error('请填写正确的手机号码'));
                } else {
                    callback();
                }
            };
            let checkTelephone = (rule, value, callback) => {
                if (!this.$util.isEmpty(value) && !this.$util.isTelephone(value)) {
                    return callback(new Error('请填写正确的电话号码'));
                } else {
                    callback();
                }
            };
            return {
                updateInfo: {
                    id: '',
                    name: '',
                    email: '',
                    mobile: '',
                    telephone: '',
                    createdAt: '',
                    imageUrl: ''
                },
                infoRules: {
                    mobile: [
                        {validator: checkMobile, trigger: 'blur'}
                    ],
                    telephone: [
                        {validator: checkTelephone, trigger: 'blur'}
                    ]
                }
            };
        },
        mounted() {
            this.initData();
        },
        methods: {
            // 初始化个人信息
            initData() {
                this.$service.getAdminSelfInfo().then(response => {
                    if (response) {
                        this.updateInfo = response.data;
                    }
                });
            },
            // 更新信息
            updateForm() {
                this.$refs['updateInfo'].validate((valid) => {
                    if (valid) {
                        // 请求接口
                        this.$service.updateAdminSelfInfo({
                            email: this.updateInfo.email,
                            telephone: this.updateInfo.telephone,
                            mobile: this.updateInfo.mobile,
                            name: this.updateInfo.name
                        }).then(response => {
                            if (response && response.code === 0) {
                                this.$message({
                                    message: '您的账号信息更新成功',
                                    type: 'success'
                                });
                                this.$router.push({name: 'MyInfo'});
                            }
                        });
                    } else {
                        return false;
                    }
                });
            },
            // 成功上传回调
            handleAvatarSuccess(res, file) {
                this.imageUrl = URL.createObjectURL(file.raw);
            },
            // 上传图片之前回调
            beforeAvatarUpload() {
                this.$message('暂时不支持设置头像，敬请期待');
            },
            showMessage() {
                this.$notify.info({
                    title: '消息',
                    message: '暂时不支持设置头像，敬请期待'
                });
            }
        }
    };
</script>

<style lang="scss" scoped>

    .el-breadcrumb {
        margin-bottom: 80px;
    }

    .main-container {
        display: flex;
        justify-content: space-between;
        max-width: 1200px;
        align-items: center;
    }

    .el-form {
        width: 600px;
        .el-form-item {
            width: 400px;
            text-align: left;
            .value {
                font-size: $normalFontSize;
                color: #909399;
            }
        }
    }

    .upload-box {
        .avatar-uploader i {
            position: relative;
            margin-bottom: 10px;
            border: 1px solid #d9d9d9;
            border-radius: 6px;
            cursor: pointer;
            overflow: hidden;
            &:hover {
                border-color: #409EFF;
                color: $baseBlue;
            }
        }
        .avatar-uploader-icon {
            width: 178px;
            height: 178px;
            font-size: 28px;
            color: #8c939d;
            line-height: 178px;
            text-align: center;
        }

        .avatar {
            display: block;
            width: 200px;
            height: 200px;
        }
        label {
            color: $baseGray;
            font-size: $largerFontSize;
        }
    }

    .btn-box {
        max-width: 1200px;
        margin: 300px 0px 80px 0px;
    }

</style>
