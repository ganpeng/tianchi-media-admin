<!-- 频道设置选择频道组件 -->
<template>
    <div class="container">
        <el-form
            label-width="100px"
            :model="channelForm"
            status-icon
            class="form clearfix"
            :rules="channelFormRules"
            ref="channelForm"
            >
            <el-col :span="8">
                <el-form-item label="频道" prop="channelId">
                    <el-select
                        class="float-left"
                        v-model="channelForm.channelId"
                        clearable
                        filterable
                        remote
                        @change="channelChangeHandler"
                        :remote-method="searchChannel"
                        placeholder="请搜索频道">
                        <el-option
                            v-for="(item, index) in channelList"
                            :key="index"
                            :label="item.name ? item.name : item.innerName"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item v-if="hasImage" label="频道展示图" ref="coverImage" prop="coverImage">
                    <div class="clearfix">
                        <el-button class="float-left" type="primary" @click="uploadImageHandler">上传图片</el-button>
                    </div>
                    <ul class="cover-list">
                        <li v-for="(item,index) in filterImageList" :key="index">
                            <div
                                :style="{ 'background-image': 'url(' + appendImagePrefix(item.uri) + ')'}"
                                class="image-box"
                                @click="displayImage(index)">
                            </div>
                            <el-radio
                                v-model="imageUri"
                                :label="item.uri"
                                @change="setCoverImage">{{item.name}}
                            </el-radio>
                        </li>
                    </ul>
                </el-form-item>
                <div :class="showBtn ? 'text-right' : 'text-center'">
                    <el-button v-if="showBtn"  @click="closeSetChannelDialog">取 消</el-button>
                    <el-button type="primary" @click="setChannel">确定</el-button>
                </div>
            </el-col>
        </el-form>
        <preview-multiple-images
            :previewMultipleImages="previewImage">
        </preview-multiple-images>
        <upload-image
            :size='size'
            title="上传频道封面图片"
            :successHandler="addCoverImage"
            :imageUploadDialogVisible="imageUploadDialogVisible"
            v-on:changeImageDialogStatus="closeImageDialog($event)">
        </upload-image>
    </div>
</template>
<script>
import _ from 'lodash';
import UploadImage from 'sysComponents/custom_components/custom/UploadImage';
import PreviewMultipleImages from 'sysComponents/custom_components/custom/PreviewMultipleImages';
export default {
    name: 'SelectChannel',
    components: {
        PreviewMultipleImages,
        UploadImage
    },
    props: {
        size: {
            type: Array,
            default: () => []
        },
        successHandler: {
            type: Function,
            default: () => {}
        },
        showBtn: {
            type: Boolean,
            default: true
        },
        existList: {
            type: Array,
            default: () => []
        },
        currentRow: {
            type: Number,
            default: 0
        },
        currentIndex: {
            type: Number,
            default: 0
        },
        hasImage: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
           channelForm: {
                channelId: '',
                coverImage: null
            },
           channelFormRules: {
                channelId: [
                    { required: true, message: '请选择频道' }
                ],
                coverImage: [
                    { required: true, message: '请选择频道展示图' }
                ]
            },
            channelList: [],
            channelImageList: [],
            // 图片相关参数
            imageUploadDialogVisible: false,
            previewImage: {
                display: false,
                autoplay: false,
                activeIndex: 0,
                list: []
            },
            imageUri: ''
        };
    },
    computed: {
        getChannelName() {
            return (id) => {
                let channel = this.channelList.find((channel) => channel.id === id);
                return channel ? channel.name : '';
            };
        },
        filterImageList() {
            let {value} = this.size[0];
            let [width, height] = value.split('*');
            return this.channelImageList.filter((img) => {
                return parseInt(img.width) === parseInt(width) &&
                       parseInt(img.height) === parseInt(height);
            });
        }
    },
    methods: {
        searchChannel: _.debounce(function(value) {
            let {imageSpec} = this.$route.params;
            let params = { keyword: value };
            if (imageSpec === 'live-carousel') {
                params.category = 'LIVE';
            }
            this.$service.getChannelList(params)
                .then((res) => {
                    if (res && res.code === 0) {
                        let channelList = _.uniqBy(this.channelList.concat(res.data.list), 'id');
                        this.channelList = channelList;
                    }
                });
        }, 300),
        getExistChannel() {
            let obj = this.existList[this.currentRow][this.currentIndex];
            if (obj.id) {
                    let id = obj.id;
                    let imageUri = obj.coverImage && obj.coverImage.uri ? obj.coverImage.uri : '';
                    this.$service.getChannelDetail(id)
                        .then((res) => {
                            if (res && res.code === 0) {
                                this.channelList.push(res.data);
                                let channelList = _.uniqBy(this.channelList, 'id');
                                this.channelList = channelList;
                                this.channelForm.channelId = res.data.id;
                                this.channelForm.coverImage = obj.coverImage;
                                this.channelImageList = res.data.imageList;
                                this.imageUri = imageUri;
                            }
                        });
                }
        },
        filterChannelList(channelList) {
            let existList = [];
            this.existList.forEach((item) => {
                existList = existList.concat(item);
            });
        },
        channelChangeHandler(id) {
            let channel = this.channelList.find((channel) => channel.id === id);
            if (channel && channel.imageList) {
                this.channelImageList = channel.imageList;
            } else {
                this.channelImageList = [];
            }
        },
        setChannel() {
            this.$refs.channelForm.validate(valid => {
                if (valid) {
                    let {channelId, coverImage} = this.channelForm;
                        this.$service.getChannelDetail(channelId)
                            .then((res) => {
                                if (res && res.code === 0) {
                                    let channel = res.data;
                                    if (channel.visible) {
                                        let res = {
                                            id: channelId,
                                            layoutItemType: 'CHANNEL',
                                            name: this.getChannelName(channelId),
                                            coverImage,
                                            cornerMark: {}
                                        };
                                        if (this.showBtn) {
                                            this.successHandler(res);
                                            this.closeSetChannelDialog();
                                        } else {
                                            this.successHandler(res);
                                        }
                                    } else {
                                        this.$message.error('该频道处于禁播状态, 请重新选择频道');
                                    }
                                }
                            });
                }
            });
        },
        //  图片相关
        uploadImageHandler() {
            if (this.channelForm.channelId) {
                this.imageUploadDialogVisible = true;
            } else {
                this.$message.error('请先选择频道');
            }
        },
        closeImageDialog() {
            this.imageUploadDialogVisible = false;
        },
        closeSetChannelDialog() {
            this.$emit('closeSetChannelDialog');
            // 清除表单数据
            this.$refs.channelForm.resetFields();
            this.channelImageList = [];
            this.imageUri = '';
        },
        appendImagePrefix(uri) {
            let baseUri = window.localStorage.getItem('imageBaseUri');
            return baseUri + uri;
        },
        // 放大预览图片
        displayImage(index) {
            this.previewImage.display = true;
            // this.previewImage.list = this.channelImageList;
            this.previewImage.list = this.filterImageList;
            this.previewImage.activeIndex = index;
        },
        setCoverImage(uri) {
            let coverImage = this.channelImageList.find((img) => {
                return img.uri === uri;
            });
            this.channelForm.coverImage = coverImage;
            this.$refs.coverImage.clearValidate();
        },
        addCoverImage(data) {
            let {channelId} = this.channelForm;
            this.channelImageList.push(data.posterImage);
            this.channelImageList = _.uniqBy(this.channelImageList, 'id');
            let channel = this.channelList.find((channel) => channel.id === channelId);
            channel.imageList = this.channelImageList;
            this.$service.updateChannelById(channelId, channel)
                .then((res) => {
                    if (res && res.code === 0) {}
                });
        }
        // 图片相关结束
    }
};
</script>
<style lang="less" scoped>
</style>
