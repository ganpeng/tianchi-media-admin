<!--内容管理-栏目管理-设置混排内的节目中的视频组件（封面图片是节目的）-->
<template>
    <div class="text-center">
        <el-steps :active="activeStep" align-center>
            <el-step title="步骤1" description="请选择节目"></el-step>
            <el-step title="步骤2" description="选择节目中的视频"></el-step>
            <el-step title="步骤3" description="选择节目封面图片"></el-step>
        </el-steps>
        <keep-alive>
            <component
                v-show="!((programmeMode === 'EDIT' && activeStep === 0) || (videoMode === 'EDIT' && activeStep === 1))"
                ref="currentComponent"
                :is="currentView"
                :originState="currentState"
                :programme="programme"
                :imageSpec="imageSpec"
                v-on:setProgramme="setProgramme"
                v-on:resetProgramme="resetProgramme"
                v-on:setProgrammeVideo="setProgrammeVideo"
                v-on:resetProgrammeVideo="resetProgrammeVideo"
                v-on:setCoverImage="setCoverImage">
            </component>
        </keep-alive>
        <!--展示当前选择的节目的table表格-->
        <template v-if="programmeMode === 'EDIT' && activeStep === 0">
            <single-programme-table
                :singleProgrammeList="[programme]">
            </single-programme-table>
            <div>
                <el-button type="primary" plain @click="switchProgramme">更换节目</el-button>
            </div>
        </template>
        <!--展示当前选择的视频的table表格-->
        <template v-if="videoMode === 'EDIT' && activeStep === 1">
            <single-video-table
                :singleVideoList="[programmeVideo]">
            </single-video-table>
            <div>
                <el-button type="primary" plain @click="switchVideo">更换视频</el-button>
            </div>
        </template>
        <div class="step-button">
            <el-button @click="previous" v-if="activeStep > 0">上一步</el-button>
            <el-button @click="next" v-if="activeStep < 2">下一步</el-button>
            <el-button @click="complete" v-if="activeStep === 2">完成</el-button>
        </div>
    </div>
</template>

<script>
    import SelectSingleProgramme from '../SelectSingleProgramme';
    import SingleProgrammeTable from '../SingleProgrammeTable';
    import SelectSingleProgrammeVideo from './SelectSingleProgrammeVideo';
    import SingleVideoTable from '../SingleVideoTable';
    import SetItemProgrammeCoverImage from './SetItemProgrammeCoverImage';

    export default {
        name: 'SetItemProgrammeVideo',
        components: {
            SelectSingleProgramme,
            SingleProgrammeTable,
            SelectSingleProgrammeVideo,
            SingleVideoTable,
            SetItemProgrammeCoverImage
        },
        /** imageSpec 当前选择的节目中适合当前板式的图片集合
         *  originProgrammeVideo 需要回填的节目的信息
         * */
        props: ['imageSpec', 'originState'],
        data() {
            return {
                activeStep: 0,
                // 当前设置的节目
                programme: {},
                // 当前设置的节目视频
                programmeVideo: {},
                // 当前节目的视频选择的封面图片（节目的）
                coverImage: {},
                // 当前选择的节目的视频的状态信息
                currentState: {},
                // 当前是否为item节目编辑状态
                programmeMode: 'NORMAL',
                // 当前是否为item视频编辑状态
                videoMode: 'NORMAL'
            };
        },
        computed: {
            currentView() {
                switch (this.activeStep) {
                    case 0:
                        return 'SelectSingleProgramme';
                    case 1:
                        return 'SelectSingleProgrammeVideo';
                    case 2:
                        return 'SetItemProgrammeCoverImage';
                    default:
                        return 'SelectSingleProgramme';
                }
            }
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                if (this.originState && this.originState.coverImage) {
                    this.currentState = this.originState;
                    // 节目
                    this.programme.id = this.originState.id;
                    this.programme.name = this.originState.name;
                    let video = JSON.parse(this.originState.params);
                    for (let key in video) {
                        this.programmeVideo[key] = video[key];
                    }
                    this.programmeVideo.id = video.videoId;
                    this.programmeVideo.name = video.videoName;
                    this.coverImage = this.originState.coverImage;
                    this.programmeMode = 'EDIT';
                    this.videoMode = 'EDIT';
                    this.getProgrammeDetail();
                    this.getVideoDetail();
                } else {
                    this.programmeMode = 'NORMAL';
                    this.videoMode = 'NORMAL';
                }
            },
            // 获取节目详情
            getProgrammeDetail() {
                this.$service.getProgrammeInfo({id: this.programme.id}).then(response => {
                    if (response && response.code === 0) {
                        this.programme = response.data;
                    }
                });
            },
            // 获取视频详情
            getVideoDetail() {
                this.$service.getProgrammeVideoInfo({id: this.programmeVideo.id}).then(response => {
                    if (response && response.code === 0) {
                        this.programmeVideo = response.data;
                    }
                });
            },
            // 转换模式，选择节目
            switchProgramme() {
                this.programmeMode = 'NORMAL';
                this.videoMode = 'NORMAL';
                this.programme = {};
                this.programmeVideo = {};
                this.coverImage = {};
                this.currentState = {};
            },
            // 转换模式，选择视频
            switchVideo() {
                this.videoMode = 'NORMAL';
                this.programmeVideo = {};
            },
            // 设置选择的节目
            setProgramme(programme) {
                this.programme = programme;
                this.currentState = {};
            },
            // 重置选择的节目
            resetProgramme() {
                this.programme = {};
                this.coverImage = {};
            },
            // 设置选择的节目视频
            setProgrammeVideo(programmeVideo) {
                this.programmeVideo = programmeVideo;
            },
            // 重置选择的节目中的视频
            resetProgrammeVideo() {
                this.programmeVideo = {};
            },
            setCoverImage(coverImage) {
                this.coverImage = coverImage;
            },
            // 点击下一步
            next() {
                if (this.activeStep === 0 && !this.programme.id) {
                    this.$message({
                        message: '请选择节目',
                        type: 'warning'
                    });
                    return;
                } else if (this.activeStep === 1 && !this.programmeVideo.id) {
                    this.$message({
                        message: '请选择节目中的视频',
                        type: 'warning'
                    });
                    return;
                }
                this.activeStep++;
            },
            // 点击下一步
            previous() {
                this.activeStep--;
            },
            // 完成
            complete() {
                // 检测当前是否完成封面图片设置
                if (!this.coverImage.id) {
                    this.$message({
                        message: '请设置节目的视频的封面图片',
                        type: 'warning'
                    });
                    return;
                }
                // 组成节目的视频
                let programmeVideoItem = {
                    id: this.programme.id,
                    name: this.programme.name,
                    params: JSON.stringify({
                        videoId: this.programmeVideo.id,
                        videoName: this.programmeVideo.name,
                        m3u8For4K: this.programmeVideo.m3u8For4K,
                        m3u8For480P: this.programmeVideo.m3u8For480P,
                        m3u8For720P: this.programmeVideo.m3u8For720P,
                        m3u8For1080P: this.programmeVideo.m3u8For1080P
                    }),
                    layoutItemType: 'PROGRAMME_VIDEO',
                    coverImage: this.coverImage
                };
                this.$emit('setShuffleItem', programmeVideoItem);
                this.$message({
                    message: '成功设置混排模块的节目的视频',
                    type: 'success'
                });
            }
        }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>

    .el-steps {
        margin: 30px 60px 0 60px;
    }

    .step-button {
        margin: 50px 0px;
    }
</style>
