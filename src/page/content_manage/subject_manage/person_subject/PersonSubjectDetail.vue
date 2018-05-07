<!--人物专题详情组件-->
<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>内容管理</el-breadcrumb-item>
            <el-breadcrumb-item>专题管理</el-breadcrumb-item>
            <el-breadcrumb-item>人物专题详情</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="block-box text-left">
            <subject-basic-info-detail
                status="1">
            </subject-basic-info-detail>
            <label class="list-title">专题内人物列表:</label>
            <el-table
                :data="personList"
                border
                style="width: 100%">
                <el-table-column
                    width="80px"
                    prop="id"
                    label="编号">
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="名称">
                </el-table-column>
                <el-table-column
                    label="图片">
                    <template slot-scope="scope">
                        <img :src="scope.row.url" @click="displayImage(scope.row)" alt="人物图片">
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
                    prop="area"
                    label="地区">
                </el-table-column>
                <el-table-column
                    label="更新时间">
                    <template slot-scope="scope">
                        {{scope.row.updatedAt | formatDate('yyyy-MM-DD')}}
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="operate-list">
            <el-button type="primary" @click="editBasicInfo">编辑基本信息</el-button>
            <el-button type="primary">编辑节目</el-button>
            <el-button type="danger" @click="removeSubject">删 除</el-button>
        </div>
        <preview-single-image :previewSingleImage="previewImage"></preview-single-image>
    </div>
</template>

<script>
    import SubjectBasicInfoDetail from '../SubjectBasicInfoDetail';
    import PreviewSingleImage from 'sysComponents/custom_components/global/PreviewSingleImage';

    export default {
        name: 'PersonSubjectDetail',
        components: {
            SubjectBasicInfoDetail,
            PreviewSingleImage
        },
        data() {
            return {
                previewImage: {
                    title: '',
                    display: false,
                    url: ''
                },
                personList: [
                    {
                        id: 1,
                        name: '胡歌',
                        url: 'https://tse1-mm.cn.bing.net/th?id=OIP.zn7At_hL_CSW6MsoVrzGuAHaEo&w=300&h=187&c=7&o=5&pid=1.7',
                        description: '十二年前七万赤焰军被奸人所害导致全军覆没，冤死梅岭，只剩少帅林殊（张哲瀚 饰）侥幸生还。十二年后林殊改头换面化身“麒麟才子”梅长苏（胡歌 饰），建立江左盟，以“琅琊榜”第一才子的身份重返帝都。梅长苏背负血海深仇，暗中帮助昔日挚友靖王（王凯 饰）周旋于太子（高鑫 饰）与誉王（黄维德 饰）的斗争之中，同时又遇到了昔日未婚妻——云南王郡主穆霓凰（刘涛 饰）却不能相见。梅长苏以病弱之躯为昭雪冤案、为振兴河山，踏上了一条黑暗又惊心动魄的夺嫡之路。',
                        area: '中国大陆',
                        updatedAt: 1402233166999
                    },
                    {
                        id: 2,
                        name: '胡歌',
                        url: 'https://tse1-mm.cn.bing.net/th?id=OIP.zn7At_hL_CSW6MsoVrzGuAHaEo&w=300&h=187&c=7&o=5&pid=1.7',
                        description: '十二年前七万赤焰军被奸人所害导致全军覆没，冤死梅岭，只剩少帅林殊（张哲瀚 饰）侥幸生还。十二年后林殊改头换面化身“麒麟才子”梅长苏（胡歌 饰），建立江左盟，以“琅琊榜”第一才子的身份重返帝都。梅长苏背负血海深仇，暗中帮助昔日挚友靖王（王凯 饰）周旋于太子（高鑫 饰）与誉王（黄维德 饰）的斗争之中，同时又遇到了昔日未婚妻——云南王郡主穆霓凰（刘涛 饰）却不能相见。梅长苏以病弱之躯为昭雪冤案、为振兴河山，踏上了一条黑暗又惊心动魄的夺嫡之路。',
                        area: '中国大陆',
                        updatedAt: 1402233166999
                    },
                    {
                        id: 3,
                        name: '胡歌',
                        url: 'https://tse1-mm.cn.bing.net/th?id=OIP.zn7At_hL_CSW6MsoVrzGuAHaEo&w=300&h=187&c=7&o=5&pid=1.7',
                        description: '十二年前七万赤焰军被奸人所害导致全军覆没，冤死梅岭，只剩少帅林殊（张哲瀚 饰）侥幸生还。十二年后林殊改头换面化身“麒麟才子”梅长苏（胡歌 饰），建立江左盟，以“琅琊榜”第一才子的身份重返帝都。梅长苏背负血海深仇，暗中帮助昔日挚友靖王（王凯 饰）周旋于太子（高鑫 饰）与誉王（黄维德 饰）的斗争之中，同时又遇到了昔日未婚妻——云南王郡主穆霓凰（刘涛 饰）却不能相见。梅长苏以病弱之躯为昭雪冤案、为振兴河山，踏上了一条黑暗又惊心动魄的夺嫡之路。',
                        area: '中国大陆',
                        updatedAt: 1402233166999
                    },
                    {
                        id: 4,
                        name: '胡歌',
                        url: 'https://tse1-mm.cn.bing.net/th?id=OIP.zn7At_hL_CSW6MsoVrzGuAHaEo&w=300&h=187&c=7&o=5&pid=1.7',
                        description: '十二年前七万赤焰军被奸人所害导致全军覆没，冤死梅岭，只剩少帅林殊（张哲瀚 饰）侥幸生还。十二年后林殊改头换面化身“麒麟才子”梅长苏（胡歌 饰），建立江左盟，以“琅琊榜”第一才子的身份重返帝都。梅长苏背负血海深仇，暗中帮助昔日挚友靖王（王凯 饰）周旋于太子（高鑫 饰）与誉王（黄维德 饰）的斗争之中，同时又遇到了昔日未婚妻——云南王郡主穆霓凰（刘涛 饰）却不能相见。梅长苏以病弱之躯为昭雪冤案、为振兴河山，踏上了一条黑暗又惊心动魄的夺嫡之路。',
                        area: '中国大陆',
                        updatedAt: 1402233166999
                    }
                ]
            };
        },
        methods: {
            // 放大预览图片
            displayImage(image) {
                this.previewImage.title = image.name;
                this.previewImage.display = true;
                this.previewImage.url = image.url;
            },
            // 删除当前专题，并跳转专题列表页面
            removeSubject() {
                this.$confirm('此操作将删除当前专题, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    this.$router.push({name: 'SubjectList'});
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            // 编辑当前专题基本信息
            editBasicInfo() {
                this.$router.push({
                    name: 'EditPersonSubject', params: this.$route.params
                });
            }
        }
    };
</script>

<style lang="less" scoped>

    .block-box {
        margin-top: 50px;
    }

    .list-title {
        margin-left: 20px;
    }

    .el-table {
        margin-top: 20px;
        margin-bottom: 40px;
        img {
            width: 120px;
            cursor: zoom-in;
        }
        label {
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
            -ms-text-overflow: ellipsis;
            text-overflow: ellipsis;
        }
        .more {
            float: right;
        }
    }

    .operate-list {
        .el-button {
            margin-right: 30px;
            width: 124px;
        }
    }
</style>
