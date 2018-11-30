<!--  设置为频道的弹窗 -->
<template>
    <div class="channel-dialog-container">
        <el-dialog
            title="设置为频道"
            class="my-dialog"
            :visible.sync="dialogVisible"
            :show-close="true"
            :before-close="closeDialog"
            @open="showDialog"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :append-to-body="true">
            <div class="person-dialog-container">
                <el-form class="my-el-form" label-width="100px" @submit.native.prevent>
                    <el-form-item label="频道" required>
                        <div v-if="layoutItem.name" class="my-tags">
                            <el-tag :disable-transitions="false">
                                {{layoutItem.name}}
                            </el-tag>
                        </div>
                        <channel-search
                            :handleSelect="selectChannelHandler"
                        ></channel-search>
                    </el-form-item>
                    <el-form-item label="图片" required>
                        <single-image-uploader
                            id="programmeSubjectImageUploaderOne"
                            :uri="layoutItem.coverImage ? layoutItem.coverImage.uri : ''"
                            :uploadSuccessHandler="uploadChannelCoverImageSuccessHandler"
                            :allowResolutions="allowResolutions"
                        ></single-image-uploader>
                    </el-form-item>
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
import ChannelSearch from './ChannelSearch';
export default {
    name: 'EditChannel',
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
            index: 0
        };
    },
    created() {
        let {navbarId, index} = this.$route.params;
        this.navbarId = navbarId;
        this.index = parseInt(index);
    },
    computed: {
        ...mapGetters({

            getLayoutItemByNavbarId: 'pageLayout/getLayoutItemByNavbarId'
        }),
        layoutItem() {
            let layoutItem = this.getLayoutItemByNavbarId(this.navbarId, this.index, this.squareIndex);
            return layoutItem;
        }
    },
    methods: {
        ...mapMutations({
            updateLayoutItemByIndex: 'pageLayout/updateLayoutItemByIndex'
        }),
        //  弹窗的操作
        showDialog() {
            this.dialogVisible = true;
        },
        closeDialog() {
            this.dialogVisible = false;
        },
        selectChannelHandler(channel) {
            this.updateLayoutItemByIndex({ index: this.index, navbarId: this.navbarId, squareIndex: this.squareIndex, key: 'id', value: channel.id });
            this.updateLayoutItemByIndex({ index: this.index, navbarId: this.navbarId, squareIndex: this.squareIndex, key: 'name', value: channel.name });
        },
        //  图片上传成功之后的毁掉
        uploadChannelCoverImageSuccessHandler(image) {
            this.updateLayoutItemByIndex({ navbarId: this.navbarId, index: this.index, squareIndex: this.squareIndex, key: 'coverImage', value: image });
        },
        enterHandler() {
            if (_.get(this.layoutItem, 'coverImage.id')) {
                this.updateLayoutItemByIndex({ index: this.index, navbarId: this.navbarId, squareIndex: this.squareIndex, key: 'layoutItemType', value: 'CHANNEL' });
                this.closeDialog();
            } else {
                this.$message.error('请设置频道封面图');
                return false;
            }
        }
    }
};
</script>
<style lang="scss" scoped>
</style>
