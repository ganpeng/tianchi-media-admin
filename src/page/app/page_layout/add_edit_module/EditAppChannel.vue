<!--  设置为节目专题的弹窗 -->
<template>
    <div class="edit-programme-subject-container">
        <el-dialog
            title="设置频道"
            class="my-dialog"
            width="80%"
            :visible.sync="dialogVisible"
            :show-close="true"
            :before-close="closeDialog"
            @open="dialogOpenHandler"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :append-to-body="true">
            <div class="person-dialog-container">
                <el-form class="my-el-form" label-width="100px" @submit.native.prevent>
                    <el-form-item label="频道" required>
                        <div v-if="channel.name" class="my-tags">
                            <el-tag :disable-transitions="false">
                                {{channel.name}}
                            </el-tag>
                        </div>
                        <app-channel-search :handleSelect="selectChannelHandler"></app-channel-search>
                    </el-form-item>
                    <el-form-item label="图片">
                        <single-poster :img="image"></single-poster>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer text-right margin-top-l">
                    <el-button @click="closeDialog">取 消</el-button>
                    <el-button type="primary" class="btn-style-two" @click="enterHandler">确 定</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import {mapGetters} from 'vuex';
import _ from 'lodash';
import SinglePoster from 'sysComponents/custom_components/custom/SinglePoster';
import AppChannelSearch from './AppChannelSearch';
export default {
    name: 'EditAppChannel',
    props: {
        selectChannelSuccessHandler: {
            type: Function,
            default: () => {}
        }
    },
    components: {
        SinglePoster,
        AppChannelSearch
    },
    data() {
        return {
            dialogVisible: false,
            channel: {}
        };
    },
    computed: {
        ...mapGetters({
            navbarList: 'appPageLayout/navbarList'
        }),
        image() {
            return {
                width: 260,
                height: 260,
                uri: _.get(this.channel, 'logoUri')
            };
        },
        logoUri() {
            return _.get(this.channel, 'logoUri');
        }
    },
    methods: {
        //  弹窗的操作
        showDialog(layoutItemType) {
            this.dialogVisible = true;
        },
        closeDialog() {
            this.dialogVisible = false;
            this.channel = {};
        },
        async dialogOpenHandler() {
            try {
                let {navbarId} = this.$route.params;
                let res = await this.$service.getAppChannelLayout({navBarId: navbarId});
                    if (res && res.code === 0) {
                        let obj = res.data.list[0];
                        this.channel = !_.isEmpty(obj) ? _.get(obj, 'channel') : {};
                    }
            } catch (err) {
                console.log(err);
            }
        },
        selectChannelHandler(channel) {
            this.channel = channel;
        },
        async enterHandler() {
            try {
                let {navbarId} = this.$route.params;
                let navbar = this.navbarList.find((navbar) => navbar.id === navbarId);
                let navbarName = !_.isEmpty(navbar) ? _.get(navbar, 'name') : '';
                let reqBody = [{
                    navBarId: navbarId,
                    navBarName: navbarName,
                    channel: this.channel,
                    channelCategory: this.channel.category
                }];

                this.selectChannelSuccessHandler(reqBody);
                this.closeDialog();
            } catch (err) {
                console.log(err);
            }
        }
    }
};
</script>
<style lang="scss" scoped>
</style>
