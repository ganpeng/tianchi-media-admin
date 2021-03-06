<!-- 频道类别管理组件 -->
<template>
    <div class="channel-type-container">
        <custom-breadcrumb
            v-bind:breadcrumbList="[
            {name:'频道管理'},
            {name:'频道类别管理'}]">
        </custom-breadcrumb>
        <div class="category-container">
            <div class="source">
                <div role="tablist" aria-multiselectable="true" class="gan-el-collapse">
                    <div
                        @mouseover="mouseoverHandler(index)"
                        v-for="(channel, index) in serializeChannelTypeList" :key="index" class="el-collapse-item">
                        <div role="tab" aria-controls="el-collapse-content-3171" style="position:relative;" aria-describedby="el-collapse-content-3171">
                            <div role="button" class="el-collapse-item__header">
                                <span :class="{'category-name': true, 'text-primary': index === currentIndex}">{{channel.name}}</span>
                                <i class="el-collapse-item__arrow el-icon-arrow-right"></i>
                            </div>
                        </div>
                        <div v-show="index === currentIndex" :style="{minHeight: (serializeChannelTypeList.length * 48) + 'px'}" class="item-content text-left">
                            <div class="add-header">
                                <el-button
                                    @click="append(channel)"
                                    type="text">
                                    <i class="el-icon-plus"></i>添加
                                </el-button>
                            </div>
                            <div :id="`sort-list-${index}`">
                                <el-tag
                                    v-for="(item, index) in channelList(index)"
                                    :key="index"
                                    :data-channel="JSON.stringify(item)"
                                    closable
                                    class="tag-btn"
                                    type="info"
                                    :disable-transitions="false"
                                    @close="remove(item)">
                                    {{item.name}}
                                </el-tag>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <el-col :span="24">
            <el-button class="page-main-btn save-btn" type="primary" @click="_putChannelType">保存</el-button>
        </el-col>
    </div>
</template>
<script>
import {mapActions, mapGetters, mapMutations} from 'vuex';
export default {
    data() {
        return {
            currentIndex: null,
            drake: null
        };
    },
    created() {
        this.resetProgramme();
        this.getChannelType()
            .then(() => {
                this.initDragula();
            });
    },
    computed: {
        ...mapGetters({
            serializeChannelTypeList: 'channel/serializeChannelTypeList',
            channelTypeList: 'channel/channelTypeList',
            channelState: 'channel/channelState'
        }),
        channelList() {
            return (index) => {
                if (index === 1) {
                    return this.channelState.carouselChannelTypeList;
                } else {
                    return this.channelState.liveChannelTypeList;
                }
            };
        }
    },
    methods: {
        ...mapMutations({
            addChannelCategory: 'channel/addChannelCategory',
            resetProgramme: 'programme/resetProgramme',
            deleteChannelCategory: 'channel/deleteChannelCategory',
            setChannelTypeList: 'channel/setChannelTypeList'
        }),
        ...mapActions({
            getChannelType: 'channel/getChannelType',
            getChannelCount: 'channel/getChannelCount',
            putChannelType: 'channel/putChannelType'
        }),
        initDragula() {
            this.$nextTick(function () {
                let eleList = [];
                for (let i = 0; i < this.serializeChannelTypeList.length; i++) {
                    let id = `sort-list-${i}`;
                    let ele = document.getElementById(id);
                    eleList.push(ele);
                }
                this.drake = this.$dragula(eleList, {
                    direction: 'horizontal'
                });
            });
        },
        mouseoverHandler(index) {
            this.currentIndex = index;
        },
        _putChannelType() {
            let list = this.serializeSortedChannelTypeList();
            this.putChannelType(list)
                .then(() => {
                    this.$message({
                        type: 'success',
                        message: '节目类型保存成功'
                    });
                });
        },
        serializeSortedChannelTypeList() {
            let len = this.serializeChannelTypeList.length;
            let sortedChannelTypeList = [];
            for (let i = 0; i < len; i++) {
                let id = `sort-list-${i}`;
                let ele = document.getElementById(id);
                let eleList = ele.querySelectorAll('.el-tag--info');
                let list = [];
                for (let j = 0; j < eleList.length; j++) {
                    let channel = JSON.parse(eleList[j].getAttribute('data-channel'));
                    channel.sort = j;
                    list.push(channel);
                }
                sortedChannelTypeList = sortedChannelTypeList.concat(list);
            }
            return sortedChannelTypeList;
        },
        append(data) {
            this.$prompt('请输入新类型', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPattern: /\S/,
                inputValidator: (value) => {
                    if (this.checkExist(data, value)) {
                        return '类型已经存在';
                    } else {
                        return true;
                    }
                },
                inputErrorMessage: '类型不能为空'
            }).then(({ value }) => {
                this.addChannelCategory({name: value, data});
                this.$message({
                    type: 'success',
                    message: `新类型${value}创建成功`
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '取消输入'
                });
            });
        },
        remove(data) {
            this.$confirm('此操作将永久删除该节目类型, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'error'
            }).then(() => {
                if (/^category_/.test(data.id)) {
                    this.deleteChannelCategory({data});
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                } else {
                    this.getChannelCount(data.id)
                        .then((noCount) => {
                            if (noCount) {
                                this.deleteChannelCategory({data});
                                this.$message({
                                    type: 'success',
                                    message: '删除成功!'
                                });
                            } else {
                                this.$message({
                                    type: 'error',
                                    message: '该类型下面有频道，不能删除!'
                                });
                            }
                        });
                }
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        checkExist(data, value) {
            let {category} = data;
            let isExist = this.channelTypeList.filter((type) => type.category === category)
                                .find((type) => type.name === value);
            if (isExist) {
                return true;
            } else {
                return false;
            }
        }
    }
  };
</script>
<style lang="less" scoped>
.save-btn {
    position:absolute;
    bottom: 164px;
    left: 50%;
    transform: translateX(-50%);
}
.tag-btn {
    cursor: pointer;
}
</style>
