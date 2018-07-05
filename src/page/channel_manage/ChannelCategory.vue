<!-- 频道类别管理组件 -->
<template>
    <div class="program-type-container">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>内容管理</el-breadcrumb-item>
            <el-breadcrumb-item>频道管理</el-breadcrumb-item>
            <el-breadcrumb-item>频道类别管理</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="block type-tree">
            <el-col :span="8">
                <el-tree
                    :data="serializeChannelTypeList"
                    node-key="id"
                    :props="defaultProps"
                    default-expand-all
                    :expand-on-click-node="false"
                    :render-content="renderContent">
                </el-tree>
            </el-col>
        </div>
        <el-col :span="24">
            <el-button type="primary" @click="_putChannelType">保存</el-button>
        </el-col>
    </div>
</template>
<script>
import {mapActions, mapGetters, mapMutations} from 'vuex';

    export default {
        data() {
        return {
            defaultProps: {
                children: 'list',
                label: 'name'
            }
        };
    },
    created() {
        this.getChannelType();
    },
    computed: {
        ...mapGetters({
            serializeChannelTypeList: 'channel/serializeChannelTypeList',
            channelTypeList: 'channel/channelTypeList'
        })
    },
    methods: {
        ...mapMutations({
            addChannelCategory: 'channel/addChannelCategory',
            deleteChannelCategory: 'channel/deleteChannelCategory'
        }),
        ...mapActions({
            getChannelType: 'channel/getChannelType',
            getChannelCount: 'channel/getChannelCount',
            putChannelType: 'channel/putChannelType'
        }),
        _putChannelType() {
            this.putChannelType()
                .then(() => {
                    this.$message({
                        type: 'success',
                        message: '节目类型保存成功'
                    });
                });
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
        remove(node, data) {
            this.$confirm('此操作将永久删除该节目类型, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'error'
            }).then(() => {
                if (/^category_/.test(data.id)) {
                    this.deleteChannelCategory({node, data});
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                } else {
                    this.getChannelCount(data.id)
                        .then((noCount) => {
                            if (noCount) {
                                this.deleteChannelCategory({node, data});
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
        },
        renderContent(h, { node, data, store }) {
            return (
            <span class="custom-tree-node">
                <span>{node.label}</span>
                {
                    node.level === 1
                    ? <span>
                        <el-button size="mini" type="text" icon="el-icon-plus" on-click={ () => this.append(data, node) }></el-button>
                    </span>
                    : <span>
                        <el-button size="mini" type="text" icon="el-icon-minus" on-click={ () => this.remove(node, data) }></el-button>
                    </span>
                }
            </span>);
        }
    }
  };
</script>
