<!-- 节目类型管理组件 -->
<template>
    <div class="program-type-container">
        <custom-breadcrumb
            v-bind:breadcrumbList="[
            {name:'内容管理'},
            {name:'节目资源管理'},
            {name:'节目类型管理'}]">
        </custom-breadcrumb>
        <div class="category-container">
            <div class="source">
                <div role="tablist" aria-multiselectable="true" class="gan-el-collapse">
                    <div
                        @mouseover="mouseoverHandler(index)"
                        v-for="(category, index) in global.categoryList" :key="index" class="el-collapse-item">
                        <div role="tab" aria-controls="el-collapse-content-3171" style="position:relative;" aria-describedby="el-collapse-content-3171">
                            <div role="button" class="el-collapse-item__header">
                                <span :class="{'category-name': true, 'text-primary': index === currentIndex}">{{category.name}}</span>
                                <i class="el-collapse-item__arrow el-icon-arrow-right"></i>
                            </div>
                        </div>
                        <div v-show="index === currentIndex" :style="{minHeight: (global.categoryList.length * 40) + 'px'}" class="item-content text-left">
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
            <el-button class="page-margin-btn page-main-btn" type="primary" @click="_updateProgrammeCategory">保存</el-button>
        </el-col>
    </div>
</template>
<script>
import {mapActions, mapGetters, mapMutations} from 'vuex';

export default {
    data() {
        return {
            currentIndex: null
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
      }
    }
  };
</script>
<style lang="less" scoped>
</style>
