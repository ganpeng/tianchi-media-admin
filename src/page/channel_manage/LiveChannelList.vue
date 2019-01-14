<!--视频列表组件-->
<template>
    <div class="live-channel-container">
        <div class="table-container">
            <h2 class="content-title">搜索筛选</h2>
        </div>
        <div class="search-field">
            <div class="field-row">
                <div class="search-field-item">
                    <el-input
                        :value="searchFields.keyword"
                        placeholder="请输入频道名称或编号"
                        @input="inputHandler($event, 'keyword')"
                        clearable
                        class="border-input"
                    >
                    </el-input>
                </div>
                <el-button class="btn-style-one" @click="searchHandler" type="primary">
                    <svg-icon icon-class="search"></svg-icon>
                    搜索
                </el-button>
                <div class="search-field-item">
                    <label class="search-field-item-label">类型</label>
                    <el-select
                        :value="searchFields.typeIdList"
                        clearable
                        placeholder="请选择频道类型"
                        @input="inputHandler($event, 'typeIdList')"
                    >
                        <el-option
                            v-for="(item, index) in liveChannelTypeList"
                            :key="index"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </div>
                <div class="search-field-item">
                    <label class="search-field-item-label">
                        回看
                    </label>
                    <el-select
                        :value="searchFields.record"
                        clearable
                        placeholder="请选择是否录制回看"
                        @input="inputHandler($event, 'record')"
                    >
                        <el-option
                            v-for="(item, index) in recordOptinos"
                            :key="index"
                            :label="item.name"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <el-button class="btn-style-one" type="primary" @click="clearSearchFields">
                    <svg-icon icon-class="reset"></svg-icon>
                    重置
                </el-button>
            </div>
        </div>
        <div class="seperator-line"></div>
        <div class="tabel-field">
            <h2 class="content-title">频道列表</h2>
            <div class="table-operator-field clearfix">
                <div class="float-left"></div>
                <div class="float-right">
                    <el-button
                        class="btn-style-two contain-svg-icon"
                        @click="createLiveChannel">
                        <svg-icon icon-class="add"></svg-icon>
                        添加
                    </el-button>
                    <el-button
                        class="btn-style-two contain-svg-icon"
                        @click="createChannelByImportExcel">
                        <svg-icon icon-class="import"></svg-icon>
                        导入
                    </el-button>
                    <el-button
                        class="btn-style-two contain-svg-icon"
                        @click="editChannelByImportExcel">
                        <svg-icon icon-class="edit"></svg-icon>
                        修改
                    </el-button>
                    <el-button
                        class="btn-style-two contain-svg-icon"
                        @click="gotoBlankPage('LiveChannelImport')">
                        <svg-icon icon-class="import_pp"></svg-icon>
                        节目单
                    </el-button>
                </div>
            </div>
            <el-table header-row-class-name="common-table-header" class="my-table-style" :data="list" border>
                <el-table-column prop="code" align="center" width="120px" label="编号"></el-table-column>
                <el-table-column prop="no" align="center" width="120px" label="展示编号"></el-table-column>
                <el-table-column prop="innerName" align="center" min-width="120px" label="名称">
                    <template slot-scope="scope">
                        <span class="ellipsis two">
                            {{scope.row.innerName}}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="name" align="center" min-width="120px" label="展示名">
                    <template slot-scope="scope">
                        <span class="ellipsis two">
                            {{scope.row.name}}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="type" min-width="120px" align="center" label="类别">
                    <template slot-scope="scope">
                        <span class="ellipsis two">
                            {{typeName(scope.row.id)}}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="multicastIp" min-width="120px" align="center" label="IP"></el-table-column>
                <el-table-column prop="multicastPort" width="100px" align="center" label="端口"></el-table-column>
                <el-table-column prop="recordIp" min-width="120px" align="center" label="录制IP"></el-table-column>
                <el-table-column prop="recordPort" width="100px" align="center" label="录制端口"></el-table-column>
                <el-table-column prop="pushServer" align="center" min-width="120px" label="服务器"></el-table-column>
                <el-table-column align="center" width="60px" label="回看">
                    <template slot-scope="scope">
                        <span :class="[scope.row.record ? 'yes' : 'no']">
                            {{scope.row.record ? '是' : '否'}}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="videoPid" align="center" width="100px" label="videoPid">
                    <template slot-scope="scope">
                        {{scope.row.videoPid | padEmpty}}
                    </template>
                </el-table-column>
                <el-table-column prop="audioPid" align="center" width="100px" label="audioPid">
                    <template slot-scope="scope">
                        {{scope.row.audioPid | padEmpty}}
                    </template>
                </el-table-column>
                <el-table-column width="180px" align="center" label="操作">
                    <template slot-scope="scope">
                        <div id="channel-operator" class="operator-btn-wrapper">
                            <el-dropdown
                                trigger="click"
                                class="my-dropdown">
                                <span class="el-dropdown-link">
                                    节目单<i class="el-icon-arrow-down el-icon--right"></i>
                                </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item>
                                        <span @click="previewChannelPage(scope.row.id, scope.row.name, true)">下载</span>
                                    </el-dropdown-item>
                                    <el-dropdown-item>
                                        <span @click="previewChannelPage(scope.row.id)">预览</span>
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                            <span class="btn-text" @click="editLiveChannel(scope.row.id)">编辑</span>
                            <span class="btn-text text-danger" @click="_deleteLiveChannel(scope.row.id)">删除</span>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-pagination
            @size-change="handlePaginationChange($event, 'pageSize')"
            @current-change="handlePaginationChange($event, 'pageNum')"
            :current-page="pagination.pageNum"
            :page-sizes="[10, 20, 50,100, 200, 500]"
            :page-size="pagination.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pagination.total">
        </el-pagination>
    </div>
</template>
<script>
    import {mapGetters, mapActions, mapMutations} from 'vuex';

    const X2JS = require('../../assets/js/xml2json.min'); // eslint-disable-line
    const x2js = new X2JS();
    export default {
        name: 'LiveChannelList',
        data() {
            return {
                //  节目单上传变量
                isUploading: false,
                files: [],
                count: 0,
                //  节目单上传变量结束
                liveChannelDialogVisible: false,
                fileUploadDialogVisible: false,
                fileList: [],
                uploadHeaders: this.$util.getUploadHeaders(this.$store.state.user.token),
                recordOptinos: [
                    {
                        name: '是',
                        value: true
                    },
                    {
                        name: '否',
                        value: false
                    }
                ],
                status: 0
            };
        },
        created() {
            this.getChannelType();
            this.getChannelList();
            window.addEventListener('keyup', this.keyupHandler);
        },
        beforeDestroy() {
            window.removeEventListener('keyup', this.keyupHandler);
        },
        computed: {
            ...mapGetters({
                list: 'channel/list',
                pagination: 'channel/pagination',
                typeName: 'channel/typeName',
                liveChannelTypeList: 'channel/liveChannelTypeList',
                searchFields: 'channel/searchFields'
            })
        },
        methods: {
            ...mapMutations({
                setLiveChannel: 'channel/setLiveChannel',
                updatePagination: 'channel/updatePagination',
                updateSearchFields: 'channel/updateSearchFields',
                resetSearchFields: 'channel/resetSearchFields'
            }),
            ...mapActions({
                getChannelType: 'channel/getChannelType',
                getChannelList: 'channel/getChannelList',
                deleteChannelById: 'channel/deleteChannelById',
                getLiveChannelById: 'channel/getLiveChannelById',
                getChannelPageById: 'channel/getChannelPageById'
            }),
            clearSearchFields() {
                this.resetSearchFields();
                this.getChannelList();
            },
            keyupHandler(e) {
                if (e.keyCode === 13) {
                    this.searchHandler();
                }
            },
            handlePaginationChange(value, key) {
                this.updatePagination({value, key});
                if (key === 'pageSize') {
                    window.localStorage.setItem('channelPageSize', value);
                }
                this.getChannelList();
            },
            editChannelByImportExcel() {
                let routeData = this.$router.resolve({
                    name: 'EditLiveChannelByImportExcel'
                });
                window.open(routeData.href, '_blank');
            },
            previewChannelPage(id, name, flag) {
                this.getChannelPageById(id)
                    .then((res) => {
                        if (res && res.code === 0) {
                            let data = res.data.map((item) => {
                                item.startTime = this.timeStampFormat(item.startTime);
                                item.endTime = this.timeStampFormat(item.endTime);
                                return item;
                            });
                            let xml = x2js.json2xml_str({'频道': {'节目': data}});
                            let blob = new Blob(['<?xml version="1.0" encoding="UTF-8"?>', xml], {type: 'application/xml'});
                            if (flag) {
                                this.openDownloadDialog(blob, `${name}.xml`);
                            } else {
                                if (res.data.length > 0) {
                                    this.$router.push({name: 'PreviewProgrammeList', params: {id}});
                                } else {
                                    this.$message.error('当前频道下没有节目单');
                                    return false;
                                }
                            }
                        }
                    });
            },
            openNewTab(url) {
                if (typeof url === 'object' && url instanceof Blob) {
                    url = URL.createObjectURL(url); // 创建blob地址
                }
                let aLink = document.createElement('a');
                aLink.href = url;
                aLink.target = '_blank';
                let event;
                if (window.MouseEvent) {
                    event = new MouseEvent('click');
                } else {
                    event = document.createEvent('MouseEvents');
                    event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                }
                aLink.dispatchEvent(event);
            },
            openDownloadDialog(url, saveName) {
                if (typeof url === 'object' && url instanceof Blob) {
                    url = URL.createObjectURL(url); // 创建blob地址
                }
                let aLink = document.createElement('a');
                aLink.href = url;
                aLink.download = saveName || ''; // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
                let event;
                if (window.MouseEvent) {
                    event = new MouseEvent('click');
                } else {
                    event = document.createEvent('MouseEvents');
                    event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                }
                aLink.dispatchEvent(event);
            },
            inputHandler(value, key) {
                this.updateSearchFields({key, value});
                if (key !== 'keyword') {
                    this.getChannelList();
                }
            },
            _deleteLiveChannel(id) {
                this.$confirm('此操作将删除该频道, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'error'
                }).then(() => {
                    this.deleteChannelById(id)
                        .then(() => {
                            this.$message({
                                type: 'success',
                                message: '删除成功'
                            });
                            this.getChannelList();
                        });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            createLiveChannel() {
                let routeData = this.$router.resolve({name: 'CreateLiveChannel'});
                window.open(routeData.href, '_blank');
            },
            editLiveChannel(id) {
                this.$router.push({name: 'EditLiveChannel', params: {id}});
            },
            // 批量创建直播频道
            createChannelByImportExcel() {
                let routeData = this.$router.resolve({
                    name: 'CreateChannelByImportExcel',
                    params: {category: 'LIVE'}
                });
                window.open(routeData.href, '_blank');
            },
            searchHandler() {
                this.getChannelList();
            },
            timeStampFormat(seconds) {
                let date = new Date(seconds);
                let year = date.getFullYear();
                let month = date.getMonth() + 1;
                let day = date.getDate();
                let hour = date.getHours();
                let minute = date.getMinutes();
                let second = date.getSeconds();
                return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
            },
            gotoBlankPage(name) {
                let routeData = this.$router.resolve({name});
                window.open(routeData.href, '_blank');
            }
        }
    };
</script>
<style scoped lang="scss">
    .my-dropdown {
        border: none;
        color: $mainColor;
        width: 70px;
        height: 18px;
        line-height: 18px;
        font-size: 14px;
        background: transparent;
    }
    .el-dropdown-link {
        color: $mainColor;
    }

    .yes {
        color: $successColor;
    }

    .no {
        color: $dangerColor;
    }

    .table-wrapper {
        height: 500px;
        overflow-y: scroll;
    }

    .file {
        position: relative;
        display: inline-block;
        background: #409EFF;
        border: 1px solid #409EFF;
        border-radius: 3px;
        font-size: 12px;
        line-height: 34px;
        padding: 0px 15px;
        overflow: hidden;
        color: #fff;
        text-decoration: none;
        text-indent: 0;
    }

    .file input {
        position: absolute;
        font-size: 100px;
        right: 0;
        top: 0;
        width: 80px;
        height: 34px;
        opacity: 0;
        cursor: pointer;
    }
</style>
<style lang="scss">
#channel-operator {
    .my-dropdown {
        border: none;
        width: 70px;
        height: 18px;
        line-height: 18px;
    }
}
</style>
