<template>
    <div class="all-dialog-container">
        <el-dialog
            title="设置为节目"
            class="my-dialog"
            width="80%"
            :visible.sync="dialogVisible"
            :show-close="true"
            :before-close="closeDialog"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :append-to-body="true">
            <div class="person-dialog-container">
                <el-form class="my-el-form" status-icon label-width="120px" @submit.native.prevent>
                    <el-col :span="24">
                        <el-form-item label="非焦点图" required>
                            <single-image-uploader
                                id="programmeSubjectAllImageUploaderOne"
                                :uri="getImageByKey('coverImage') || ''"
                                :uploadSuccessHandler="uploadAllCoverImageSuccessHandler"
                                :allowResolutions="allowResolutions"
                            ></single-image-uploader>
                        </el-form-item>
                    </el-col>
                </el-form>
                <div slot="footer" class="dialog-footer text-right margin-top-l">
                    <el-button @click="closeDialog">取 消</el-button>
                    <el-button type="primary" @click="enterHandler">确 定</el-button>
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
    name: 'AllDialog',
    props: {
        squareIndex: {
            type: Number,
            default: 0
        },
        allowResolutions: {
            type: Array,
            default: () => []
        }
    },
    components: {
        SingleImageUploader
    },
    data() {
        return {
            navbarId: '',
            index: 0,
            operator: '',
            dialogVisible: false,

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
            getChiefActor: 'programme/getChiefActor',

            //  2.3.0 新增
            activeLayout: 'pageLayout/getActiveLayout',
            getLayoutBlockItem: 'pageLayout/getLayoutBlockItem',
            getLayoutBlockItemByIndex: 'pageLayout/getLayoutBlockItemByIndex'
        }),
        layoutBlockItem() {
            if (this.operator === 'edit') {
                return this.getLayoutBlockItem(this.layoutBlockId, this.squareIndex);
            } else {
                return this.getLayoutBlockItemByIndex(this.index, this.squareIndex);
            }
        },
        getImageByKey() {
            return (key) => {
                return _.get(this.layoutBlockItemClone, `${key}.uri`);
            };
        }
    },
    methods: {
        ...mapMutations({
            //  2.3.0新增
            updateLayoutBlockById: 'pageLayout/updateLayoutBlockById',
            updateLayoutBlockByIndex: 'pageLayout/updateLayoutBlockByIndex'
        }),
        updateLayoutBlockItem(payload) {
            let {key, value} = payload;
            let _layoutBlockItemClone = Object.assign({}, this.layoutBlockItemClone, {[key]: value});
            this.layoutBlockItemClone = _layoutBlockItemClone;
        },
        //  弹窗的操作
        showDialog(category) {
            let {id} = this.$route.query;
            this.layoutBlockId = id;
            this.dialogVisible = true;
            this.layoutBlockItemClone = _.cloneDeep(this.layoutBlockItem);
        },
        closeDialog() {
            this.dialogVisible = false;

            this.layoutBlockId = '';
            this.layoutBlockItemClone = null;
        },
        enterHandler() {
            this.updateLayoutBlockItem({ key: 'layoutItemType', value: 'ALL' });
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
        },
        uploadAllCoverImageSuccessHandler(image) {
            this.updateLayoutBlockItem({ key: 'coverImage', value: image });
        }
    }
};
</script>
<style lang="scss" scoped>

</style>
