<!--添加节目新增人物弹出层-->
<template>
    <el-dialog
        title="新增人物"
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
            createPerson: 'person/createPerson'
        }),
        beforeCloseHandler() {
            this.cancelHandler();
        },
        _createPerson() {
            const personForm = this.$refs.personForm.$refs['createPerson'];
            personForm.validate(valid => {
                if (valid) {
                    this.checkImageLength(() => {
                        this.isLoading = true;
                        this.createPerson()
                            .then(() => {
                                this.$message.success('创建人物成功');
                                this.cancelHandler();
                            }).finally(() => {
                                this.isLoading = false;
                            });
                    });
                } else {
                    return false;
                }
            });
        },
        cancelHandler() {
            this.$emit('changePersonDialogStatus', false);
            this.resetPerson();
            this.$refs.personForm.$refs['createPerson'].clearValidate();
        },
        checkImageLength(next) {
            let {posterImageList} = this.person;
            if (posterImageList.length <= 0) {
                this.$message.error('请上传图片');
                return false;
            } else {
                next();
            }
        }
    }
};
</script>
<style lang="less" scoped>
</style>
