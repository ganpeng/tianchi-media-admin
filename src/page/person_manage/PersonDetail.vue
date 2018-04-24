<!-- 人物详情 -->
<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>内容管理</el-breadcrumb-item>
            <el-breadcrumb-item>人物资源管理</el-breadcrumb-item>
            <el-breadcrumb-item>新增人物</el-breadcrumb-item>
        </el-breadcrumb>
        <el-row>
            <el-col :span="8">
                <div class="grid-content bg-purple">
                    <el-form :model="person" :rules="infoRules" status-icon ref="createPerson"
                            label-width="100px"
                            class="form-block">
                        <el-form-item label="人物姓名" prop="name" required>
                            <el-input v-model="person.name" :readonly="readonly" placeholder="请输入人物姓名"></el-input>
                        </el-form-item>
                        <el-form-item label="人物简介" prop="profile" required>
                            <el-input type="textarea" :readonly="readonly" :autosize="{ minRows: 4, maxRows: 12}" placeholder="请输入人物简介" v-model="person.profile"></el-input>
                        </el-form-item>
                        <el-form-item label="出生日期" prop="birthday">
                            <el-date-picker v-model="person.birthday" :readonly="readonly" type="date" placeholder="年/月/日"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="所属地区" prop="area" required>
                            <el-select :disabled="readonly" v-model="person.area" placeholder="请选择地区">
                                <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="身高" prop="height">
                            <el-input :readonly="readonly" placeholder="" v-model="person.height">
                                <template slot="append">cm</template>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="体重" prop="weight">
                            <el-input :readonly="readonly" placeholder="" v-model="person.weight">
                                <template slot="append">kg</template>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="职业" prop="mainRole" required>
                            <el-input :readonly="readonly" v-model="person.mainRole" placeholder=""></el-input>
                        </el-form-item>
                        <el-form-item class="tips">
                            <label class="tips">带 <i>*</i> 号的为必填项</label>
                        </el-form-item>
                        <el-form-item v-show="!readonly" class="operate">
                            <el-button v-show="isEdit" type="primary" @click="editPerson">编辑</el-button>
                            <el-button v-show="!isEdit" type="primary" @click="createPerson">创 建</el-button>
                            <el-button @click="reset">重 置</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </el-col>
            <el-col :span="16">
                <div class="grid-content bg-purple-light">
                    <el-upload
                        class="avatar-uploader"
                        :disabled="readonly"
                        action="https://jsonplaceholder.typicode.com/posts/"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload">
                        <img v-if="person.avatar" :src="person.avatar" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                    <label>人物照片</label>
                </div>
            </el-col>
        </el-row>
    </div>
</template>
<script>
    export default {
        name: 'PersonDetail',
        props: {
            status: { // status 有三种状态，0代表创建 "create", 1代表显示 "display", 2代表编辑 "edit"
                type: Number
            }
        },
        data() {
            let checkName = (rule, value, callback) => {
                if (this.$util.isEmpty(value)) {
                    return callback(new Error('姓名不能为空'));
                } else {
                    callback();
                }
            };
            return {
                person: {
                    name: '',
                    profile: '',
                    birthday: '',
                    area: '',
                    height: '',
                    weight: '',
                    mainRole: '',
                    avatar: ''
                },
                infoRules: {
                    name: [{ validator: checkName, trigger: 'blur' }]
                },
                options: [
                    {
                        value: '大陆',
                        label: '大陆'
                    },
                    {
                        value: '香港',
                        label: '香港'
                    },
                    {
                        value: '台湾',
                        label: '台湾'
                    }
                ]
            };
        },
        created() {
            if (this.status === 1 || this.status === 2) {
                let id = this.$route.params.id;
            }
        },
        computed: {
            readonly() {
                return this.status === 1;
            },

            isEdit() {
                return this.status === 2;
            }
        },
        methods: {
            // 新增人物
            createPerson() {
                this.$refs['createPerson'].validate(valid => {
                    if (valid) {
                    } else {
                        return false;
                    }
                });
            },
            // 修改人物资料
            editPerson() {
                this.$refs['createPerson'].validate(valid => {
                });
            },
            reset() {
                this.$refs['createPerson'].resetFields();
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

<style lang="less" scoped>
    .form-block {
        margin-top: 60px;
        text-align: left;
        .operate {
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
            border-color: #409eff;
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
