<!--产品管理-节目包-展示节目列表（包含操作）-->
<template>
    <el-table
        :data="programmeList"
        header-row-class-name="common-table-header"
        row-class-name=programme-row
        border
        style="width: 100%">
        <el-table-column
            align="center"
            width="60px"
            prop="code"
            label="序号">
            <template slot-scope="scope">
                <label>{{scope.$index + 1}}</label>
            </template>
        </el-table-column>
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
                <label>{{scope.row.figureListMap | displayFigures('CHIEF_ACTOR')}}</label>
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
        <el-table-column
            v-if="model === 'ORIGIN'"
            align="center"
            prop="visible"
            min-width="100px"
            label="关联状况">
            <template slot-scope="scope">
                <span v-if="scope.row.removed" class="removed">已移除</span>
                <span v-else class="linked">已关联</span>
            </template>
        </el-table-column>
        <el-table-column
            v-if="!!model"
            align="center"
            label="操作"
            class="operate">
            <template slot-scope="scope">
                <el-button type="text" size="small" class="remove-btn"
                           v-if="(model==='ORIGIN' || model==='ADDED') && !scope.row.removed"
                           @click="removeProgramme(scope.$index)">
                    取消关联
                </el-button>
                <el-button type="text" size="small" class="recover-btn"
                           v-if="model==='REMOVED'  || (model==='ORIGIN' && scope.row.removed)"
                           @click="recoverProgramme(scope.$index)">
                    恢复关联
                </el-button>
            </template>
        </el-table-column>
    </el-table>
</template>

<script>
    import store from 'store';

    export default {
        name: 'ProgrammeProductOperateTable',
        props: {
            programmeList: {
                type: Array,
                default: function () {
                    return [];
                }
            },
            // 三种类型，线上数据列表：'ORIGIN',新增列表：'ADDED',线上列表中删除的列表：'REMOVED'
            model: {
                type: String,
                default: ''
            }
        },
        data() {
            return {};
        },
        methods: {
            // 取消关联
            removeProgramme(index) {
                switch (this.model) {
                    case 'ORIGIN':
                        // 如果是线上列表取消关联，设置进入'REMOVE'列表
                        let originRemovedRow = this.programmeList[index];
                        originRemovedRow.removed = true;
                        this.programmeList.splice(index, 1, originRemovedRow);
                        this.$emit('removeSelectRow', 'ORIGIN', originRemovedRow);
                        break;
                    case 'ADDED':
                        // 编辑中新增的节目列表取消关联,删除数据，通知更新节目查询列表
                        let addRemovedRow = this.programmeList.splice(index, 1)[0];
                        this.$emit('removeSelectRow', 'ADDED', addRemovedRow);
                        break;
                    default:
                        break;
                }
            },
            // 恢复关联
            recoverProgramme(index) {
                switch (this.model) {
                    case 'ORIGIN':
                        // 线上列表恢复关联，'REMOVE'列表中去除该节目，写入总的关联节目列表
                        let originAddRow = this.programmeList[index];
                        originAddRow.removed = false;
                        this.programmeList.splice(index, 1, originAddRow);
                        this.$emit('recoverSelectRow', 'ORIGIN', originAddRow);
                        break;
                    case 'REMOVED':
                        // 线上列表节目取消关联之后，重现恢复关联。写入总的关联节目列表，'ORIGIN'节目列表恢复关联，'REMOVED'列表去除，勾选源数据
                        this.$emit('recoverSelectRow', 'REMOVED', this.programmeList[index]);
                        break;
                    default:
                        break;
                }
            },
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
        .removed {
            color: #F56C6C;
        }
        .linked {
            color: #67C23A;
        }
    }

</style>
