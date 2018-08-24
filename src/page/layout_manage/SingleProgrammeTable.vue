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
            label="编号">
            <template slot-scope="scope">
                <label>{{scope.row.code}}</label>
            </template>
        </el-table-column>
        <el-table-column
            align="center"
            width="126px"
            prop="name"
            label="名称">
        </el-table-column>
        <el-table-column
            align="center"
            width="120px"
            label="图片">
            <template slot-scope="scope">
                <img :src="scope.row.coverImage ? scope.row.coverImage.uri : '' | imageUrl"
                     :alt="scope.row.coverImage.name"
                     v-if="scope.row.coverImage">
                <label v-else>------</label>
            </template>
        </el-table-column>
        <el-table-column
            align="center"
            width="88px"
            prop="featureVideoCount"
            label="正片数量">
        </el-table-column>
        <el-table-column
            width="128px"
            align="center"
            prop="announceAt"
            label="上映时间">
            <template slot-scope="scope">
                <label v-if="scope.row.announceAt">{{scope.row.announceAt | formatDate('yyyy-MM-DD')}}</label>
                <label v-else>------</label>
            </template>
        </el-table-column>
        <el-table-column
            width="200px"
            align="center"
            prop="produceAreaList"
            label="地区">
            <template slot-scope="scope">
                {{scope.row.produceAreaList.length !== 0 ? areaLabel(scope.row.produceAreaList) : '------'}}
            </template>
        </el-table-column>
        <el-table-column
            width="140px"
            align="center"
            label="分类">
            <template slot-scope="scope">
                {{scope.row.categoryList | jsonJoin('name')}}
            </template>
        </el-table-column>
        <el-table-column
            prop="typeList"
            align="center"
            label="类型">
            <template slot-scope="scope">
                {{scope.row.typeList | jsonJoin('name')}}
            </template>
        </el-table-column>
        <el-table-column
            align="center"
            label="主演">
            <template slot-scope="scope">
                <label>{{scope.row.figureListMap | displayFigures('CHIEF_ACTOR')}}</label>
            </template>
        </el-table-column>
        <el-table-column
            align="center"
            prop="visible"
            label="状态">
            <template slot-scope="scope">
                {{scope.row.visible ? '已上架' :'已下架'}}
            </template>
        </el-table-column>
        <el-table-column
            align="center"
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
            width: 100px;
            height: 145px;
        }
    }

</style>
