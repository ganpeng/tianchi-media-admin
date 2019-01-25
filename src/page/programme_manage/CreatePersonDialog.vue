<!--添加节目新增人物弹出层-->
<template>
    <el-dialog
        title="新增人物"
        class="my-dialog"
        :visible.sync="createPersonDialogVisible"
        :show-close="true"
        :before-close="beforeCloseHandler"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        append-to-body>
        <person-form
            :isDialog="true"
            ref="personForm">
        </person-form>
        <div slot="footer" class="dialog-footer">
            <el-button size="medium" @click="cancelHandler">取消</el-button>
            <el-button size="medium" type="primary" @click="_createPerson">创建</el-button>
        </div>
    </el-dialog>
</template>
<script>
import { mapGetters, mapActions, mapMutations } from 'vuex';
import _ from 'lodash';
import PersonForm from '../person_manage/PersonForm';
export default {
    components: {
        PersonForm
    },
    props: ['createPersonDialogVisible'],
    data() {
        return {
            isLoading: false
        };
    },
    computed: {
        ...mapGetters({
            person: 'person/currentPerson'
        })
    },
    created() {
        this.resetPerson();
    },
    methods: {
        ...mapMutations({
            resetPerson: 'person/resetPerson'
        }),
        ...mapActions({
            createPerson: 'person/createPerson',
            checkAliasIsExist: 'person/checkAliasIsExist'
        }),
        beforeCloseHandler() {
            this.cancelHandler();
        },
        _createPerson() {
            const personForm = this.$refs.personForm.$refs['createPerson'];
            personForm.validate(valid => {
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
                                                this.cancelHandler();
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
        cancelHandler() {
            this.$emit('changePersonDialogStatus', false);
            this.resetPerson();
            this.$refs.personForm.$refs['createPerson'].clearValidate();
        }
    }
};
</script>
<style lang="less" scoped>
</style>
