<!-- 人物详情 -->
<template>
    <div class="person-container">
        <h2 class="content-title">{{getPageName}}</h2>
        <div class="seperator-line"></div>
        <el-row>
            <person-form
                v-on:uploadSuccess="uploadSuccess($event)"
                :isDialog="false"
                :status="status"
                :readonly="readonly"
                ref="personForm"
            ></person-form>
            <div class="fixed-btn-container">
                <span style="margin-right: 10px;" v-show="!readonly">
                    <el-button class="btn-style-two" v-if="isEdit" type="primary" @click="_updatePerson">保存</el-button>
                    <el-button class="btn-style-two" v-if="!isEdit" type="primary" @click="_createPerson">创建</el-button>
                </span>
                <el-button class="btn-style-three" @click="goBack" plain>返回列表</el-button>
            </div>
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
            let {id} = this.$route.params;
            this.resetPerson();
            if (this.status === 1 || this.status === 2) {
                if (id) {
                    this.getPersonById(id);
                }
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
                        return '添加人物';
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
                getPersonById: 'person/getPersonById'
            }),
            // 新增人物
            _createPerson() {
                this.$refs.personForm.$refs['createPerson'].validate(valid => {
                    if (valid) {
                        this.checkImageLength(() => {
                            this.isLoading = true;
                            this.createPerson()
                                .then((res) => {
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
                                    this.$message.success('编辑人物成功');
                                    this.$router.back();
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
                this.$router.back();
            }
        }
    };
</script>
<style lang="less" scoped>
.btn-wrapper {
    margin-right: 10px;
}
</style>
