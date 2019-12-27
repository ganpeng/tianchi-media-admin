<!--  设置为频道的弹窗 -->
<template>
    <div class="channel-dialog-container">
        <el-dialog
            title="设置为频道"
            class="my-dialog"
            :visible.sync="dialogVisible"
            :show-close="true"
            :before-close="cancelHanlder"
            @open="dialogOpenHandler"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :append-to-body="true">
            <div class="person-dialog-container">
                <el-form class="my-el-form" label-width="100px" @submit.native.prevent>
                    <el-form-item label="频道" required>
                        <div v-if="layoutBlockItemClone.name" class="my-tags">
                            <el-tag :disable-transitions="false">
                                {{layoutBlockItemClone.name}}
                            </el-tag>
                        </div>
                        <channel-search :handleSelect="selectChannelHandler"></channel-search>
                    </el-form-item>
                    <el-form-item label="图片" required>
                        <single-image-uploader
                            id="programmeSubjectImageUploaderOne"
                            :showDelete="false"
                            :uri="layoutBlockItemClone.coverImage ? layoutBlockItemClone.coverImage.uri : ''"
                            :uploadSuccessHandler="uploadChannelCoverImageSuccessHandler"
                            :allowResolutions="allowResolutions"
                        ></single-image-uploader>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer text-right margin-top-l">
                    <el-button @click="cancelHanlder">取 消</el-button>
                    <el-button type="primary" class="btn-style-two" @click="enterHandler">确 定</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import {mapGetters, mapMutations} from 'vuex';
import _ from 'lodash';
import SingleImageUploader from 'sysComponents/custom_components/custom/SingleImageUploader';
import ChannelSearch from './ChannelSearch';
export default {
    name: 'ChannelDialog',
    props: {
        squareIndex: {
            type: Number,
            default: 0
        },
        allowResolutions: {
            type: Array,
            default: () => [{width: 260, height: 260}]
        }
    },
    components: {
        SingleImageUploader,
        ChannelSearch
    },
    data() {
        return {
            dialogVisible: false,
            navbarId: '',
            index: 0,

            //  2.3.0 新增字段
            layoutBlockId: '',
            layoutBlockItemClone: {}
        };
    },
    created() {
        let {navbarId, index} = this.$route.params;
        this.navbarId = navbarId;
        this.index = parseInt(index);
    },
    computed: {
        ...mapGetters({
            //  2.3.0 新增
            activeLayout: 'pageLayout/getActiveLayout',
            getLayoutBlockItem: 'pageLayout/getLayoutBlockItem',
            getLayoutBlockItemByIndex: 'pageLayout/getLayoutBlockItemByIndex'
        }),
        layoutBlockItem() {
            let {operator} = this.$route.params;
            if (operator === 'edit') {
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
        //  弹窗的操作
        async showDialog(layoutItemType) {
            let {id} = this.$route.query;
            this.layoutItemType = layoutItemType;
            this.layoutBlockId = id;
            this.dialogVisible = true;
        },
        closeDialog() {
            this.dialogVisible = false;
            this.layoutBlockId = '';
            this.layoutBlockItemClone = {};
        },
        dialogOpenHandler() {
            this.layoutBlockItemClone = _.cloneDeep(this.layoutBlockItem);
            if (this.layoutItemType !== _.get(this.layoutBlockItemClone, 'layoutItemType')) {
                this.layoutBlockItemClone = _.cloneDeep(this.$util.defaultLayoutBlock);
            }
        },
        updateLayoutBlockItem(payload) {
            let {key, value} = payload;
            let _layoutBlockItemClone = Object.assign({}, this.layoutBlockItemClone, {[key]: value});
            this.layoutBlockItemClone = _layoutBlockItemClone;
        },
        selectChannelHandler(channel) {
            this.updateLayoutBlockItem({ key: 'id', value: channel.id });
            this.updateLayoutBlockItem({ key: 'name', value: channel.name });
        },
        //  图片上传成功之后的毁掉
        uploadChannelCoverImageSuccessHandler(image) {
            this.updateLayoutBlockItem({ key: 'coverImage', value: image });
        },
        enterHandler() {
            if (_.get(this.layoutBlockItemClone, 'coverImage.id')) {
                this.updateLayoutBlockItem({ key: 'layoutItemType', value: 'CHANNEL' });
                let {operator} = this.$route.params;
                if (operator === 'edit') {
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
                this.$message.error('请设置频道封面图');
                return false;
            }
        },
        cancelHanlder() {
            this.closeDialog();
        }
    }
};
</script>
<style lang="scss" scoped>
</style>
