<!--添加节目-->
<template>
    <el-dialog
        title="新增人物"
        :visible.sync="createPersonDialogVisible"
        :show-close="false"
        :close-on-click-modal="false"
        :close-on-press-escape="false">
        <person-form ref="personForm"></person-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="cancelHandler">取 消</el-button>
            <el-button type="primary" @click="successHandler">创建</el-button>
        </div>
    </el-dialog>
</template>
<script>
import PersonForm from '../person_manage/PersonForm';
export default {
    components: {
        PersonForm
    },
    props: ['createPersonDialogVisible'],
    methods: {
        // 新增人物
        createPerson() {
            const personForm = this.$refs.personForm.$refs['createPerson'];
            personForm.validate(valid => {
                if (valid) {
                } else {
                    return false;
                }
            });
        },
        cancelHandler() {
            this.$emit('changePersonDialogStatus', false);
            const personForm = this.$refs.personForm.$refs['createPerson'];
            personForm.resetFields();
        },
        successHandler() {
            this.cancelHandler();
        }
    }
};
</script>
<style lang="less" scoped>
</style>
