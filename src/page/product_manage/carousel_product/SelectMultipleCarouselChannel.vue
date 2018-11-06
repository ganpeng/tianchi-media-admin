<!--选择多个轮播频道组件-->
<template>
    <div>
        <channel-filter-params
            v-on:getChannelList="getChannelList">
        </channel-filter-params>
        <el-table
            :data="channelList"
            header-row-class-name="common-table-header"
            row-class-name=channel-row
            @select-all="selectAll"
            @select="selectRow"
            border
            style="width: 100%">
            <el-table-column
                type="selection"
                align="center"
                width="55">
            </el-table-column>
            <el-table-column
                prop="no"
                width="80px"
                align="center"
                label="编号">
            </el-table-column>
            <el-table-column
                prop="innerName"
                width="200px"
                align="center"
                label="名称">
            </el-table-column>
            <el-table-column
                align="center"
                width="120px"
                label="类别">
                <template slot-scope="scope">
                    <label>{{scope.row.typeList | jsonJoin('name')}}</label>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                prop="multicastIp"
                label="组播地址">
            </el-table-column>
            <el-table-column
                align="center"
                width="80px"
                prop="multicastPort"
                label="端口号">
            </el-table-column>
            <!--tsId-->
            <el-table-column
                align="center"
                prop="tsId"
                label="tsId">
                <template slot-scope="scope">
                    <label>{{scope.row.tsId ? scope.row.tsId : '------'}}</label>
                </template>
            </el-table-column>
            <!--serviceId-->
            <el-table-column
                align="center"
                prop="serviceId"
                label="serviceId">
                <template slot-scope="scope">
                    <label>{{scope.row.serviceId ? scope.row.serviceId : '------'}}</label>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                prop="pushServer"
                label="所属服务器">
                <template slot-scope="scope">
                    <label>{{scope.row.pushServer ? scope.row.pushServer : '------'}}</label>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                width="80px"
                label="状态">
                <template slot-scope="scope">
                    <i class="status-normal" v-if="scope.row.visible">正常</i>
                    <i class="status-abnormal" v-else>禁播</i>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageNum"
            :page-sizes="[10, 20, 50, 100, 200, 500]"
            :page-size="listQueryParams.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
        <el-button type="primary" plain class="apppend-Channel" @click="appendChannel" size="small">添加所选轮播频道
        </el-button>
    </div>
</template>

<script>
    import ChannelFilterParams from '../../search_filter_params/ChannelFilterParams';

    export default {
        name: 'SelectMultipleChannel',
        components: {
            ChannelFilterParams
        },
        // 当前外部选中的轮播频道列表
        props: ['selectedChannelList'],
        data() {
            return {
                listQueryParams: {
                    pageNum: 0,
                    pageSize: 10
                },
                pageNum: 1,
                total: 0,
                channelList: [],
                multipleSelection: []
            };
        },
        mounted() {
        },
        methods: {
            init() {
                // 下架状态的轮播频道可以被选为产品包中
                // 初始化选中的项
                for (let i = 0; i < this.selectedChannelList.length; i++) {
                    this.multipleSelection.push(this.selectedChannelList[i]);
                }
                this.getChannelList();
            },
            getChannelList(searchParams) {
                // 设置请求参数
                if (searchParams) {
                    for (let key in searchParams) {
                        this.listQueryParams[key] = searchParams[key];
                    }
                }
                this.listQueryParams.pageNum = this.pageNum - 1;
                this.listQueryParams.category = 'CAROUSEL';
                this.$service.getChannelList(this.listQueryParams).then(response => {
                    if (response && response.code === 0) {
                        this.channelList = response.data.list;
                        this.total = response.data.total;
                        this.multipleSelection = [];
                    }
                });
            },
            handleSizeChange(pageSize) {
                this.listQueryParams.pageSize = pageSize;
                this.getChannelList();
            },
            handleCurrentChange(pageNum) {
                this.pageNum = pageNum;
                this.getChannelList();
            },
            // 添加轮播频道
            appendChannel() {
                this.$emit('setChannel', this.multipleSelection);
            },
            // 多选的模式中选择或取消某一行
            selectRow(selection, row) {
                // 判断当前行为，选择或者取消
                let checkStatus;
                for (let i = 0; i < selection.length; i++) {
                    if (selection[i].id === row.id) {
                        checkStatus = true;
                    }
                }
                if (checkStatus) {
                    for (let k = 0; k < this.multipleSelection.length; k++) {
                        if (this.multipleSelection[k].id === row.id) {
                            return;
                        }
                    }
                    this.multipleSelection.push(row);
                } else {
                    for (let n = 0; n < this.multipleSelection.length; n++) {
                        if (this.multipleSelection[n].id === row.id) {
                            this.multipleSelection.splice(n, 1);
                        }
                    }
                }
            },
            selectAll(selections) {
                // 判断是添加还是删除所有当前channelList
                // 取消全选
                if (selections.length === 0) {
                    for (let i = 0; i < this.channelList.length; i++) {
                        for (let k = 0; k < this.multipleSelection.length; k++) {
                            if (this.channelList[i].id === this.multipleSelection[k].id) {
                                this.multipleSelection.splice(k, 1);
                            }
                        }
                    }
                    // 全选添加
                } else {
                    for (let i = 0; i < this.channelList.length; i++) {
                        let tag = false;
                        // 去掉当前已选择的
                        for (let k = 0; k < this.multipleSelection.length; k++) {
                            if (this.channelList[i].id === this.multipleSelection[k].id) {
                                tag = true;
                            }
                        }
                        // 去掉原先已选择的
                        for (let m = 0; m < this.multipleSelection.length; m++) {
                            if (this.channelList[i].id === this.multipleSelection[m].id) {
                                tag = true;
                            }
                        }
                        if (tag === false) {
                            this.multipleSelection.push(this.channelList[i]);
                        }
                    }
                }
            },
            cancelSelectRow(row) {
                for (let i = 0; i < this.multipleSelection.length; i++) {
                    if (row.id === this.multipleSelection[i].id) {
                        this.multipleSelection.splice(i, 1);
                    }
                }
                for (let i = 0; i < this.channelList.length; i++) {
                    if (row.id === this.channelList[i].id) {
                        this.$refs.selectChannel.toggleRowSelection(this.channelList[i], false);
                    }
                }
            }
        }
    };
</script>

<style lang="scss" scoped>

    .el-table {
        margin-top: 0px;
        img {
            width: 70px;
            height: auto;
        }
    }

    .apppend-Channel {
        margin-top: 30px;
    }
</style>
