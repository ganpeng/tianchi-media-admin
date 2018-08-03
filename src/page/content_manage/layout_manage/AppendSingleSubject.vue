<!--内容管理-栏目管理-单个推荐位选择专题-->
<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>内容管理</el-breadcrumb-item>
            <el-breadcrumb-item>栏目管理</el-breadcrumb-item>
            <el-breadcrumb-item
                :to="'/nav-bar-manage/layout-setting/' + currentNavBarInfo.signCode + '/' + currentNavBarInfo.id">
                {{currentNavBarInfo.name}}页面设置
            </el-breadcrumb-item>
            <el-breadcrumb-item>单个推荐位选择专题</el-breadcrumb-item>
        </el-breadcrumb>
        <h3 class="text-left">请选择要推荐的专题：</h3>
        <select-single-subject
            v-show="mode === 'NORMAL'"
            ref="selectSingleSubject"
            v-on:resetSubjectInfo="resetSubjectInfo"
            v-on:setSubject="setSubject">
        </select-single-subject>
        <template v-if="mode === 'EDIT'">
            <el-table
                :data="currentSubjectList"
                border
                style="width: 100%">
                <el-table-column
                    prop="code"
                    width="60px"
                    label="编号">
                    <template slot-scope="scope">
                        <label>{{scope.row.code}}</label>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="名称">
                </el-table-column>
                <el-table-column
                    label="包含节目/人物数">
                    <template slot-scope="scope">
                        <label>{{scope.row.subjectItemList === null ? 0 : scope.row.subjectItemList.length}}</label>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="description"
                    label="简介">
                    <template slot-scope="scope">
                        <label class="ellipsis-three">{{scope.row.description}}</label>
                        <el-popover
                            placement="right"
                            :title="scope.row.name + '简介'"
                            width="250"
                            trigger="hover"
                            :content="scope.row.description">
                            <el-button slot="reference" type="text" class="more">更多</el-button>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="tagList"
                    label="专题标签">
                    <template slot-scope="scope">
                        <label>{{scope.row.tagList.join(',')}}</label>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="owner"
                    label="专题创建者">
                </el-table-column>
                <el-table-column
                    prop="category"
                    label="专题类型">
                    <template slot-scope="scope">
                        <label>{{scope.row.category === 'FIGURE'?'人物' : '节目'}}</label>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="type"
                    label="节目专题类型">
                    <template slot-scope="scope">
                        <label>{{scope.row.type ? scope.row.type : '------' }}</label>
                    </template>
                </el-table-column>
                <el-table-column
                    label="创建时间">
                    <template slot-scope="scope">
                        {{scope.row.createdAt | formatDate('yyyy-MM-DD')}}
                    </template>
                </el-table-column>
                <el-table-column
                    label="状态">
                    <template slot-scope="scope">
                        {{scope.row.visible ? '已上架' : '已下架'}}
                    </template>
                </el-table-column>
            </el-table>
        </template>
        <h3 class="text-left">请选择专题的封面海报：</h3>
        <ul class="cover-list">
            <li v-for="(item,index) in specPosterImages" :key="index">
                <img :src="item.uri | imageUrl" :alt="item.name" @click="displayImage(index)">
                <el-radio v-model="subjectImageId" :label="item.id" @change="setPosterImage(index)">{{item.name}}
                </el-radio>
            </li>
        </ul>
        <div class="add-box">
            <el-button type="success" @click="addCover">添加图片</el-button>
        </div>
        <el-button v-if="mode === 'EDIT'" type="success" @click="switchMode">更换专题</el-button>
        <el-button type="primary" @click="saveSubject">保 存</el-button>
        <preview-multiple-images
            :previewMultipleImages="previewImage">
        </preview-multiple-images>
        <upload-image
            :size='size'
            title="上传专题封面图片"
            :successHandler="addPosterImage"
            :imageUploadDialogVisible="imageUploadDialogVisible"
            v-on:changeImageDialogStatus="closeImageDialog($event)">
        </upload-image>
    </div>
</template>

<script>
    import SelectSingleSubject from './SelectSingleSubject';
    import UploadImage from 'sysComponents/custom_components/custom/UploadImage';
    import {PROGRAMME_DIMENSION as subjectDimension, LAYOUT_IMAGE_DIMENSION} from '@/util/config/dimension';
    import PreviewMultipleImages from 'sysComponents/custom_components/custom/PreviewMultipleImages';

    export default {
        name: 'AppendSingleSubject',
        components: {
            SelectSingleSubject,
            UploadImage,
            PreviewMultipleImages
        },
        data() {
            return {
                size: subjectDimension,
                imageUploadDialogVisible: false,
                imageSpec: LAYOUT_IMAGE_DIMENSION[this.$route.params.imageSpec],
                navBarId: this.$route.params.navBarId,
                navBarSignCode: this.$route.params.navBarSignCode,
                currentSubject: {},
                posterImageList: [],
                // 当前专题选择的封面图片的id
                subjectImageId: '',
                // 当前专题选择的封面图片
                coverImage: {},
                previewImage: {
                    display: false,
                    autoplay: false,
                    activeIndex: 0,
                    list: []
                },
                // 信息回填为'EDIT', 正常选择为'NORMAL'
                mode: 'EDIT',
                // 回填的当前专题信息的数组
                currentSubjectList: []
            };
        },
        computed: {
            currentNavBarInfo() {
                return this.$store.getters['layout/getNavBarInfo']({
                    navBarId: this.navBarId
                });
            },
            specPosterImages() {
                return this.posterImageList.filter(image => parseInt(image.width) === this.imageSpec.coverImage.width && parseInt(image.height) === this.imageSpec.coverImage.height);
            }
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                // 获取本地数据
                this.currentRecommendItem = this.$store.getters['layout/getRecommendItemInfo']({
                    navBarSignCode: this.$route.params.navBarSignCode,
                    model: this.$route.params.model,
                    row: this.$route.params.row,
                    index: this.$route.params.index
                });
                // 如果本地数据是'SUBJECT'类型，回填编辑数据
                if (this.currentRecommendItem.layoutItemType === 'SUBJECT') {
                    this.mode = 'EDIT';
                } else {
                    this.mode = 'NORMAL';
                }
                if (this.mode !== 'EDIT') {
                    this.$nextTick(function () {
                        this.$refs.selectSingleSubject.initSubjectList([]);
                    });
                } else {
                    this.initCurrentRecommendItem();
                }
            },
            // 初始化当前推荐项的数据
            initCurrentRecommendItem() {
                this.coverImage = this.currentRecommendItem.coverImage;
                this.subjectImageId = this.coverImage.id;
                this.$service.getSubjectDetail(this.currentRecommendItem.id).then(response => {
                    if (response && response.code === 0) {
                        this.currentSubjectList.push(response.data);
                        this.currentSubject = response.data;
                        this.posterImageList = response.data.posterImageList;
                    } else {
                        this.mode = 'NORMAL';
                        this.$refs.selectSingleSubject.initSubjectList([]);
                        this.resetSubjectInfo();
                    }
                });
            },
            // 选择某一个专题
            setSubject(item) {
                this.currentSubject = item;
                this.posterImageList = item.posterImageList;
                this.coverImage = {};
                this.subjectImageId = '';
            },
            // 重置专题信息
            resetSubjectInfo() {
                this.posterImageList = [];
                this.currentSubject = {};
                this.coverImage = this.currentRecommendItem.coverImage;
                this.subjectImageId = this.coverImage.id;
            },
            // 切换到选择专题模式
            switchMode() {
                this.mode = 'NORMAL';
                this.$refs.selectSingleSubject.initSubjectList([]);
                this.resetSubjectInfo();
            },
            // 放大预览图片
            displayImage(index) {
                this.previewImage.display = true;
                this.previewImage.list = this.specPosterImages;
                this.previewImage.activeIndex = index;
            },
            // 添加节目封面图片
            addCover() {
                this.imageUploadDialogVisible = true;
            },
            setPosterImage(index) {
                this.coverImage = this.specPosterImages[index];
            },
            // 关闭上传图片对话框
            closeImageDialog(status) {
                this.imageUploadDialogVisible = status;
            },
            // 添加封面图片
            addPosterImage(newPosterImage) {
                for (let i = 0; i < this.posterImageList.length; i++) {
                    if (newPosterImage.posterImage.id === this.posterImageList[i].id) {
                        this.$message('该图片已经添加到当前节目封面中');
                        return;
                    }
                }
                let imageList = this.posterImageList.slice();
                imageList.push(newPosterImage.posterImage);
                // 更新当前专题中的封面图片
                this.$service.updateSubjectBasicInfo({
                    id: this.currentSubject.id,
                    posterImageList: imageList
                }).then(response => {
                    if (response && response.code === 0) {
                        this.posterImageList.push(newPosterImage.posterImage);
                    }
                });
            },
            // 保存信息
            saveSubject() {
                if (!this.currentSubject.id) {
                    this.$message({
                        message: '请选择专题',
                        type: 'warning'
                    });
                    return;
                } else if (!this.coverImage.id) {
                    this.$message({
                        message: '请选择封面图片',
                        type: 'warning'
                    });
                    return;
                }
                // 组建推荐节目对象，保存到store中
                let subject = {
                    coverImage: this.coverImage,
                    id: this.currentSubject.id,
                    name: this.currentSubject.name,
                    layoutItemType: 'SUBJECT'
                };
                this.$store.commit('layout/setSingleRecommendItem', {
                    navBarId: this.$route.params.navBarId,
                    navBarSignCode: this.$route.params.navBarSignCode,
                    model: this.$route.params.model,
                    row: this.$route.params.row,
                    index: this.$route.params.index,
                    item: subject
                });
                this.$message({
                    message: '设置推荐专题成功',
                    type: 'success'
                });
            }
        }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>

    h3 {
        margin-top: 30px;
        margin-bottom: 30px;
        font-size: 18px;
    }

    ul.cover-list {
        display: flex;
        margin-top: 30px;
        justify-content: left;
        flex-wrap: wrap;
        li {
            display: flex;
            margin-right: 30px;
            flex-direction: column;
            justify-content: space-around;
            height: 230px;
            img {
                display: block;
                max-height: 180px;
                max-width: 400px;
                cursor: zoom-in;
            }
            .el-radio {
                font-size: 16px;
            }
        }
    }

    .add-box {
        margin-bottom: 50px;
    }

</style>
