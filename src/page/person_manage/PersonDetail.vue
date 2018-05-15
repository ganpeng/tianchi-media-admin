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
                <person-form
                    v-on:uploadSuccess="uploadSuccess($event)"
                    :status="status"
                    :readonly="readonly"
                    ref="personForm"
                ></person-form>
                <div class="form-btn">
                    <span class="btn-wrapper" v-show="!readonly">
                        <el-button v-show="isEdit" type="primary" @click="_updatePerson">编辑</el-button>
                        <el-button
                            v-show="!isEdit"
                            type="primary"
                            @click="_createPerson"
                            v-loading.fullscreen.lock="isLoading">创 建</el-button>
                        <el-button @click="reset">重 置</el-button>
                    </span>
                    <el-button type="primary" @click="goBack">返回人物列表</el-button>
                </div>
            </el-col>
        </el-row>
    </div>
</template>
<script>
    import { mapActions } from 'vuex';
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
        data() {
            return {
                isLoading: false
            };
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
            ...mapActions({
                createPerson: 'person/createPerson',
                updatePerson: 'person/updatePerson'
            }),
            // 新增人物
            _createPerson() {
                this.$refs.personForm.$refs['createPerson'].validate(valid => {
                    if (valid) {
                        this.isLoading = true;
                        this.createPerson()
                            .then(() => {
                                this.$message.success('创建人物成功');
                            }).finally(() => {
                                this.isLoading = false;
                            });
                    } else {
                        return false;
                    }
                });
            },
            // 修改人物资料
            _updatePerson() {
                this.$refs.personForm.$refs['createPerson'].validate(valid => {
                    if (valid) {
                        this.isLoading = true;
                        this.updatePerson()
                            .then(() => {
                                this.$message.success('编辑人物成功');
                            }).finally(() => {
                                this.isLoading = false;
                            });
                    } else {
                        return false;
                    }
                });
            },
            // 重制表单
            reset() {
                this.$refs.personForm.$refs['createPerson'].resetFields();
            },
            goBack() {
                this.$router.push({name: 'PersonList'});
            }
        }
    };
</script>

<style lang="less" scoped>
.btn-wrapper {
    margin-right: 10px;
}
</style>
