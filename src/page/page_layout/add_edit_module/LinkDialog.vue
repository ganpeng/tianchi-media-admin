<template>
    <div class="link-container">
        <el-dialog
            title="设置网页"
            class="my-dialog"
            :visible.sync="dialogVisible"
            :show-close="true"
            :before-close="closeDialog"
            @open="showDialog"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :append-to-body="true">
            <div class="person-dialog-container">
                <div class="step-one">
                    <el-form
                        class="searchForm clearfix"
                        :model="layoutItem"
                        :inline="false"
                        label-width="120px"
                        @submit.native.prevent>
                        <el-col :span="8">
                            <el-form-item label="网页地址" required>
                                <el-input
                                    placeholder="请输入网页地址"
                                    clearable
                                    :value="getHref"
                                    @input="linkInputHandler($event)"
                                >
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="网页封面图" required>
                                <single-image-uploader
                                    id="linkImageUploader"
                                    :uri="layoutItem.coverImage ? layoutItem.coverImage.uri : ''"
                                    :uploadSuccessHandler="uploadLinkImageSuccessHandler"
                                    :allowResolutions="allowResolutions"
                                ></single-image-uploader>
                            </el-form-item>
                        </el-col>
                    </el-form>
                </div>
                <div slot="footer" class="dialog-footer text-right margin-top-l">
                    <el-button @click="closeDialog">取 消</el-button>
                    <el-button type="primary" @click="enterSuccessHandler">确 定</el-button>
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
            dialogVisible: false
        };
    },
    created() {
        let {navbarId, index} = this.$route.params;
        this.navbarId = navbarId;
        this.index = index;
    },
    computed: {
        ...mapGetters({
            getLayoutDataByNavbarId: 'pageLayout/getLayoutDataByNavbarId',
            getLayoutItemByNavbarId: 'pageLayout/getLayoutItemByNavbarId'
        }),
        layoutData() {
            let layoutData = this.getLayoutDataByNavbarId(this.navbarId, this.index);
            return layoutData;
        },
        getHref() {
            let params = _.get(this.layoutItem, 'params');
            if (params) {
                try {
                    let href = _.get(JSON.parse(params), 'href');
                    return href;
                } catch (err) {
                    console.log('params解析为json失败');
                }
            }
        },
        layoutItem() {
            let layoutItem = this.getLayoutItemByNavbarId(this.navbarId, this.index, this.squareIndex);
            return layoutItem;
        }
    },
    methods: {
        ...mapMutations({
            updateLayoutItemByIndex: 'pageLayout/updateLayoutItemByIndex'
        }),
        //  弹窗控制方法
        showDialog() {
            this.dialogVisible = true;
        },
        closeDialog() {
            this.dialogVisible = false;
        },
        linkInputHandler(href) {
            let obj = {href};
            this.updateLayoutItemByIndex({ index: this.index, navbarId: this.navbarId, squareIndex: this.squareIndex, key: 'params', value: JSON.stringify(obj) });
        },
        async enterSuccessHandler() {
            try {
                if (_.get(this.layoutItem, 'coverImage.id')) {
                    this.updateLayoutItemByIndex({ index: this.index, navbarId: this.navbarId, squareIndex: this.squareIndex, key: 'layoutItemType', value: 'LINK' });
                    this.closeDialog();
                } else {
                    this.$message.error('请设置网页封面图');
                    return false;
                }
            } catch (err) {
                console.log(err);
            }
        },
        uploadLinkImageSuccessHandler(image) {
            this.updateLayoutItemByIndex({ navbarId: this.navbarId, index: this.index, squareIndex: this.squareIndex, key: 'coverImage', value: image });
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
