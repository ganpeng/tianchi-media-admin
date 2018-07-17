<!--内容管理-栏目管理-以table表格的形式展示一个节目-->
<template>
    <el-table
        :data="singleProgrammeList"
        border
        style="width: 100%">
        <el-table-column
            prop="code"
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
            label="图片">
            <template slot-scope="scope">
                <img :src="scope.row.coverImage ? scope.row.coverImage.uri : '' | imageUrl"
                     :alt="scope.row.coverImage.name"
                     v-if="scope.row.coverImage">
                <label v-else>------</label>
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
            prop="featureVideoCount"
            label="正片数量">
        </el-table-column>
        <el-table-column
            prop="extraVideoCount"
            label="相关视频数量">
        </el-table-column>
        <el-table-column
            prop="announceAt"
            label="上映时间">
            <template slot-scope="scope">
                {{scope.row.announceAt | formatDate('yyyy-MM-DD')}}
            </template>
        </el-table-column>
        <el-table-column
            prop="releaseArea"
            label="地区">
        </el-table-column>
        <el-table-column
            label="分类">
            <template slot-scope="scope">
                {{scope.row.categoryList | jsonJoin('name')}}
            </template>
        </el-table-column>
        <el-table-column
            prop="typeList"
            label="类型">
            <template slot-scope="scope">
                {{scope.row.typeList | jsonJoin('name')}}
            </template>
        </el-table-column>
        <el-table-column
            label="主演">
            <template slot-scope="scope">
                <label>{{scope.row.figureListMap | displayFigures('CHIEF_ACTOR')}}</label>
            </template>
        </el-table-column>
        <el-table-column
            label="导演">
            <template slot-scope="scope">
                <label>{{scope.row.figureListMap | displayFigures('DIRECTOR')}}</label>
            </template>
        </el-table-column>
        <el-table-column
            prop="visible"
            label="状态">
            <template slot-scope="scope">
                {{scope.row.visible ? '已上架' :'已下架'}}
            </template>
        </el-table-column>
        <el-table-column
            label="更新时间">
            <template slot-scope="scope">
                {{scope.row.updatedAt | formatDate('yyyy-MM-DD')}}
            </template>
        </el-table-column>
    </el-table>
</template>

<script>

    export default {
        name: 'SingleProgrammeTable',
        props: {
            singleProgrammeList: {
                type: Array,
                default: function () {
                    return [];
                }
            }
        },
        data() {
            return {};
        }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>

    .el-table {
        img {
            width: 120px;
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
