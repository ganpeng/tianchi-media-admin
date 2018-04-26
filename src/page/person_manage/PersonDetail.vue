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
                <person-form :status="status" :readonly="readonly" ref="personForm"></person-form>
                <div class="form-btn" v-show="!readonly">
                    <el-button v-show="isEdit" type="primary" @click="editPerson">编辑</el-button>
                    <el-button v-show="!isEdit" type="primary" @click="createPerson">创 建</el-button>
                    <el-button @click="reset">重 置</el-button>
                </div>
            </el-col>
        </el-row>
    </div>
</template>
<script>
    import PersonForm from './PersonForm';

    export default {
        name: 'PersonDetail',
        components: {
            PersonForm
        },
        props: {
            status: { // status 有三种状态，0代表创建 "create", 1代表显示 "display", 2代表编辑 "edit"
                type: Number
            }
        },
        created() {
            if (this.status === 1 || this.status === 2) {
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
                this.$refs.personForm.$refs['createPerson'].validate(valid => {
                    if (valid) {
                    } else {
                        return false;
                    }
                });
            },
            // 修改人物资料
            editPerson() {
                this.$refs.personForm.$refs['createPerson'].validate(valid => {
                });
            },
            // 重制表单
            reset() {
                this.$refs.personForm.$refs['createPerson'].resetFields();
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
