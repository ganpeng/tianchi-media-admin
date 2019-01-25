<!--选择多个直播频道组件-->
<template>
    <div>
        <live-channel-filter-params
            v-on:getChannelList="getChannelList">
        </live-channel-filter-params>
        <el-table
            :data="channelList"
            ref="selectChannel"
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
            <el-table-column prop="code" align="center" width="120px" label="直播频道编号"></el-table-column>
            <el-table-column prop="no" align="center" width="140px" label="直播频道展示编号"></el-table-column>
            <el-table-column prop="innerName" align="center" width="120px" label="直播频道名称">
                <template slot-scope="scope">
                    <span class="ellipsis two">
                        {{scope.row.innerName}}
                    </span>
                </template>
            </el-table-column>
            <el-table-column prop="name" align="center" width="120px" label="直播频道展示名">
                <template slot-scope="scope">
                    <span class="ellipsis two">
                        {{scope.row.name}}
                    </span>
                </template>
            </el-table-column>
            <el-table-column prop="type" width="120px" align="center" label="频道类别">
                <template slot-scope="scope">
                    <span class="ellipsis two">
                        {{scope.row.typeList | getTypeName}}
                    </span>
                </template>
            </el-table-column>
            <el-table-column prop="multicastIp" width="150px" align="center" label="频道IP"></el-table-column>
            <el-table-column prop="multicastPort" width="100px" align="center" label="频道端口"></el-table-column>
            <el-table-column prop="pushServer" align="center" label="所属服务器"></el-table-column>
            <el-table-column align="center" label="是否录制回看">
                <template slot-scope="scope">
                    {{scope.row.record ? '是' : '否'}}
                </template>
            </el-table-column>
            <el-table-column prop="videoPid" align="center" label="videoPid">
                <template slot-scope="scope">
                    {{scope.row.videoPid | padEmpty}}
                </template>
            </el-table-column>
            <el-table-column prop="audioPid" align="center" label="audioPid">
                <template slot-scope="scope">
                    {{scope.row.audioPid | padEmpty}}
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
        <el-button
            type="primary"
            class="btn-style-two"
            @click="appendChannel"
            size="small">
            添加
        </el-button>
    </div>
</template>

<script>
    import LiveChannelFilterParams from '../../search_filter_params/LiveChannelFilterParams';

    export default {
        name: 'SelectMultipleLiveChannel',
        components: {
            LiveChannelFilterParams
        },
        // 当前外部选中的直播频道列表
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
        filters: {
            getTypeName: function (typeList) {
                let name = '';
                typeList.map(type => {
                    name = '、' + name + type.name;
                });
                return name.slice(1);
            }
        },
        mounted() {
        },
        methods: {
            init() {
                // 下架状态的直播频道可以被选为产品包中
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
                this.listQueryParams.category = 'LIVE';
                this.$service.getChannelList(this.listQueryParams).then(response => {
                    if (response && response.code === 0) {
                        this.channelList = response.data.list;
                        this.total = response.data.total;
                        // 对于选择的多选项项进行勾选
                        for (let i = 0; i < this.multipleSelection.length; i++) {
                            for (let k = 0; k < this.channelList.length; k++) {
                                if (this.multipleSelection[i].id === this.channelList[k].id) {
                                    this.$nextTick(function () {
                                        this.$refs.selectChannel.toggleRowSelection(this.channelList[k], true);
                                    });
                                }
                            }
                        }
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
            // 添加直播频道
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
                // 判断是添加还是删除所有当前list
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
        margin-bottom: 10px;
    }

</style>
