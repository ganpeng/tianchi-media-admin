<!--选择多个节目组件-->
<template>
    <div>
        <el-form :inline="true" class="demo-form-inline search-form">
            <el-form-item label="上映时间">
                <el-date-picker
                    v-model="releasedValue"
                    type="year"
                    placeholder="请选择上映时间">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="制片地区">
                <el-select v-model="areaValue" placeholder="请选择制片地区">
                    <el-option
                        v-for="item in areaOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="分类">
                <el-select v-model="categoryValue" placeholder="请选择分类">
                    <el-option
                        v-for="item in categoryOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="类型">
                <el-select v-model="typeValue" placeholder="请选择类型">
                    <el-option
                        v-for="item in typeOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="状态">
                <el-select v-model="statusValue" placeholder="请选择节目状态">
                    <el-option
                        v-for="item in statusOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item class="search">
                <el-input v-model="searchContent" placeholder="请输入关键字">
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                </el-input>
            </el-form-item>
        </el-form>
        <el-table
            :data="programmeList"
            border
            style="width: 100%"
            @selection-change="handleSelectionChange">
            <el-table-column
                type="selection"
                width="55">
            </el-table-column>
            <el-table-column
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
                    <img :src="scope.row.url" @click="displayImage(scope.row)" alt="节目图片">
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
                prop="feature"
                label="正片数量">
            </el-table-column>
            <el-table-column
                prop="relative"
                label="相关视频数量">
            </el-table-column>
            <el-table-column
                prop="released"
                label="上映时间">
            </el-table-column>
            <el-table-column
                prop="area"
                label="地区">
            </el-table-column>
            <el-table-column
                prop="category"
                label="分类">
            </el-table-column>
            <el-table-column
                prop="type"
                label="类型">
            </el-table-column>
            <el-table-column
                prop="actor"
                label="主演">
            </el-table-column>
            <el-table-column
                prop="director"
                label="导演">
            </el-table-column>
            <el-table-column
                prop="status"
                label="状态">
            </el-table-column>
            <el-table-column
                label="更新时间">
                <template slot-scope="scope">
                    {{scope.row.updatedAt | formatDate('yyyy-MM-DD')}}
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 30, 50]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalAmount">
        </el-pagination>
        <el-button type="success" @click="appendProgramme" size="small">添加所选节目</el-button>
        <preview-single-image :previewSingleImage="previewImage"></preview-single-image>
    </div>
</template>

<script>
    import PreviewSingleImage from 'sysComponents/custom_components/global/PreviewSingleImage';

    export default {
        name: 'SelectMultipleProgramme',
        components: {
            PreviewSingleImage
        },
        data() {
            return {
                previewImage: {
                    title: '',
                    display: false,
                    url: ''
                },
                releasedValue: '',
                areaOptions: [{
                    value: '1',
                    label: '大陆'
                }, {
                    value: '2',
                    label: '台湾'
                }, {
                    value: '3',
                    label: '香港'
                }, {
                    value: '4',
                    label: '海外'
                }],
                areaValue: '',
                categoryOptions: [{
                    value: '1',
                    label: '电视剧'
                }, {
                    value: '2',
                    label: '电影'
                }, {
                    value: '3',
                    label: '娱乐'
                }],
                categoryValue: '',
                typeOptions: [{
                    value: '1',
                    label: '爱情'
                }, {
                    value: '2',
                    label: '都市'
                }, {
                    value: '3',
                    label: '悬疑'
                }],
                typeValue: '',
                statusOptions: [{
                    value: '1',
                    label: '已上架'
                }, {
                    value: '2',
                    label: '未上架'
                }, {
                    value: '3',
                    label: '已下架'
                }],
                statusValue: '',
                searchContent: '',
                currentPage: 1,
                pageSize: 10,
                totalAmount: 0,
                programmeList: [
                    {
                        id: 1,
                        name: '琅琊榜',
                        url: 'https://tse1-mm.cn.bing.net/th?id=OIP.zn7At_hL_CSW6MsoVrzGuAHaEo&w=300&h=187&c=7&o=5&pid=1.7',
                        description: '十二年前七万赤焰军被奸人所害导致全军覆没，冤死梅岭，只剩少帅林殊（张哲瀚 饰）侥幸生还。十二年后林殊改头换面化身“麒麟才子”梅长苏（胡歌 饰），建立江左盟，以“琅琊榜”第一才子的身份重返帝都。梅长苏背负血海深仇，暗中帮助昔日挚友靖王（王凯 饰）周旋于太子（高鑫 饰）与誉王（黄维德 饰）的斗争之中，同时又遇到了昔日未婚妻——云南王郡主穆霓凰（刘涛 饰）却不能相见。梅长苏以病弱之躯为昭雪冤案、为振兴河山，踏上了一条黑暗又惊心动魄的夺嫡之路。',
                        feature: '54',
                        relative: '23',
                        released: '1462243166999',
                        area: '中国大陆',
                        category: '电视剧',
                        type: '剧情/古装',
                        actor: ['胡歌', '刘涛', '王凯', '陈龙'],
                        director: ['孔笙', '李雪'],
                        status: 'NORMAL',
                        updatedAt: 1402233166999
                    },
                    {
                        id: 2,
                        name: '琅琊榜',
                        url: 'https://tse1-mm.cn.bing.net/th?id=OIP.zn7At_hL_CSW6MsoVrzGuAHaEo&w=300&h=187&c=7&o=5&pid=1.7',
                        description: '十二年前七万赤焰军被奸人所害导致全军覆没，冤死梅岭，只剩少帅林殊（张哲瀚 饰）侥幸生还。十二年后林殊改头换面化身“麒麟才子”梅长苏（胡歌 饰），建立江左盟，以“琅琊榜”第一才子的身份重返帝都。梅长苏背负血海深仇，暗中帮助昔日挚友靖王（王凯 饰）周旋于太子（高鑫 饰）与誉王（黄维德 饰）的斗争之中，同时又遇到了昔日未婚妻——云南王郡主穆霓凰（刘涛 饰）却不能相见。梅长苏以病弱之躯为昭雪冤案、为振兴河山，踏上了一条黑暗又惊心动魄的夺嫡之路。',
                        feature: '54',
                        relative: '23',
                        released: '1462243166999',
                        area: '中国大陆',
                        category: '电视剧',
                        type: '剧情/古装',
                        actor: ['胡歌', '刘涛', '王凯', '陈龙'],
                        director: ['孔笙', '李雪'],
                        status: 'NORMAL',
                        updatedAt: 1402233166999
                    },
                    {
                        id: 3,
                        name: '琅琊榜',
                        url: 'https://tse1-mm.cn.bing.net/th?id=OIP.zn7At_hL_CSW6MsoVrzGuAHaEo&w=300&h=187&c=7&o=5&pid=1.7',
                        description: '十二年前七万赤焰军被奸人所害导致全军覆没，冤死梅岭，只剩少帅林殊（张哲瀚 饰）侥幸生还。十二年后林殊改头换面化身“麒麟才子”梅长苏（胡歌 饰），建立江左盟，以“琅琊榜”第一才子的身份重返帝都。梅长苏背负血海深仇，暗中帮助昔日挚友靖王（王凯 饰）周旋于太子（高鑫 饰）与誉王（黄维德 饰）的斗争之中，同时又遇到了昔日未婚妻——云南王郡主穆霓凰（刘涛 饰）却不能相见。梅长苏以病弱之躯为昭雪冤案、为振兴河山，踏上了一条黑暗又惊心动魄的夺嫡之路。',
                        feature: '54',
                        relative: '23',
                        released: '1462243166999',
                        area: '中国大陆',
                        category: '电视剧',
                        type: '剧情/古装',
                        actor: ['胡歌', '刘涛', '王凯', '陈龙'],
                        director: ['孔笙', '李雪'],
                        status: 'NORMAL',
                        updatedAt: 1402233166999
                    },
                    {
                        id: 4,
                        name: '琅琊榜',
                        url: 'https://tse1-mm.cn.bing.net/th?id=OIP.zn7At_hL_CSW6MsoVrzGuAHaEo&w=300&h=187&c=7&o=5&pid=1.7',
                        description: '十二年前七万赤焰军被奸人所害导致全军覆没，冤死梅岭，只剩少帅林殊（张哲瀚 饰）侥幸生还。十二年后林殊改头换面化身“麒麟才子”梅长苏（胡歌 饰），建立江左盟，以“琅琊榜”第一才子的身份重返帝都。梅长苏背负血海深仇，暗中帮助昔日挚友靖王（王凯 饰）周旋于太子（高鑫 饰）与誉王（黄维德 饰）的斗争之中，同时又遇到了昔日未婚妻——云南王郡主穆霓凰（刘涛 饰）却不能相见。梅长苏以病弱之躯为昭雪冤案、为振兴河山，踏上了一条黑暗又惊心动魄的夺嫡之路。',
                        feature: '54',
                        relative: '23',
                        released: '1462243166999',
                        area: '中国大陆',
                        category: '电视剧',
                        type: '剧情/古装',
                        actor: ['胡歌', '刘涛', '王凯', '陈龙'],
                        director: ['孔笙', '李雪'],
                        status: 'NORMAL',
                        updatedAt: 1402233166999
                    }
                ],
                multipleSelection: []
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                this.totalAmount = this.programmeList.length;
            },
            handleSizeChange(pageSize) {
                this.pageSize = pageSize;
            },
            handleCurrentChange(currentPage) {
                this.currentPage = currentPage;
            },
            // 添加节目
            appendProgramme() {
                this.$emit('setProgramme', this.multipleSelection);
            },
            // 放大预览图片
            displayImage(image) {
                this.previewImage.title = image.name;
                this.previewImage.display = true;
                this.previewImage.url = image.url;
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            }
        }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>

    .el-form {
        margin-left: 20px;
        text-align: left;
        &.search-form {
            margin-top: 60px;
            .search {
                margin-left: 50px;
                margin-right: 30px;
            }
        }
    }

    .el-table {
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

</style>
