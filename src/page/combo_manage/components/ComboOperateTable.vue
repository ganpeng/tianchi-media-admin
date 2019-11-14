<!--套餐列表项组件-->
<template>
    <div>
        <el-table
            :data="comboList"
            border
            style="width: 100%">
            <el-table-column
                align="center"
                prop="id"
                width="120px"
                label="编号">
            </el-table-column>
            <el-table-column
                align="center"
                prop="name"
                min-width="220px"
                label="名称">
                <template slot-scope="scope">
                <span @click="toComboDetail(scope.row)" class="ellipsis four name">
                    {{scope.row.name}}
                </span>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                prop="price"
                min-width="220px"
                label="金额">
                <template slot-scope="scope">
                    {{scope.row.price / 100}}
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                prop="validityDays"
                min-width="220px"
                label="时长">
                <template slot-scope="scope">
                    {{scope.row.validityDays | getDisplayValidityDays}}
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                min-width="140px"
                label="更新时间">
                <template slot-scope="scope">
                    <div>{{scope.row.createdAt | formatDate('yyyy-MM-DD')}}</div>
                    <div>{{scope.row.createdAt | formatDate('HH:mm:SS')}}</div>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                min-width="140px"
                label="创建时间">
                <template slot-scope="scope">
                    <div>{{scope.row.createdAt | formatDate('yyyy-MM-DD')}}</div>
                    <div>{{scope.row.createdAt | formatDate('HH:mm:SS')}}</div>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                min-width="140px"
                label="状态">
                <template slot-scope="scope">
                    <input
                        class="my-switch switch-anim"
                        type="checkbox"
                        v-model="scope.row.visible"
                        :checked="scope.row.visible"
                        @click.prevent="updateComboStatus(scope.row)"/>
                    <i v-if="scope.row.visible" class="on-the-shelf">已上架</i>
                    <i v-else class="off-the-shelf">已下架</i>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="操作"
                width="110px">
                <template slot-scope="scope">
                    <div class="operator-btn-wrapper">
                        <span class="btn-text" @click="editCombo(scope.row)">编辑</span>
                    </div>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>

    export default {
        name: 'ComboOperateTable',
        props: {
            comboList: {
                type: Array,
                default: function () {
                    return [];
                }
            }
        },
        data() {
            return {};
        },
        filters: {
            getDisplayValidityDays(day) {
                switch (day) {
                    case 30:
                        return '一个月（30天）';
                    case 90:
                        return '三个月（90天）';
                    case 180:
                        return '六个月（180天）';
                    case 365:
                        return '一年（365天）';
                    default:
                        return '';
                }
            }
        },
        methods: {
            updateComboStatus(item) {
                if (!this.$authority.isHasAuthority('user:membershipScheme:visible')) {
                    return;
                }
                this.$confirm('此操作将' + (item.visible ? '下架' : '上架') + item.name + '套餐, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$service.setComboVisible({id: item.id, visible: !item.visible}).then(response => {
                        if (response && response.code === 0) {
                            this.$message.success('"' + item.name + '"套餐' + (item.visible ? '下架成功' : '上架成功'));
                            item.visible = !item.visible;
                        }
                    });
                });
            },
            // 查看详情
            toComboDetail(item) {
                if (!this.$authority.isHasAuthority('user:membershipScheme:get')) {
                    return;
                }
                this.$router.push({
                    name: 'ComboDetail',
                    params: {id: item.id}
                });
            },
            editCombo(item) {
                if (!this.$authority.isHasAuthority('user:membershipScheme:put')) {
                    return;
                }
                this.$router.push({
                    name: 'EditCombo',
                    params: {id: item.id}
                });
            }
        }
    };
</script>

<style lang="scss" scoped>

    .operator-btn-wrapper {
        span {
            margin-left: 0px;
        }
    }

</style>
