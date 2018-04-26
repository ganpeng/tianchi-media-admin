<!--编辑管理员账号组件-->
<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>管理员管理</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/admin-manage/list' }">管理员列表</el-breadcrumb-item>
            <el-breadcrumb-item>编辑管理员</el-breadcrumb-item>
        </el-breadcrumb>
        <el-row>
            <el-col :span="8">
                <div class="block-title">管理员信息
                    <el-tag size="mini">{{editInfo.status | displayStatus}}</el-tag>
                </div>
                <div class="grid-content bg-purple">
                    <el-form :model="editInfo" :rules="infoRules" status-icon ref="editInfo"
                             label-width="100px"
                             class="form-block">
                        <el-form-item label="姓名" prop="name" required>
                            <el-input v-model="editInfo.name" placeholder="请填写姓名"></el-input>
                        </el-form-item>
                        <el-form-item label="邮箱" prop="email" required>
                            <el-input v-model="editInfo.email" placeholder="请填写邮箱地址"></el-input>
                        </el-form-item>
                        <el-form-item label="手机" prop="mobile" required>
                            <el-input v-model="editInfo.mobile" placeholder="请填写手机号码"></el-input>
                        </el-form-item>
                        <el-form-item label="电话" prop="telephone">
                            <el-input v-model="editInfo.telephone" placeholder="请填写电话号码"></el-input>
                        </el-form-item>
                        <el-form-item class="tips">
                            <label class="tips">带 <i>*</i> 号的为必填项</label>
                        </el-form-item>
                        <el-form-item class="operate">
                            <el-button type="primary" @click="updateAdminInfo">更 新</el-button>
                            <el-button @click="reset">重 置</el-button>
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
                        <img v-if="editInfo.imageUrl" :src="editInfo.imageUrl" class="avatar">
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
        name: 'EditInfo',
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
                editInfo: {
                    id: '',
                    name: '',
                    telephone: '',
                    email: '',
                    mobile: '',
                    status: 'NORMAL',
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
        filters: {
            displayStatus(status) {
                if (status === 'NORMAL') {
                    return '正常';
                } else {
                    return '失效';
                }
            }
        },
        mounted() {
            this.initData();
        },
        methods: {
            initData() {
                this.$axios.get(this.$util.format('/v1/admin/{0}', this.$route.params.id)).then(response => {
                    if (response) {
                        this.editInfo = response.data;
                    }
                });
            },
            // 更新管理员信息
            updateAdminInfo() {
                this.$refs['editInfo'].validate((valid) => {
                    if (valid) {
                        // 请求接口
                        this.$axios.put(this.$util.format('/v1/admin/{0}', this.editInfo.id), {
                            email: this.editInfo.email,
                            telephone: this.editInfo.telephone,
                            mobile: this.editInfo.mobile,
                            name: this.editInfo.name
                        }).then(response => {
                            if (response) {
                                this.$message(response.data.name + '的账号更新成功');
                            }
                        });
                    } else {
                        return false;
                    }
                });
            },
            reset() {
                this.$refs['editInfo'].resetFields();
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
