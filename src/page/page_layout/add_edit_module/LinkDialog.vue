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
                                label="名称" prop="name">
                                <el-input
                                    placeholder="请输入网页名称"
                                    clearable
                                    v-model="form.name"
                                >
                                </el-input>
                            </el-form-item>
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
                        <el-col :span="24">
                            <el-form-item label="网页封面图" required>
                                <single-image-uploader
                                    id="linkImageUploader"
                                    :showDelete="false"
                                    :uri="coverImageUri"
                                    :uploadSuccessHandler="uploadLinkImageSuccessHandler"
                                    :allowResolutions="allowResolutions"
                                ></single-image-uploader>
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
import {mapGetters, mapMutations} from 'vuex';
import _ from 'lodash';
import SingleImageUploader from 'sysComponents/custom_components/custom/SingleImageUploader';
export default {
    name: 'LinkDialog',
    components: {
        SingleImageUploader
    },
    props: {
        squareIndex: {
            type: Number,
            required: true
        },
        allowResolutions: {
            type: Array,
            default: () => [{width: 560, height: 600}]
        }
    },
    data() {
        return {
            navbarId: '',
            index: 0,
            dialogVisible: false,
            layoutItemType: '',
            form: {
                link: '',
                name: ''
            },
            inputRules: {
                link: [
                    {
                        required: true,
                        message: '请输入网页地址'
                    },
                    {
                        pattern: /^https?:\/\//, // eslint-disable-line
                        message: '请输入正确的网址'
                    }
                ]
            },

            //  2.3.0 新增字段
            layoutBlockId: '',
            layoutBlockItemClone: null
        };
    },
    created() {
        let {navbarId, index, operator} = this.$route.params;
        this.navbarId = navbarId;
        this.index = parseInt(index);
        this.operator = operator;
    },
    computed: {
        ...mapGetters({
            //  2.3.0 新增
            activeLayout: 'pageLayout/getActiveLayout',
            getLayoutBlockItem: 'pageLayout/getLayoutBlockItem',
            getLayoutBlockItemByIndex: 'pageLayout/getLayoutBlockItemByIndex'
        }),
        getHref() {
            let params = _.get(this.layoutBlockItemClone, 'params');
            if (params) {
                try {
                    let href = _.get(JSON.parse(params), 'href');
                    return href;
                } catch (err) {
                    console.log('params解析为json失败');
                }
            }
        },
        coverImageUri() {
            return _.get(this.layoutBlockItemClone, 'coverImage.uri');
        },
        layoutBlockItem() {
            if (this.operator === 'edit') {
                return this.getLayoutBlockItem(this.layoutBlockId, this.squareIndex);
            } else {
                return this.getLayoutBlockItemByIndex(this.index, this.squareIndex);
            }
        }
    },
    methods: {
        ...mapMutations({
            //  2.3.0新增
            updateLayoutBlockById: 'pageLayout/updateLayoutBlockById',
            updateLayoutBlockByIndex: 'pageLayout/updateLayoutBlockByIndex'
        }),
        //  弹窗控制方法
        async showDialog(layoutItemType) {
            let {id} = this.$route.query;
            this.layoutItemType = layoutItemType;
            this.layoutBlockId = id;
            this.dialogVisible = true;
        },
        dialogOpenHandler() {
            this.layoutBlockItemClone = _.cloneDeep(this.layoutBlockItem);
            this.form.link = this.getHref;
            this.form.name = _.get(this.layoutBlockItemClone, 'name');
            if (this.layoutItemType !== _.get(this.layoutBlockItemClone, 'layoutItemType')) {
                this.layoutBlockItemClone = _.cloneDeep(this.$util.defaultLayoutBlock);
            }
        },
        closeDialog() {
            this.dialogVisible = false;
            this.layoutItemType = '';
            this.layoutBlockId = '';
            this.layoutBlockItemClone = null;
        },
        updateLayoutBlockItem(payload) {
            let {key, value} = payload;
            let _layoutBlockItemClone = Object.assign({}, this.layoutBlockItemClone, {[key]: value});
            this.layoutBlockItemClone = _layoutBlockItemClone;
        },
        async enterSuccessHandler() {
            try {
                let valid = await this.$refs.linkForm.validate();
                if (valid) {
                    if (_.get(this.layoutBlockItemClone, 'coverImage.id')) {
                        let obj = {href: this.form.link};
                        this.updateLayoutBlockItem({ key: 'name', value: this.form.name });
                        this.updateLayoutBlockItem({ key: 'params', value: JSON.stringify(obj) });
                        this.updateLayoutBlockItem({ key: 'layoutItemType', value: 'LINK' });
                        if (this.operator === 'edit') {
                            this.updateLayoutBlockById({
                                squareIndex: this.squareIndex,
                                layoutBlockId: this.layoutBlockId,
                                layoutBlockItem: this.layoutBlockItemClone
                            });
                        } else {
                            this.updateLayoutBlockByIndex({
                                squareIndex: this.squareIndex,
                                index: this.index,
                                layoutBlockItem: this.layoutBlockItemClone
                            });
                        }
                        this.closeDialog();
                    } else {
                        this.$message.error('请设置网页封面图');
                        return false;
                    }
                }
            } catch (err) {
                console.log(err);
            }
        },
        uploadLinkImageSuccessHandler(image) {
            this.updateLayoutBlockItem({ key: 'coverImage', value: image });
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
