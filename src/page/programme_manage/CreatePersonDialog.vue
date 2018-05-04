<!--添加节目新增人物弹出层-->
<template>
    <el-dialog
        title="新增人物"
        :visible.sync="createPersonDialogVisible"
        :show-close="false"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        append-to-body>
        <person-form ref="personForm"></person-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="cancelHandler">取消</el-button>
            <el-button type="primary" @click="createPerson">创建</el-button>
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
        createPerson() {
            const personForm = this.$refs.personForm.$refs['createPerson'];
            personForm.validate(valid => {
                if (valid) {
                    this.cancelHandler();
                } else {
                    return false;
                }
            });
        },
        cancelHandler() {
            this.$emit('changePersonDialogStatus', false);
            const personForm = this.$refs.personForm.$refs['createPerson'];
            personForm.resetFields();
        }
    }
};
</script>
<style lang="less" scoped>
</style>
