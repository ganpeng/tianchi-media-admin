<!--创建管理员账号组件-->
<template>
    <div>
        <custom-breadcrumb
            v-bind:breadcrumbList="[
            {name:'管理员管理'},
            {name:'创建管理员'}]">
        </custom-breadcrumb>
        <el-row>
            <el-col :span="8">
                <div>
                    <el-form :model="createInfo" :rules="infoRules" status-icon ref="createInfo"
                             label-width="100px"
                             class="form-block">
                        <el-form-item label="姓名" prop="name" required>
                            <el-input v-model="createInfo.name" placeholder="请填写姓名"></el-input>
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
                        <el-form-item class="operate">
                            <el-button type="primary" @click="createAdmin">创 建</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </el-col>
            <el-col :span="16">
                <div class="grid-content bg-purple-light">
                    <el-upload
                        class="avatar-uploader"
                        action="https://jsonplaceholder.typicode.com/posts/"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload">
                        <img v-if="createInfo.imageUrl" :src="createInfo.imageUrl" class="avatar">
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
        name: 'CreateAdmin',
        data() {
            let checkName = (rule, value, callback) => {
                if (this.$util.isEmpty(value)) {
                    return callback(new Error('姓名不能为空'));
                } else {
                    callback();
                }
            };
            let checkEmail = (rule, value, callback) => {
                if (this.$util.isEmpty(value)) {
                    return callback(new Error('邮箱地址不能为空'));
                } else if (!this.$util.isEmail(value)) {
                    return callback(new Error('请填写正确的邮箱地址'));
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
            let checkMobile = (rule, value, callback) => {
                if (this.$util.isEmpty(value)) {
                    return callback(new Error('手机号码不能为空'));
                } else if (!this.$util.isMobile(value)) {
                    return callback(new Error('请填写正确的手机号码'));
                } else {
                    callback();
                }
            };
            return {
                createInfo: {
                    name: '',
                    telephone: '',
                    email: '',
                    mobile: '',
                    imageUrl: ''
                },
                infoRules: {
                    name: [
                        {validator: checkName, trigger: 'blur'}
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
                }
            };
        },
        methods: {
            // 创建管理员
            createAdmin() {
                this.$refs['createInfo'].validate((valid) => {
                    if (valid) {
                        // 请求接口
                        this.$service.createAdmin({
                            email: this.createInfo.email,
                            mobile: this.createInfo.mobile,
                            name: this.createInfo.name
                        }).then(response => {
                            if (response) {
                                this.$message(response.data.name + '的账号创建成功');
                            }
                        });
                    } else {
                        return false;
                    }
                });
            },
            reset() {
                this.$refs['createInfo'].resetFields();
            },
            // 成功上传回调
            handleAvatarSuccess(res, file) {
                this.imageUrl = URL.createObjectURL(file.raw);
            },
            // 上传图片之前回调
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isJPG) {
                    this.$message.error('上传头像图片只能是 JPG 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isJPG && isLt2M;
            }
        }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>

    .el-row {
        margin-top: 50px;
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
