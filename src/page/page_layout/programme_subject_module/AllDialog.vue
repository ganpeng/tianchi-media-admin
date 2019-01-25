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
            dialogVisible: false
        };
    },
    created() {
        let {navbarId, index} = this.$route.params;
        this.navbarId = navbarId;
        this.index = parseInt(index);
    },
    computed: {
        ...mapGetters({
            layout: 'pageLayout/layout'
        }),
        getImageByKey() {
            return (key) => {
                return _.get(this.layout, `${this.navbarId}.data.${this.index}.layoutItemMultiList.${this.squareIndex}.${key}.uri`);
            };
        }
    },
    methods: {
        ...mapMutations({
            updateLayoutItemByIndex: 'pageLayout/updateLayoutItemByIndex'
        }),
        //  弹窗的操作
        showDialog(category) {
            this.dialogVisible = true;
        },
        closeDialog() {
            this.dialogVisible = false;
        },
        enterHandler() {
            this.updateLayoutItemByIndex({
                navbarId: this.navbarId,
                index: this.index,
                squareIndex: this.squareIndex,
                key: 'layoutItemType',
                value: 'ALL'
            });
            this.closeDialog();
        },
        uploadAllCoverImageSuccessHandler(image) {
            this.updateLayoutItemByIndex({
                navbarId: this.navbarId,
                index: this.index,
                squareIndex: this.squareIndex,
                key: 'coverImage',
                value: image
            });
        }
    }
};
</script>
<style lang="scss" scoped>

</style>
