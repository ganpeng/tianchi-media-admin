<!-- 节目类型管理组件 -->
<template>
    <div class="program-type-container">
        <el-breadcrumb class="gp-breadcrumb" separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>内容管理</el-breadcrumb-item>
            <el-breadcrumb-item>节目资源管理</el-breadcrumb-item>
            <el-breadcrumb-item>节目类别管理</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="category-container">
            <div class="source">
                <div role="tablist" aria-multiselectable="true" class="el-collapse">
                    <div
                        @mouseover="mouseoverHandler(index)"
                        @mouseout="mouseoutHandler(null)"
                        v-for="(category, index) in global.categoryList" :key="index" class="el-collapse-item">
                        <div role="tab" aria-controls="el-collapse-content-3171" style="position:relative;" aria-describedby="el-collapse-content-3171">
                            <div role="button" class="el-collapse-item__header">
                                <span>{{category.name}}</span>
                                <i class="el-collapse-item__arrow el-icon-arrow-right"></i>
                            </div>
                        </div>
                        <div v-show="index === currentIndex" :style="{minHeight: (global.categoryList.length * 48) + 'px'}" class="item-content text-left">
                            <div class="add-header">
                                <el-button @click="append(category)" type="text">
                                    <i class="el-icon-plus"></i>添加
                                </el-button>
                            </div>
                            <el-tag
                                v-for="(type, index) in category.programmeTypeList"
                                :key="index"
                                closable
                                class="tag-btn"
                                type="info"
                                :disable-transitions="false"
                                @close="remove(category.id, type.id)">
                                {{type.name}}
                            </el-tag>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <el-col :span="24">
            <el-button class="save-btn" type="primary" @click="_updateProgrammeCategory">保存</el-button>
        </el-col>
    </div>
</template>
<script>
import {mapActions, mapGetters, mapMutations} from 'vuex';

    export default {
        data() {
        return {
            showTypeList: false,
            currentIndex: null,
            defaultProps: {
                children: 'programmeTypeList',
                label: 'name'
            }
        };
    },
    created() {
        this.getProgrammeCategory();
    },
    computed: {
        ...mapGetters({
            global: 'programme/global',
            programmeCategoryExist: 'programme/programmeCategoryExist'
        })
    },
    methods: {
        ...mapMutations({
            deleteProgrammeCategory: 'programme/deleteProgrammeCategory',
            addProgrammeCategory: 'programme/addProgrammeCategory'
        }),
        ...mapActions({
            getProgrammeCategory: 'programme/getProgrammeCategory',
            updateProgrammeCategory: 'programme/updateProgrammeCategory',
            getProgrammeTypeCount: 'programme/getProgrammeTypeCount'
        }),
        mouseoverHandler(index) {
            this.currentIndex = index;
        },
        mouseoutHandler(index) {
            // this.currentIndex = null;
        },
        _updateProgrammeCategory() {
            this.updateProgrammeCategory()
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
                    if (this.programmeCategoryExist({data, value})) {
                        return `新类型${value}已经存在`;
                    } else {
                        return true;
                    }
                },
                inputErrorMessage: '类型不能为空'
            }).then(({ value }) => {
                this.addProgrammeCategory({name: value, data});
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
      remove(parentId, childrenId) {
        this.$confirm('此操作将永久删除该节目类型, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'error'
        }).then(() => {
            this.getProgrammeTypeCount(childrenId)
                .then((noCount) => {
                    if (noCount) {
                        this.deleteProgrammeCategory({parentId, childrenId});
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                    } else {
                        this.$message({
                            type: 'error',
                            message: '该类型下面有节目，不能删除!'
                        });
                    }
                });
        }).catch(() => {
            this.$message({
                type: 'info',
                message: '已取消删除'
            });
        });
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
<style lang="less" scoped>
.el-collapse {
    position: relative;
    width: 240px;
    .el-collapse-item {
        .edit-btn {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            right: 50px;
        }
        .item-content {
            position: absolute;
            top: 0;
            left: 260px;
            width: 600px;
            background-color: #fff;
            z-index: 20;
            padding: 0 20px;
            .add-header {
                border-bottom: 1px solid #ebeef5;
            }
            .tag-btn {
                margin: 20px 10px 0 0;
            }
        }
    }
}
.save-btn {
    margin-top: 20px;
}
</style>
