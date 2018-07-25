<!--内容管理-栏目管理-以table表格的形式展示一个视频-->
<template>
    <div>
        <el-table
            :data="singleVideoList"
            border
            style="width:100%;margin:20px 0;">
            <el-table-column
                prop="id"
                align="center"
                width="240px"
                label="编号">
            </el-table-column>
            <el-table-column
                prop="originName"
                align="center"
                width="200px"
                label="视频名称">
            </el-table-column>
            <el-table-column
                prop="link"
                align="center"
                width="300px"
                label="预览视频">
                <template slot-scope="scope">
                    <el-button
                        v-if="scope.row.m3u8For1080P"
                        type="text"
                        size="small"
                        @click="displayVideo(scope.row.m3u8For1080P)"
                    >1080
                    </el-button>
                    <el-button
                        v-if="scope.row.m3u8For720P"
                        type="text"
                        size="small"
                        @click="displayVideo(scope.row.m3u8For720P)"
                    >720
                    </el-button>
                    <el-button
                        v-if="scope.row.m3u8For480P"
                        type="text"
                        size="small"
                        @click="displayVideo(scope.row.m3u8For480P)"
                    >480
                    </el-button>
                </template>
            </el-table-column>
            <el-table-column
                prop="takeTimeInSec"
                align="center"
                label="视频时长">
                <template slot-scope="scope">
                    {{scope.row.takeTimeInSec | fromSecondsToTime}}
                </template>
            </el-table-column>
            <el-table-column
                prop="status"
                align="center"
                label="注入状态">
                <template slot-scope="scope">
                    {{scope.row.status | switchStatus}}
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                width="220px"
                label="上传日期">
                <template slot-scope="scope">
                    {{scope.row.createdAt | formatDate('yyyy-MM-DD HH:MM:SS')}}
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                width="220px"
                label="视频用途">
                <template slot-scope="scope">
                    {{scope.row.videoType | switchVideoType}}
                </template>
            </el-table-column>
        </el-table>
        <display-video-dialog
            :url="url"
            :displayVideoDialogVisible="displayVideoDialogVisible"
            v-on:changeDisplayVideoDialogStatus="closeDisplayVideoDialog($event)">
        </display-video-dialog>
    </div>
</template>

<script>
    import DisplayVideoDialog from '../../video_manage/DisplayVideoDialog';

    export default {
        name: 'SingleVideoTable',
        components: {
            DisplayVideoDialog
        },
        props: {
            singleVideoList: {
                type: Array,
                default: function () {
                    return [];
                }
            }
        },
        filters: {
            switchStatus(status) {
                switch (status) {
                    case 'SUCCESS':
                        return '注入成功';
                    case 'FAILED':
                        return '注入失败';
                    case 'INJECTING':
                        return '注入中';
                    default:
                        return '------';
                }
            },
            switchVideoType(videoType) {
                switch (videoType) {
                    case 'VOD':
                        return '点播';
                    case 'CAROUSEL':
                        return '轮播';
                    default:
                        return '------';
                }
            }
        },
        data() {
            return {
                displayVideoDialogVisible: false,
                url: ''
            };
        },
        methods: {
            closeDisplayVideoDialog(status) {
                this.displayVideoDialogVisible = status;
            },
            displayVideo(url) {
                let baseUri = window.localStorage.getItem('videoBaseUri');
                this.displayVideoDialogVisible = true;
                this.url = `${baseUri}${url}`;
            }
        }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>

</style>
