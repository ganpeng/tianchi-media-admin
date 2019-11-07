<template>
    <div class="link-container">
        <el-dialog
            title="设置网页"
            class="my-dialog"
            :visible.sync="dialogVisible"
            :show-close="true"
            width="80%"
            :before-close="cancelHanlder"
            @open="dialogOpenHandler"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :append-to-body="true">
            <div class="person-dialog-container">
                <div class="step-one">
                    <el-form
                        class="searchForm clearfix"
                        :inline="false"
                        :model="form"
                        :rules="inputRules"
                        label-width="120px"
                        ref="linkForm"
                        @submit.native.prevent>
                        <el-col :span="8">
                            <el-form-item
                                label="网页地址" prop="link">
                                <el-input
                                    placeholder="请输入网页地址"
                                    clearable
                                    v-model="form.link"
                                >
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-form>
                </div>
                <div slot="footer" class="dialog-footer text-right margin-top-l">
                    <el-button @click="cancelHanlder">取 消</el-button>
                    <el-button type="primary" class="btn-style-two" @click="enterSuccessHandler">确 定</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
export default {
    name: 'LinkDialog',
    props: {
        setAdSuccess: {
            type: Function,
            default: () => {}
        }
    },
    data() {
        return {
            dialogVisible: false,
            form: { link: '' },
            inputRules: {
                link: [{ required: true, message: '请输入网页地址' }, { pattern: /^https?:\/\// }]
            },
            command: '',
            adMaterial: {}
        };
    },
    methods: {
        //  弹窗控制方法
        async showDialog(command, adMaterial) {
            this.dialogVisible = true;
            this.command = command;
            this.adMaterial = adMaterial;
        },
        dialogOpenHandler() {},
        closeDialog() {
            this.form = { link: '' };
            this.command = '';
            this.adMaterial = {};
            this.dialogVisible = false;
        },
        async enterSuccessHandler() {
            try {
                let valid = await this.$refs.linkForm.validate();
                if (valid) {
                    this.setAdSuccess({
                        command: this.command,
                        adMaterial: this.adMaterial,
                        value: this.form.link
                    });
                    this.closeDialog();
                }
            } catch (err) {
                console.log(err);
            }
        },
        cancelHanlder() {
            this.closeDialog();
        }
    }
};
</script>
<style lang="scss" scoped>
.searchForm {
    margin-top: 20px;
}
.step-two {
    margin-top: 20px;
}
</style>
