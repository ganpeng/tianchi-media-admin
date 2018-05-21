<!-- 节目类型管理组件 -->
<template>
    <div class="program-type-container">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>内容管理</el-breadcrumb-item>
            <el-breadcrumb-item>节目资源管理</el-breadcrumb-item>
            <el-breadcrumb-item>节目类别管理</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="block type-tree">
            <el-col :span="8">
                <el-tree
                    :data="treeData"
                    node-key="id"
                    default-expand-all
                    :expand-on-click-node="false"
                    :render-content="renderContent">
                </el-tree>
            </el-col>
        </div>
        <el-button type="primary" @click="_updateProgrammeCategory">保存</el-button>
    </div>
</template>
<script>
import {mapActions} from 'vuex';
let id = 1000;

  export default {
    data() {
      const data = [{
        id: 1,
        level: 1,
        label: '电影',
        children: [
            {
                id: 4,
                label: '惊悚'
            },
            {
                id: 24,
                label: '动作'
            },
            {
                id: 34,
                label: '爱情'
            }
        ]
      }, {
        id: 2,
        level: 1,
        label: '电视剧',
        children: [{
          id: 5,
          label: '二级 2-1'
        }, {
          id: 6,
          label: '二级 2-2'
        }]
      }, {
        id: 3,
        level: 1,
        label: '综艺',
        children: [{
          id: 7,
          label: '二级 3-1'
        }, {
          id: 8,
          label: '二级 3-2'
        }]
      }];
      return {
        treeData: JSON.parse(JSON.stringify(data))
      };
    },
    created() {
        this.getProgrammeCategory();
    },
    methods: {
        ...mapActions({
            getProgrammeCategory: 'programme/getProgrammeCategory',
            updateProgrammeCategory: 'programme/updateProgrammeCategory'
        }),
        _updateProgrammeCategory() {
            let categoryObj = [
                {
                    name: '电影',
                    visible: true,
                    programmeTypeList: []
                },
                {
                    name: '电视剧',
                    visible: true,
                    programmeTypeList: []
                },
                {
                    name: '综艺',
                    visible: true,
                    programmeTypeList: []
                }
            ];

            this.updateProgrammeCategory(categoryObj)
                .then((res) => {
                });
        },
        append(data) {
            this.$prompt('请输入新类型', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            }).then(({ value }) => {
                const newChild = { id: id++, label: value, children: [] };
                if (!data.children) {
                    this.$set(data, 'children', []);
                }
                data.children.push(newChild);
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
            const parent = node.parent;
            const children = parent.data.children || parent.data;
            const index = children.findIndex(d => d.id === data.id);
            children.splice(index, 1);
            this.$message({
                type: 'success',
                message: '删除成功!'
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
                    <el-button size="mini" type="text" icon="el-icon-plus" on-click={ () => this.append(data) }></el-button>
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

<style>
    .type-tree {
        margin-top: 32px;
    }
    .custom-tree-node {
        display: flex;
        padding-right: 8px;
        flex: 1;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
    }
    .custom-tree-node span {
        font-size: 18px;
    }
</style>
