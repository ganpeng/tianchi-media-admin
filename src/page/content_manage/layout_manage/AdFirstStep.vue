<!--内容管理-栏目管理-广告选择第一步组件-->
<template>
    <div>
        <el-form :inline="true" class="demo-form-inline search-form">
            <el-form-item label="类型">
                <el-select v-model="typeValue" placeholder="请选择素材类型">
                    <el-option
                        v-for="item in typeOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="尺寸">
                <el-select v-model="sizeValue" placeholder="请选择素材尺寸">
                    <el-option
                        v-for="item in sizeOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item class="search">
                <el-input v-model="searchContent" placeholder="请填写素材名称">
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                </el-input>
            </el-form-item>
        </el-form>
        <el-table
            :data="adMaterialList"
            border
            style="width: 100%">
            <el-table-column
                prop="name"
                label="素材名称">
            </el-table-column>
            <el-table-column
                align="center"
                label="预览">
                <template slot-scope="scope">
                    <img :src="scope.row.resource" v-if="scope.row.type !== 'mp4'">
                    <template v-else>
                        <video src="~assets/swf/test.mp4">您的浏览器不支持 video 标签</video>
                        <i class="el-icon-caret-right play" @click="preview"></i>
                    </template>
                </template>
            </el-table-column>
            <el-table-column
                prop="type"
                label="格式">
            </el-table-column>
            <el-table-column
                label="宽*高（px）">
                <template slot-scope="scope">
                    {{scope.row.width}}*{{scope.row.height}}
                </template>
            </el-table-column>
            <el-table-column
                prop="size"
                label="大小">
            </el-table-column>
            <el-table-column
                label="创建日期">
                <template slot-scope="scope">
                    {{scope.row.createdAt | formatDate('yyyy-MM-DD')}}
                </template>
            </el-table-column>
            <el-table-column align="center"
                             fixed="right"
                             label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="appendAd(scope.row.id)">添加</el-button>
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
        <ul class="preview" id="preview">
            <li v-for="(item,index) in previewAdList" v-bind:key="index">
                <el-tag
                    closable
                    :disable-transitions="false"
                    @close="handleClose">
                    {{item.name}}
                </el-tag>
            </li>
        </ul>
        <!--视频预览-->
        <preview-video
            :previewVideo="previewVideo"
        ></preview-video>
    </div>
</template>

<script>
    import PreviewVideo from 'sysComponents/custom_components/global/PreviewVideo';

    export default {
        name: 'AdFirstStep',
        components: {PreviewVideo},
        data() {
            return {
                previewVideo: {
                    display: false,
                    resource: '',
                    title: '视频预览'
                },
                searchContent: '',
                currentPage: 1,
                pageSize: 10,
                totalAmount: 0,
                adMaterialList: [
                    {
                        id: 1,
                        name: '纳爱斯香皂',
                        type: 'jpg',
                        height: 1232,
                        width: 3432,
                        size: 324,
                        resource: 'http://preview.quanjing.com/age_foto55/u60-1278679.jpg',
                        createdAt: 1402233166999
                    },
                    {
                        id: 2,
                        name: '北国风光',
                        type: 'mp4',
                        height: 1232,
                        width: 3432,
                        size: 324,
                        resource: 'http://i1.sinaimg.cn/gm/2014/1107/U11966P115DT20141107114911.jpg',
                        createdAt: 1402233166999
                    },
                    {
                        id: 3,
                        name: '千里冰封',
                        type: 'png',
                        height: 1232,
                        width: 3432,
                        size: 324,
                        resource: 'http://preview.quanjing.com/age_foto55/u60-1278679.jpg',
                        createdAt: 1402233166999
                    },
                    {
                        id: 4,
                        name: '纳爱斯香皂',
                        type: 'jpg',
                        height: 1232,
                        width: 3432,
                        size: 324,
                        resource: 'http://preview.quanjing.com/age_foto55/u60-1278679.jpg',
                        createdAt: 1402233166999
                    },
                    {
                        id: 5,
                        name: '纳爱斯香皂',
                        type: 'mp4',
                        height: 1232,
                        width: 3432,
                        size: 324,
                        resource: 'http://i1.sinaimg.cn/gm/2014/1107/U11966P115DT20141107114911.jpg',
                        createdAt: 1402233166999
                    }
                ],
                typeOptions: [{
                    value: '1',
                    label: 'jpg'
                }, {
                    value: '2',
                    label: 'mp4'
                }, {
                    value: '3',
                    label: 'png'
                }],
                typeValue: '',
                sizeOptions: [{
                    value: '1',
                    label: '324*346'
                }, {
                    value: '2',
                    label: '324*346'
                }, {
                    value: '3',
                    label: '324*346'
                }],
                sizeValue: '',
                previewAdList: [{
                    id: 3,
                    name: '千里冰封',
                    type: 'png',
                    height: 1232,
                    width: 3432,
                    size: 324,
                    resource: 'http://preview.quanjing.com/age_foto55/u60-1278679.jpg',
                    createdAt: 1402233166999
                },
                    {
                        id: 4,
                        name: '纳爱斯香皂',
                        type: 'jpg',
                        height: 1232,
                        width: 3432,
                        size: 324,
                        resource: 'http://preview.quanjing.com/age_foto55/u60-1278679.jpg',
                        createdAt: 1402233166999
                    }]
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                this.totalAmount = this.adMaterialList.length;
                this.$dragula([document.getElementById('preview')], {
                    direction: 'horizontal'
                });
            },
            handleSizeChange(pageSize) {
                this.pageSize = pageSize;
            },
            handleCurrentChange(currentPage) {
                this.currentPage = currentPage;
            },
            // 视频预览
            preview() {
                this.previewVideo.display = true;
            },
            // 添加素材
            appendAd() {

            },
            // 删除选择的广告
            handleClose() {
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
                margin-right: 30px;
                float: right;
            }
        }
    }

    .el-table {
        img, video {
            width: 120px;
        }
        .cell {
            position: relative;
        }
        .play {
            position: absolute;
            margin: auto;
            top: 0px;
            left: 0px;
            bottom: 0px;
            right: 0px;
            height: 38px;
            width: 38px;
            border-radius: 20px;
            border: 2px solid #13ce66;
            font-size: 36px;
            cursor: pointer;
            &:hover {
                background: green;
                color: white;
            }
        }
    }

    /*预览*/
    .preview {
        display: flex;
        justify-content: flex-start;
        li {
            margin-right: 20px;
            cursor: move;
            cursor: grab;
        }
    }

    /*
     * 设置拖拽效果样式
     */

    .gu-mirror {
        cursor: grabbing;
        cursor: -moz-grabbing;
        cursor: -webkit-grabbing;
        background-color: rgba(0, 0, 0, 0.2);
        transition: opacity 0.4s ease-in-out;
        .el-card {
            height: 100%;
            width: 100%;
            text-align: center;
        }
        .el-switch {
            display: inline-block;
            text-align: center;
        }
    }

    .container > div {
        cursor: move;
        cursor: grab;
        cursor: -moz-grab;
        cursor: -webkit-grab;
    }
</style>
