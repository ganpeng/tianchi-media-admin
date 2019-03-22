<!--直播频道列表组件-->
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
                        placeholder="全部"
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
                        placeholder="全部"
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
                <div class="search-field-item">
                    <label class="search-field-item-label">状态</label>
                    <el-select
                        :value="searchFields.visible"
                        @change="inputHandler($event, 'visible')"
                        clearable
                        placeholder="全部">
                        <el-option
                            v-for="item in visibleOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <el-button class="btn-style-one" type="primary" @click="clearSearchFields">
                    <svg-icon icon-class="reset"></svg-icon>
                    重置
                </el-button>
                <span
                    @click="toggleSearchField"
                    :class="['el-dropdown-link', searchFieldVisible ? 'active' : '']">
                    更多筛选<i v-if="searchFieldVisible" class="el-icon-arrow-up el-icon--right my-arrow-icon"></i><i v-else class="el-icon-arrow-down el-icon--right my-arrow-icon"></i>
                </span>
            </div>
            <div v-show="searchFieldVisible" class="field-row">
                <div class="search-field-item">
                    <label class="search-field-item-label">公共频道</label>
                    <el-select
                        :value="searchFields.common"
                        clearable
                        placeholder="全部"
                        @input="inputHandler($event, 'common')"
                    >
                        <el-option
                            v-for="(item, index) in [{name: '是', value: true}, {name: '否', value: false}]"
                            :key="index"
                            :label="item.name"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <div class="search-field-item">
                    <label class="search-field-item-label">区域</label>
                    <el-select
                        :value="searchFields.companyCode"
                        clearable
                        placeholder="全部"
                        @input="inputHandler($event, 'companyCode')"
                    >
                        <el-option
                            v-for="(item, index) in companyOptions"
                            :key="index"
                            :label="item.name"
                            :value="item.code">
                        </el-option>
                    </el-select>
                </div>
                <div id="multi-selecter" class="search-field-item">
                    <label class="search-field-item-label">推流方式</label>
                    <el-select
                        :value="searchFields.protocolList"
                        @change="inputHandler($event, 'protocolList')"
                        clearable
                        multiple
                        placeholder="全部">
                        <el-option
                            v-for="item in [{name: 'HLS', value: 'HLS'}, {name: 'UDP', value: 'UDP'}]"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </div>
            </div>
        </div>
        <div class="seperator-line"></div>
        <div class="tabel-field">
            <h2 class="content-title">频道列表</h2>
            <div class="table-operator-field clearfix">
                <div class="float-left">
                    <div v-show="isDisabled" class="my-disabled-dropdown">
                        批量操作
                        <i class="el-icon-arrow-down"></i>
                    </div>
                    <el-dropdown
                        trigger="click"
                        v-show="!isDisabled"
                        class="my-dropdown">
                        <span class="el-dropdown-link">
                            批量操作<i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item>
                                <span @click="multUpFrameChannelHandler">批量恢复</span>
                            </el-dropdown-item>
                            <el-dropdown-item>
                                <span @click="multLowerFrameChannelHandler">批量禁播</span>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
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
            <el-table
                @select="selectHandler"
                @select-all="selectAllHandler"
                header-row-class-name="common-table-header" class="my-table-style" :data="list" border>
                <el-table-column type="selection" align="center"></el-table-column>
                <el-table-column prop="no" align="center" width="60px" label="台号"></el-table-column>
                <el-table-column prop="innerName" align="center" min-width="120px" label="名称">
                    <template slot-scope="scope">
                        <span @click="displayLiveChannel(scope.row.id)" class="ellipsis two name">
                            {{scope.row.innerName}}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="name" align="center" min-width="120px" label="展示名">
                    <template slot-scope="scope">
                        <span @click="displayLiveChannel(scope.row.id)" class="ellipsis two name">
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
                <el-table-column prop="serverGroup" align="center" min-width="120px" label="服务器组"></el-table-column>
                <el-table-column align="center" width="60px" label="回看">
                    <template slot-scope="scope">
                        <span :class="[scope.row.record ? 'yes' : 'no']">
                            {{scope.row.record ? '是' : '否'}}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column align="center" width="120px" label="公共频道">
                    <template slot-scope="scope">
                        <span :class="[scope.row.common ? 'yes' : 'no']">
                            {{scope.row.common ? '是' : '否'}}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column align="center" width="120px" label="推流方式">
                    <template slot-scope="scope">
                        {{scope.row.protocolList ? scope.row.protocolList.join(', ') : ''}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="状态">
                    <template slot-scope="scope">
                        <input
                            class="my-switch switch-anim"
                            type="checkbox"
                            :checked="scope.row.visible"
                            @click.prevent="_lowerFrameLiveChannel(scope.row)"/>
                        <i v-if="scope.row.visible" class="on-the-shelf">正常</i>
                        <i v-else class="off-the-shelf">禁播</i>
                    </template>
                </el-table-column>
                <el-table-column width="220px" align="center" label="操作">
                    <template slot-scope="scope">
                        <div id="channel-operator" class="operator-btn-wrapper">
                            <el-dropdown
                                trigger="click"
                                class="my-other-dropdown">
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
                            <span class="btn-text" @click="displayVideoPlayer(scope.row)">直播</span>
                            <span class="btn-text" @click="editLiveChannel(scope.row.id)">编辑</span>
                            <span class="btn-text text-danger" @click="_deleteLiveChannel(scope.row)">删除</span>
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
        <display-video-dialog ref="displayVideoDialog" :url="url" :title="title"></display-video-dialog>
    </div>
</template>
<script>
    import {mapGetters, mapActions, mapMutations} from 'vuex';
    import _ from 'lodash';
    import DisplayVideoDialog from '../../components/custom_components/custom/DisplayVideoDialog';

    const X2JS = require('../../assets/js/xml2json.min'); // eslint-disable-line
    const x2js = new X2JS();
    export default {
        name: 'LiveChannelList',
        components: {
            DisplayVideoDialog
        },
        data() {
            return {
                //  节目单上传变量
                isUploading: false,
                files: [],
                count: 0,
                //  节目单上传变量结束
                url: '',
                title: '',
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
                visibleOptions: [
                    {
                        value: true,
                        label: '正常'
                    },
                    {
                        value: false,
                        label: '禁播'
                    }
                ],
                status: 0,
                searchFieldVisible: false,
                selectedChannelList: []
            };
        },
        created() {
            this.getChannelType();
            this.getChannelList();
            this.getFilialeList();
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
                filialeList: 'channel/filialeList',
                liveChannelTypeList: 'channel/liveChannelTypeList',
                searchFields: 'channel/searchFields'
            }),
            companyOptions() {
                let {common} = this.searchFields;
                if (common) {
                    return [];
                } else {
                    return this.filialeList;
                }
            },
            isDisabled() {
                return this.selectedChannelList.length === 0;
            }
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
                getChannelPageById: 'channel/getChannelPageById',
                getFilialeList: 'channel/getFilialeList'
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
                    this.updatePagination({key: 'pageNum', value: 1});
                    this.getChannelList();
                }
            },
            async _deleteLiveChannel(channel) {
                try {
                    let {id, visible} = channel;
                    if (visible) {
                        this.$message.warning('该频道为正常状态，暂时不能删除');
                        return false;
                    }
                    let confirm = await this.$confirm('此操作将删除该频道, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'error'
                    });
                    if (confirm) {
                        let res = await this.deleteChannelById(id);
                        if (res && res.code === 0) {
                            this.$message.success('删除成功');
                            this.getChannelList();
                        } else {
                            this.$message.error(res.message);
                        }
                    }
                } catch (err) {
                    console.log(err);
                }
            },
            async _lowerFrameLiveChannel(channel) {
                try {
                    let {id, visible} = channel;
                    let message = `${visible ? '禁播' : '恢复'}`;
                    let confirm = await this.$confirm(`此操作将${message}该频道, 是否继续?`, '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'error'
                    });
                    if (confirm) {
                        let res = await this.$service.setChannelVisible(id);
                        if (res && res.code === 0) {
                            this.$message.success(`频道${message}成功`);
                            this.getChannelList();
                        } else {
                            this.$message.error(res.message);
                        }
                    }
                } catch (err) {
                    console.log(err);
                }
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
                this.updatePagination({key: 'pageNum', value: 1});
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
            },
            displayVideoPlayer(channel) {
                let {name, hlsPlayUrl} = channel;
                this.url = hlsPlayUrl;
                this.title = name;
                this.$refs.displayVideoDialog.showDialog();
            },
            displayLiveChannel(id) {
                this.$router.push({name: 'LiveChannelDetail', params: {id}});
            },
            toggleSearchField() {
                this.searchFieldVisible = !this.searchFieldVisible;
            },
            selectHandler(list, row) {
                let isSelected = list.findIndex((item) => item.id === row.id) >= 0;
                if (isSelected) {
                    this.selectedChannelList.push(row);
                } else {
                    this.selectedChannelList = this.selectedChannelList.filter((item) => item.id !== row.id);
                }
            },
            selectAllHandler(list) {
                if (list.length > 0) {
                    this.selectedChannelList = _.uniqBy(this.selectedChannelList.concat(list), 'id');
                } else {
                    this.selectedChannelList = this.selectedChannelList.filter((item) => {
                        let index = this.list.findIndex((programme) => {
                            return programme.id === item.id;
                        });
                        return index < 0;
                    });
                }
            },
            async multUpFrameChannelHandler() {
                let idList = this.selectedChannelList.map((item) => item.id);
                let confirm = await this.$confirm(`您确定要恢复所选频道吗, 是否继续?`, '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'error'
                    });
                if (confirm) {
                    let res = await this.$service.batchSetChannel({idList, visible: true});
                    if (res && res.code === 0) {
                        this.$message.success(`频道批量恢复成功`);
                        this.selectedChannelList = [];
                        this.getChannelList();
                    } else {
                        this.$message.error('批量恢复失败');
                    }
                }
            },
            async multLowerFrameChannelHandler() {
                let idList = this.selectedChannelList.map((item) => item.id);
                let confirm = await this.$confirm(`您确定要禁播所选频道吗, 是否继续?`, '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'error'
                    });
                if (confirm) {
                    let res = await this.$service.batchSetChannel({idList, visible: true});
                    if (res && res.code === 0) {
                        this.$message.success(`频道批量禁播成功`);
                        this.selectedChannelList = [];
                        this.getChannelList();
                    } else {
                        this.$message.error('批量禁播失败');
                    }
                }
            }
        }
    };
</script>
<style scoped lang="scss">
    .my-other-dropdown {
        border: none;
        color: $mainColor;
        width: 70px;
        height: 18px;
        line-height: 18px;
        font-size: 14px;
        background: transparent;
    }
    .yes {
        color: $successColor;
    }

    .no {
        color: $dangerColor;
    }
</style>
<style lang="scss">
#channel-operator {
    .el-dropdown {
        border: none;
        width: 70px;
        height: 18px;
        line-height: 18px;
    }
}
#multi-selecter {
    input {
        height: 34px!important;
    }
}
</style>
