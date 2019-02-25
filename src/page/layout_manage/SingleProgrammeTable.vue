<!--内容管理-栏目管理-以table表格的形式展示一个节目-->
<template>
    <el-table
        :data="singleProgrammeList"
        header-row-class-name="common-table-header"
        row-class-name=programme-row
        border
        style="width: 100%">
        <el-table-column
            align="center"
            width="120px"
            prop="code"
            label="节目编号">
            <template slot-scope="scope">
                <label>{{scope.row.code}}</label>
            </template>
        </el-table-column>
        <el-table-column
            align="center"
            min-width="100px"
            prop="name"
            label="节目名称">
        </el-table-column>
        <el-table-column
            align="center"
            width="100px"
            label="节目图片">
            <template slot-scope="scope">
                <img :src="scope.row.coverImage ? scope.row.coverImage.uri : '' | imageUrl"
                     :alt="scope.row.coverImage.name"
                     v-if="scope.row.coverImage">
                <label v-else>------</label>
            </template>
        </el-table-column>
        <el-table-column
            align="center"
            width="80px"
            prop="featureVideoCount"
            label="正片数量">
        </el-table-column>
        <el-table-column
            width="100px"
            align="center"
            prop="announceAt"
            label="上映时间">
            <template slot-scope="scope">
                <label v-if="scope.row.announceAt">{{scope.row.announceAt | formatDate('yyyy-MM-DD')}}</label>
                <label v-else>------</label>
            </template>
        </el-table-column>
        <el-table-column
            min-width="150px"
            align="center"
            prop="produceAreaList"
            label="地区">
            <template slot-scope="scope">
                {{(scope.row.produceAreaList && scope.row.produceAreaList.length !== 0) ?
                areaLabel(scope.row.produceAreaList) : '------'}}
            </template>
        </el-table-column>
        <el-table-column
            width="100px"
            align="center"
            label="分类">
            <template slot-scope="scope">
                {{scope.row.categoryList | jsonJoin('name')}}
            </template>
        </el-table-column>
        <el-table-column
            prop="typeList"
            align="center"
            min-width="100px"
            label="类型">
            <template slot-scope="scope">
                {{scope.row.typeList | jsonJoin('name')}}
            </template>
        </el-table-column>
        <el-table-column
            align="center"
            min-width="100px"
            label="演员">
            <template slot-scope="scope">
                <label>{{scope.row.figureListMap | displayFigures('ACTOR')}}</label>
            </template>
        </el-table-column>
        <el-table-column
            align="center"
            prop="visible"
            min-width="100px"
            label="状态">
            <template slot-scope="scope">
                {{scope.row.visible ? '已上架' :'已下架'}}
            </template>
        </el-table-column>
        <el-table-column
            align="center"
            min-width="100px"
            label="更新时间">
            <template slot-scope="scope">
                {{scope.row.updatedAt | formatDate('yyyy-MM-DD')}}
            </template>
        </el-table-column>
    </el-table>
</template>

<script>
    import store from 'store';

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
        },
        methods: {
            areaLabel(areaList) {
                return areaList.reduce((res, curr) => {
                    let area = store.get('areaList').find((item) => item.code === curr);
                    return area ? `${res}, ${area.name}` : res;
                }, '').replace(/^,/, '');
            }
        }
    };
</script>

<style lang="less" scoped>

    .el-table {
        img {
            width: 70px;
            height: auto;
        }
    }

</style>
