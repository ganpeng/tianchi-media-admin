<!-- 人物详情 -->
<template>
    <div>
        <custom-breadcrumb
            v-bind:breadcrumbList="[
            {name:'内容管理'},
            {name:'人物资源管理'},
            {name:getPageName}]">
        </custom-breadcrumb>
        <el-row>
            <person-form
                v-on:uploadSuccess="uploadSuccess($event)"
                :isDialog="false"
                :status="status"
                :readonly="readonly"
                ref="personForm"
            ></person-form>
            <el-col :span="24">
                <div class="form-btn">
                    <span class="btn-wrapper" v-show="!readonly">
                        <el-button class="page-main-btn page-margin-btn" v-show="isEdit" type="primary" @click="_updatePerson">保存</el-button>
                        <el-button
                            class="page-main-btn page-margin-btn"
                            v-show="!isEdit"
                            type="primary"
                            @click="_createPerson"
                            v-loading.fullscreen.lock="isLoading">创 建</el-button>
                    </span>
                    <el-button class="page-main-btn page-margin-btn" @click="goBack" plain>返回人物列表</el-button>
                </div>
            </el-col>
        </el-row>
    </div>
</template>
<script>
    import { mapActions, mapGetters, mapMutations } from 'vuex';
    import PersonForm from './PersonForm';
    import _ from 'lodash';

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
                let {id} = this.$route.params;
                if (id) {
                    this.getPersonById(id);
                }
            } else {
                this.resetPerson();
            }
        },
        computed: {
            ...mapGetters({
                person: 'person/currentPerson'
            }),
            readonly() {
                return this.status === 1;
            },

            isEdit() {
                return this.status === 2;
            },
            getPageName() {
                switch (this.status) {
                    case 0:
                        return '人物列表-新增';
                    case 1:
                        return '人物列表-详情';
                    case 2:
                        return '人物列表-编辑';
                    default:
                        return '';
                }
            }
        },
        methods: {
            ...mapMutations({
                setAvatarImage: 'person/setAvatarImage',
                resetPerson: 'person/resetPerson',
                setBackgroundImage: 'person/setBackgroundImage'
            }),
            ...mapActions({
                createPerson: 'person/createPerson',
                updatePersonById: 'person/updatePersonById',
                getPersonById: 'person/getPersonById',
                putHotPerson: 'person/putHotPerson',
                getHotPerson: 'person/getHotPerson'
            }),
            // 新增人物
            _createPerson() {
                this.$refs.personForm.$refs['createPerson'].validate(valid => {
                    if (valid) {
                        this.checkImageLength(() => {
                            this.isLoading = true;
                            this.createPerson()
                                .then((res) => {
                                    // let id = res.data.id;
                                    // this.putHotPerson(id);
                                    this.$message.success('创建人物成功');
                                    this.$router.push({ name: 'PersonList' });
                                }).finally(() => {
                                    this.isLoading = false;
                                });
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
                        this.checkImageLength(() => {
                            this.isLoading = true;
                            this.updatePersonById()
                                .then(() => {
                                    // let {id} = this.$route.params;
                                    // this.putHotPerson(id);
                                    this.$message.success('编辑人物成功');
                                    this.$router.push({ name: 'PersonList' });
                                }).finally(() => {
                                    this.isLoading = false;
                                });
                        });
                    } else {
                        return false;
                    }
                });
            },
            checkImageLength(next) {
                let {posterImageList} = this.person;
                if (posterImageList.length <= 0) {
                    this.$message.error('请上传图片');
                    return false;
                }

                // if (posterImageList.length > 2) {
                //     this.$message.error('只能上传两张图片');
                //     return false;
                // }

                let sizeOne = posterImageList.findIndex((img) => parseInt(img.width) === 200 && parseInt(img.height) === 200);
                let sizeTwo = posterImageList.findIndex((img) => parseInt(img.width) === 1920 && parseInt(img.height) === 1080);

                if (sizeOne < 0 || sizeTwo < 0) {
                    this.$message.error('人物的头像和背景图都必须上传且只能上传一张');
                    return false;
                }
                // 设置默认图
                this.setAvatarImage();
                this.setBackgroundImage();

                if (_.isEmpty(this.person.avatarImage)) {
                    this.$message.error('请选择人物默认的封面图');
                    return false;
                }

                next();
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
