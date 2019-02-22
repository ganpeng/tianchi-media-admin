<!--选择广告资源视频组件-->
<template>
    <div id="select-ad-video">
        <div class="item-container">
            <label class="item-name">广告主</label>
            <el-select
                v-model="adOwner"
                @change="getADResource"
                clearable
                placeholder="请选择广告主">
                <el-option
                    v-for="item in ownerOptions"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value">
                </el-option>
            </el-select>
        </div>
        <el-radio-group
            v-model="resource"
            @change="setSelectedResource">
            <el-radio
                :label="item.value"
                v-for="(item,index) in videoList"
                :key="index">
                <div class="video-box"
                     @click.self="previewVideo(item)">
                    <div @click="previewVideo(item)" class="icon-box">
                        <svg-icon icon-class="video-ad"></svg-icon>
                    </div>
                    <div class="ad-desc">
                        <div>{{item.name}}</div>
                        <div>{{item.duration}}s&nbsp;&nbsp;&nbsp;&nbsp;{{item.size}}</div>
                    </div>
                </div>
            </el-radio>
        </el-radio-group>
        <display-video-dialog
            :url="url"
            :title="title"
            :displayVideoDialogVisible="displayVideoDialogVisible"
            v-on:changeDisplayVideoDialogStatus="closeDisplayVideoDialog($event)">
        </display-video-dialog>
    </div>
</template>

<script>
    import DisplayVideoDialog from '../../video_manage/DisplayVideoDialog';

    export default {
        name: 'SelectADVideoResource',
        components: {
            DisplayVideoDialog
        },
        data() {
            return {
                url: '',
                title: '',
                displayVideoDialogVisible: false,
                resource: '',
                selectedResourceInfo: {},
                adOwner: '',
                ownerOptions: [
                    {name: '一重', value: '1'},
                    {name: '二重', value: '2'},
                    {name: '大起大重', value: '3'}
                ],
                videoList: [
                    {
                        name: '一重2019年开机广告',
                        owner: '一重111111111111111111111111111111111111111111111111',
                        value: '1',
                        duration: '20',
                        size: '20M',
                        url: 'http://0.0.0.0:8081/group2/M00/01/D5/CgEBUlxj8QOAZpn_AADzk1u9fQw85.m3u8'
                    },
                    {
                        name: '二重2019年开机广告',
                        owner: '二重',
                        value: '2',
                        duration: '30',
                        size: '30M',
                        url: 'http://0.0.0.0:8081/group2/M00/01/D1/CgEBUlxj8HaALJmKAAEarkZ_vtI54.m3u8'
                    },
                    {
                        name: '大起大重2019年开机广告',
                        owner: '大起大重',
                        value: '3',
                        duration: '40',
                        size: '40M',
                        url: 'http://0.0.0.0:8081/group1/M00/01/C0/CgEBUVxj7eCAQOozAAGYmNPnWOk86.m3u8'
                    }
                ]
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                // this.$service.getOwners.then(response => {
                //     if (response && response.code === 0) {
                //         this.ownerOptions = response.data.list;
                //     }
                // });
            },
            getADResource() {

            },
            // 设置选择的视频资源
            setSelectedResource() {
                for (let i = 0; i < this.videoList.length; i++) {
                    if (this.videoList[i].value === this.resource) {
                        this.selectedResourceInfo = this.videoList[i];
                    }
                }
            },
            previewVideo(video) {
                this.displayVideoDialogVisible = true;
                this.url = video.url;
                this.title = video.title;
            },
            closeDisplayVideoDialog(status) {
                this.displayVideoDialogVisible = status;
            },
            getVideoInfo() {
                if (!this.resource) {
                    this.$message.warning('请选择相应的视频资源');
                    return false;
                } else {
                    return this.selectedResourceInfo;
                }
            }
        }
    };
</script>

<style lang="scss" scoped>

    #select-ad-video {
        text-align: left;
    }

    .item-container {
        margin-left: 40px;
        margin-top: 30px;
        text-align: left;
        .item-name {
            margin-right: 20px;
            font-size: 16px;
            color: #A8ABB3;
        }
    }

    .el-radio-group {
        padding-bottom: 50px;
        margin-left: 40px;
        overflow: hidden;
        .el-radio {
            float: left;
            margin-right: 40px;
            margin-top: 30px;
            & + .el-radio {
                margin-left: 0px;
            }
        }
        .video-box {
            height: 100px;
            width: 170px;
            background: #2A3040;
            border: 1px solid #3E495E;
            border-radius: 8px;
            cursor: pointer;
            overflow: visible;
            &:hover {
                border: 1px solid #1989FA;
                i {
                    visibility: visible;
                }
                .svg-icon-video-ad {
                    fill-opacity: 1;
                }
            }
            .icon-box {
                display: inline-block;
            }
            .svg-icon-video-ad {
                margin-top: 25px;
                margin-left: 58px;
                width: 50px !important;
                height: 50px !important;
                fill-opacity: 0.5;
            }
            .ad-desc {
                position: relative;
                top: 25px;
                div {
                    height: 20px;
                    line-height: 20px;
                    text-align: center;
                    font-size: 12px;
                    color: #A8ABB3;
                }
            }
        }
    }

</style>

<style lang="scss">

    #select-ad-video {
        .el-radio__input {
            position: absolute;
            top: 22px;
            left: 5px;
        }
    }

</style>
