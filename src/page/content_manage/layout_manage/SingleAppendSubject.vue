<!--内容管理-栏目管理-单个推荐位选择专题-->
<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>内容管理</el-breadcrumb-item>
            <el-breadcrumb-item>栏目管理</el-breadcrumb-item>
            <el-breadcrumb-item>单个推荐位选择专题</el-breadcrumb-item>
        </el-breadcrumb>
        <h3 class="text-left">请选择要推荐的专题：</h3>
        <select-single-subject
            v-on:setSubject="setSubject">
        </select-single-subject>
        <h3 class="text-left">请选择专题的封面海报：</h3>
        <ul>
            <li v-for="(item,index) in posterImageList" :key="index">
                <img :src="item.uri" :alt="item.name" @click="displayImage(index)">
                <el-radio v-model="programmeImage" :label="item.id" @change="setPosterImage(index)">{{item.name}}
                </el-radio>
            </li>
            <li @click="toAddPosterImage">
                <i class="el-icon-plus"></i>
            </li>
        </ul>
        <el-button type="success" @click="saveSubject">保 存</el-button>
        <preview-multiple-images
            :previewMultipleImages="previewImage">
        </preview-multiple-images>
    </div>
</template>

<script>
    import SelectSingleSubject from './SelectSingleSubject';
    import PreviewMultipleImages from 'sysComponents/custom_components/global/PreviewMultipleImages';

    export default {
        name: 'SingleAppendSubject',
        components: {
            SelectSingleSubject,
            PreviewMultipleImages
        },
        data() {
            return {
                currentSubject: {},
                posterImageList: [],
                programmeImage: '',
                coverImage: {},
                previewImage: {
                    display: false,
                    autoplay: false,
                    activeIndex: 0,
                    list: []
                }
            };
        },
        methods: {
            // 选择某一个专题
            setSubject(item) {
                this.currentSubject = item;
                this.posterImageList = item.posterImageList;
                this.coverImage = {};
                this.programmeImage = '';
            },
            // 放大预览图片
            displayImage(index) {
                this.previewImage.display = true;
                this.previewImage.list = this.posterImageList;
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
                    this.$router.push({
                        name: this.currentSubject.category === 'PROGRAMME' ? 'EditProgrammeSubject' : 'EditPersonSubject',
                        params: {id: this.currentSubject.id}
                    });
                }
            },
            setPosterImage(index) {
                this.coverImage = this.posterImageList[index];
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
                    itemType: 'SUBJECT'
                };
                this.$store.dispatch('todayRecommend/setRecommendItem', {
                    row: this.$route.params.row,
                    index: this.$route.params.index,
                    item: subject
                }).then(response => {
                    if (response === 'success') {
                        this.$message({
                            message: '设置推荐专题成功',
                            type: 'success'
                        });
                        this.$store.dispatch('todayRecommend/setTodayRecommendCache');
                    } else {
                        this.$message({
                            message: '设置推荐专题失败',
                            type: 'warning'
                        });
                    }
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

    ul {
        display: flex;
        margin-top: 30px;
        justify-content: left;
        li {
            display: flex;
            margin-right: 30px;
            flex-direction: column;
            justify-content: space-around;
            height: 230px;
            &:last-child {
                justify-content: center;
                width: 180px;
                height: 180px;
                border: 1px dotted gray;
                text-align: center;
                cursor: pointer;
                &:hover {
                    border: 1px dotted #409EFF;
                    i {
                        color: #409EFF;
                    }
                }
            }
            img {
                display: block;
                height: 180px;
                cursor: zoom-in;
            }
            .el-radio {
                font-size: 16px;
            }
        }
    }

</style>
