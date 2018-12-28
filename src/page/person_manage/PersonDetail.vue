<!-- 人物详情 -->
<template>
    <div class="person-container">
        <h2 class="content-title">{{getPageName}}</h2>
        <div class="seperator-line"></div>
        <div class="form-container">
            <person-form
                v-on:uploadSuccess="uploadSuccess($event)"
                :isDialog="false"
                :status="status"
                :readonly="readonly"
                ref="personForm"
            ></person-form>
        </div>
        <div class="fixed-btn-container">
            <span style="margin-right: 10px;" v-show="!readonly">
                <el-button class="btn-style-two" v-if="isEdit" type="primary" @click="_updatePerson">保存</el-button>
                <el-button class="btn-style-two" v-if="!isEdit" type="primary" @click="_createPerson">创建</el-button>
            </span>
            <el-button class="btn-style-three" @click="goBack" plain>返回列表</el-button>
        </div>
    </div>
</template>
<script>
    import _ from 'lodash';
    import { mapActions, mapGetters, mapMutations } from 'vuex';
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
                isLoading: false,
                alias: ''
            };
        },
        async created() {
            try {
                let {id} = this.$route.params;
                this.resetPerson();
                if (id) {
                    let res = await this.getPersonById(id);
                    if (res && res.code === 0) {
                        this.alias = res.data.alias;
                    }
                }
            } catch (err) {
                console.log(err);
            }
        },
        mounted() {
            this.$util.toggleFixedBtnContainer();
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
                        return '人物详情';
                    case 2:
                        return '编辑人物';
                    default:
                        return '';
                }
            }
        },
        methods: {
            ...mapMutations({
                resetPerson: 'person/resetPerson'
            }),
            ...mapActions({
                createPerson: 'person/createPerson',
                updatePersonById: 'person/updatePersonById',
                getPersonById: 'person/getPersonById',
                checkAliasIsExist: 'person/checkAliasIsExist'
            }),
            // 新增人物
            _createPerson() {
                this.$refs.personForm.$refs['createPerson'].validate(valid => {
                    if (valid) {
                        if (_.get(this.person.avatarImage, 'uri')) {
                            this.isLoading = true;
                            this.checkAliasIsExist()
                                .then((result) => {
                                    if (result && result.code === 0) {
                                        if (!result.data) {
                                            this.createPerson()
                                                .then((res) => {
                                                    this.$message.success('创建人物成功');
                                                    this.$router.push({ name: 'PersonList' });
                                                }).finally(() => {
                                                    this.isLoading = false;
                                                });
                                        } else {
                                            this.$message.error(`人物别名${this.person.alias}已存在`);
                                        }
                                    }
                                });
                        } else {
                            this.$message.error('请上传人物头像');
                        }
                    } else {
                        return false;
                    }
                });
            },
            // 修改人物资料
            _updatePerson() {
                this.$refs.personForm.$refs['createPerson'].validate(valid => {
                    if (valid) {
                        if (_.get(this.person.avatarImage, 'uri')) {
                            this.isLoading = true;
                            if (this.alias === this.person.alias) {
                                this.updatePersonById()
                                    .then(() => {
                                        this.$message.success('编辑人物成功');
                                        this.$router.back();
                                    }).finally(() => {
                                        this.isLoading = false;
                                    });
                            } else {
                                this.checkAliasIsExist()
                                    .then((result) => {
                                        if (result && result.code === 0) {
                                            if (!result.data) {
                                                this.updatePersonById()
                                                    .then(() => {
                                                        this.$message.success('编辑人物成功');
                                                        this.$router.back();
                                                    }).finally(() => {
                                                        this.isLoading = false;
                                                    });
                                            } else {
                                                this.$message.error(`人物别名${this.person.alias}已存在`);
                                            }
                                        }
                                    });
                            }
                        } else {
                            this.$message.error('请上传人物头像');
                        }
                    }
                });
            },
            goBack() {
                this.$router.back();
            }
        }
    };
</script>
<style lang="scss" scoped>
</style>
