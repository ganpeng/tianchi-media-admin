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
                        <label>{{scope.row.description}}</label>
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
            <li @click="toAddPosterImage">
                <i class="el-icon-plus"></i>
            </li>
        </ul>
        <el-button v-if="mode === 'EDIT'" type="success" @click="switchMode">更换专题</el-button>
        <el-button type="success" @click="saveSubject">保 存</el-button>
        <preview-multiple-images
            :previewMultipleImages="previewImage">
        </preview-multiple-images>
    </div>
</template>

<script>
    import SelectSingleSubject from './SelectSingleSubject';
    import PreviewMultipleImages from 'sysComponents/custom_components/global/PreviewMultipleImages';
    import {LAYOUT_IMAGE_DIMENSION} from '@/util/config/dimension';

    export default {
        name: 'SingleAppendSubject',
        components: {
            SelectSingleSubject,
            PreviewMultipleImages
        },
        data() {
            return {
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
                return this.posterImageList.filter(image => parseInt(image.width) === this.imageSpec.width && parseInt(image.height) === this.imageSpec.height);
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
            // 到本专题的编辑基本信息页面，添加专题封面
            toAddPosterImage() {
                if (!this.currentSubject.id) {
                    this.$message({
                        message: '请选择专题',
                        type: 'warning'
                    });
                } else {
                    this.$confirm('此操作将跳转页面,不会保存当前数据 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.$router.push({
                            name: this.currentSubject.category === 'PROGRAMME' ? 'EditProgrammeSubject' : 'EditPersonSubject',
                            params: {id: this.currentSubject.id}
                        });
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消跳转'
                        });
                    });
                }
            },
            setPosterImage(index) {
                this.coverImage = this.specPosterImages[index];
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
            &:last-child {
                display: flex;
                justify-content: center;
                flex-direction: column;
                width: 180px;
                height: 180px;
                border: 1px dotted gray;
                text-align: center;
                cursor: pointer;
                i {
                    display: inline;
                    position: static;
                    color: gray;
                }
                &:hover {
                    border: 1px dotted #409EFF;
                    i {
                        color: #409EFF;
                    }
                }
            }
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

</style>
