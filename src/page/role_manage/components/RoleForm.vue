<!--角色表单页面-->
<template>
    <div id="role-page-container">
        <div class="seperator-line"></div>
        <el-form
            ref="roleInfo"
            :model="roleInfo"
            :rules="infoRules"
            status-icon
            label-width="110px"
            class="form-block">
            <el-form-item label="角色名称" prop="name" required>
                <el-input
                    v-model="roleInfo.name"
                    size="medium"
                    clearable
                    placeholder="请填写20个字以内的角色名称">
                </el-input>
            </el-form-item>
            <el-form-item label="管理员" prop="adminList" required>
                <div class="my-tags">
                    <el-tag
                        :key="index"
                        v-for="(item, index) in roleInfo.adminList"
                        closable
                        @close="removeAdmin(item, index)"
                        :disable-transitions="false">
                        {{item.name}}
                    </el-tag>
                </div>
                <el-autocomplete
                    class="inline-input"
                    :fetch-suggestions="querySearch"
                    placeholder="请选择角色包含的管理员"
                    @blur="validateAdminList"
                    @select="setAdmins">
                    <template slot-scope="{ item }">
                        <div class="name">{{ item.name }}</div>
                    </template>
                    <i v-if="roleInfo.adminList.length !== 0"
                       slot="suffix"
                       @click="removeAllAdmin"
                       class="close-btn el-select__caret el-input__icon el-icon-circle-close is-show-close"></i>
                </el-autocomplete>
            </el-form-item>
            <el-form-item label="角色描述" prop="description" required>
                <el-input
                    v-model="roleInfo.description"
                    size="medium"
                    type="textarea"
                    :maxlength="600"
                    :rows="8"
                    placeholder="请填写角色描述，不超过600字">
                </el-input>
                <label class="textarea-tip">已输入{{roleInfo.description ? roleInfo.description.length :
                    '0'}}/600字</label>
            </el-form-item>
            <el-form-item label="状态" prop="visible" required>
                <el-radio-group v-model="roleInfo.visible">
                    <el-radio :label="true">上架</el-radio>
                    <el-radio :label="false">下架</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="权限" prop="authority" required>
                <el-tree
                    :data="data"
                    show-checkbox
                    default-expand-all
                    node-key="id"
                    ref="authorityTree"
                    highlight-current
                    :props="defaultProps">
                </el-tree>
            </el-form-item>
        </el-form>
        <div class="fixed-btn-container">
            <el-button class="btn-style-two" type="primary" @click="saveRoleInfo" :loading="isLoading">保存</el-button>
            <el-button class="btn-style-three" @click="toRoleList" plain>返回列表</el-button>
        </div>
    </div>
</template>

<script>
    import _ from 'lodash';

    export default {
        name: 'RoleForm',
        props: {
            // 创建：'CREATE_ROLE'，编辑：'EDIT_ROLE'
            status: {
                type: String,
                default: function () {
                    return 'CREATE_ROLE';
                }
            }
        },
        data() {
            let checkName = (rule, value, callback) => {
                if (this.$util.isEmpty(value)) {
                    return callback(new Error('角色名称不能为空'));
                } else if (this.$util.trim(value).length > 20) {
                    return callback(new Error('角色名称不能超过20个字'));
                } else {
                    callback();
                }
            };
            let checkDesc = (rule, value, callback) => {
                if (this.$util.isEmpty(value)) {
                    return callback(new Error('请填写角色描述'));
                } else if (this.$util.trim(value).length > 600) {
                    return callback(new Error('角色描述不能超过600字'));
                } else {
                    callback();
                }
            };
            let checkAdminList = (rule, value, callback) => {
                if (this.roleInfo.adminList.length === 0) {
                    return callback(new Error('请选择角色的管理员'));
                } else {
                    callback();
                }
            };
            let checkVisible = (rule, value, callback) => {
                if (value === '' || value === undefined) {
                    return callback(new Error('请选择角色状态'));
                } else {
                    callback();
                }
            };
            return {
                data: [{
                    id: 1,
                    label: '首页',
                    children: [{
                        id: 101,
                        label: '操控台',
                        children: [{
                            id: 10101,
                            label: '注入视频'
                        }, {
                            id: 10102,
                            label: '新建节目'
                        }, {
                            id: 10103,
                            label: '新建节目专题'
                        }, {
                            id: 10104,
                            label: '新建人物专题'
                        }, {
                            id: 10105,
                            label: '新建直播频道'
                        }, {
                            id: 10106,
                            label: '新建轮播频道'
                        }, {
                            id: 10107,
                            label: '新建人物'
                        }, {
                            id: 10108,
                            label: '上传新版本'
                        }, {
                            id: 10109,
                            label: '批量导入人物'
                        }, {
                            id: 10110,
                            label: '批量导入节目'
                        }, {
                            id: 10111,
                            label: '批量导入直播频道'
                        }, {
                            id: 10112,
                            label: '批量导入轮播频道'
                        }]
                    }, {
                        id: 102,
                        label: '客户端日志（有搜索、筛选、查看权限）'
                    }, {
                        id: 103,
                        label: '存储空间（有查看权限）'
                    }]
                }, {
                    id: 2,
                    label: '内容管理',
                    children: [{
                        id: 201,
                        label: '节目管理',
                        children: [{
                            id: 20101,
                            label: '批量上架节目、下架节目'
                        }, {
                            id: 20102,
                            label: '删除选中节目'
                        }, {
                            id: 20103,
                            label: '导出选中节目'
                        }, {
                            id: 20104,
                            label: '导出全部节目'
                        }, {
                            id: 20105,
                            label: '新建节目'
                        }, {
                            id: 20106,
                            label: '导入节目'
                        }, {
                            id: 20107,
                            label: '编辑节目'
                        }, {
                            id: 20108,
                            label: '删除节目'
                        }, {
                            id: 20109,
                            label: '上架节目、下架节目'
                        }, {
                            id: 20110,
                            label: '节目详情'
                        }]
                    }, {
                        id: 202,
                        label: '页面布局',
                        children: [{
                            id: 20201,
                            label: '添加模块'
                        }, {
                            id: 20202,
                            label: '编辑模块'
                        }, {
                            id: 20203,
                            label: '删除模块'
                        }, {
                            id: 20204,
                            label: '模块排序'
                        }]
                    }, {
                        id: 203,
                        label: '视频管理（均可预览视频、复制链接）',
                        children: [{
                            id: 20301,
                            label: '批量重试注入'
                        }, {
                            id: 20302,
                            label: '删除选中视频'
                        }, {
                            id: 20303,
                            label: '导出选中视频'
                        }, {
                            id: 20304,
                            label: '导出全部视频'
                        }, {
                            id: 20305,
                            label: '下载选中视频、下载列表'
                        }, {
                            id: 20306,
                            label: '上传选中视频到主站 -> 子站的权限'
                        }, {
                            id: 20307,
                            label: '重试选中视频拉取 -> 子站的权限'
                        }, {
                            id: 20308,
                            label: '设置选中共享站点、查看共享站点'
                        }, {
                            id: 20309,
                            label: '注入视频'
                        }, {
                            id: 20310,
                            label: '检查时长'
                        }, {
                            id: 20311,
                            label: '共享设置、查看共享站点'
                        }]
                    }, {
                        id: 204,
                        label: '专题管理',
                        children: [{
                            id: 20401,
                            label: '批量上架专题、批量下架专题'
                        }, {
                            id: 20402,
                            label: '删除选中专题'
                        }, {
                            id: 20403,
                            label: '新建专题'
                        }, {
                            id: 20404,
                            label: '编辑专题'
                        }, {
                            id: 20405,
                            label: '删除专题'
                        }, {
                            id: 20406,
                            label: '上架专题、下架专题'
                        }]
                    }, {
                        id: 205,
                        label: '人物管理',
                        children: [{
                            id: 20501,
                            label: '批量上架人物、批量下架人物'
                        }, {
                            id: 20502,
                            label: '删除选中人物'
                        }, {
                            id: 20503,
                            label: '新建人物'
                        }, {
                            id: 20504,
                            label: '导入人物'
                        }, {
                            id: 20505,
                            label: '人物查重'
                        }, {
                            id: 20506,
                            label: '编辑人物'
                        }, {
                            id: 20507,
                            label: '删除人物'
                        }, {
                            id: 20508,
                            label: '上架人物、下架人物'
                        }]
                    }, {
                        id: 206,
                        label: '栏目管理',
                        children: [{
                            id: 20601,
                            label: '添加栏目'
                        }, {
                            id: 20602,
                            label: '编辑栏目'
                        }, {
                            id: 20603,
                            label: '删除栏目'
                        }, {
                            id: 20604,
                            label: '隐藏栏目'
                        }, {
                            id: 20605,
                            label: '栏目排序'
                        }]
                    }, {
                        id: 207,
                        label: '直播频道、轮播频道',
                        children: [{
                            id: 20701,
                            label: '禁用选中频道'
                        }, {
                            id: 20702,
                            label: '启用选中频道'
                        }, {
                            id: 20703,
                            label: '添加频道'
                        }, {
                            id: 20704,
                            label: '导入频道'
                        }, {
                            id: 20705,
                            label: '修改频道'
                        }, {
                            id: 20706,
                            label: '编辑频道'
                        }, {
                            id: 20707,
                            label: '删除频道'
                        }, {
                            id: 20708,
                            label: '启用频道'
                        }, {
                            id: 20709,
                            label: '禁用频道'
                        }, {
                            id: 20710,
                            label: '导入直播频道节目单'
                        }, {
                            id: 20711,
                            label: '预览直播频道节目单'
                        }, {
                            id: 20712,
                            label: '下载直播频道节目单'
                        }]
                    }, {
                        id: 208,
                        label: '类型管理',
                        children: [{
                            id: 20801,
                            label: '添加分类、类型、类型组'
                        }, {
                            id: 20802,
                            label: '编辑分类、类型、类型组'
                        }, {
                            id: 20803,
                            label: '删除分类、类型、类型组'
                        }]
                    }, {
                        id: 209,
                        label: '角标管理',
                        children: [{
                            id: 20901,
                            label: '添加角标'
                        }, {
                            id: 20902,
                            label: '编辑角标'
                        }, {
                            id: 20903,
                            label: '删除角标'
                        }]
                    }, {
                        id: 210,
                        label: '搜索管理'
                    }]
                }, {
                    id: 3,
                    label: '用户管理',
                    children: [{
                        id: 301,
                        label: '用户管理'
                    }, {
                        id: 302,
                        label: '订单管理',
                        children: [{
                            id: 30201,
                            label: '导出订单'
                        }]
                    }]
                }, {
                    id: 4,
                    label: '版本设备',
                    children: [{
                        id: 401,
                        label: '版本管理',
                        children: [{
                            id: 40101,
                            label: '添加版本'
                        }, {
                            id: 40102,
                            label: '编辑版本'
                        }, {
                            id: 40103,
                            label: '删除版本'
                        }, {
                            id: 40104,
                            label: '发布版本'
                        }, {
                            id: 40105,
                            label: '下载升级包'
                        }]
                    }, {
                        id: 402,
                        label: '设备管理',
                        children: [{
                            id: 40201,
                            label: '添加设备'
                        }]
                    }]
                }, {
                    id: 5,
                    label: '管理员',
                    children: [{
                        id: 501,
                        label: '管理员列表',
                        children: [{
                            id: 50101,
                            label: '添加管理员'
                        }, {
                            id: 50102,
                            label: '编辑管理员'
                        }, {
                            id: 50103,
                            label: '删除管理员'
                        }, {
                            id: 50104,
                            label: '重置密码'
                        }, {
                            id: 50105,
                            label: '启用管理员、禁用管理员'
                        }, {
                            id: 50106,
                            label: '启用选中管理员、禁用选中管理员'
                        }]
                    }, {
                        id: 502,
                        label: '部门管理',
                        children: [{
                            id: 50201,
                            label: '添加部门'
                        }, {
                            id: 50202,
                            label: '编辑部门'
                        }, {
                            id: 50203,
                            label: '删除部门'
                        }]
                    }, {
                        id: 503,
                        label: '角色管理',
                        children: [{
                            id: 50301,
                            label: '添加角色'
                        }, {
                            id: 50302,
                            label: '编辑角色'
                        }, {
                            id: 50303,
                            label: '删除角色'
                        }, {
                            id: 50304,
                            label: '启用角色、禁用角色'
                        }, {
                            id: 50305,
                            label: '启用选中角色、禁用选中角色'
                        }, {
                            id: 50306,
                            label: '删除选中角色'
                        }]
                    }, {
                        id: 6,
                        label: '产品管理',
                        children: [{
                            id: 601,
                            label: '产品管理',
                            children: [{
                                id: 60101,
                                label: '添加产品包'
                            }, {
                                id: 60102,
                                label: '编辑产品包'
                            }, {
                                id: 60103,
                                label: '上架产品包、下架产品包'
                            }]
                        }, {
                            id: 602,
                            label: '商品管理'
                        }, {
                            id: 603,
                            label: '套餐管理',
                            children: [{
                                id: 60301,
                                label: '添加套餐'
                            }, {
                                id: 60302,
                                label: '编辑套餐'
                            }, {
                                id: 60303,
                                label: '上架套餐、下架套餐'
                            }]
                        }]
                    }, {
                        id: 7,
                        label: '广告管理',
                        children: [{
                            id: 701,
                            label: '广告主管理',
                            children: [{
                                id: 70101,
                                label: '添加广告主'
                            }, {
                                id: 70102,
                                label: '编辑广告主'
                            }, {
                                id: 70103,
                                label: '删除广告主'
                            }]
                        }, {
                            id: 702,
                            label: '广告管理',
                            children: [{
                                id: 70201,
                                label: '添加广告'
                            }, {
                                id: 70202,
                                label: '编辑广告'
                            }, {
                                id: 70203,
                                label: '删除广告'
                            }, {
                                id: 70204,
                                label: '上架广告、下架广告'
                            }]
                        }]
                    }, {
                        id: 8,
                        label: '站点管理',
                        children: [{
                            id: 801,
                            label: '站点列表',
                            children: [{
                                id: 80101,
                                label: '添加站点'
                            }, {
                                id: 80102,
                                label: '编辑站点'
                            }, {
                                id: 80103,
                                label: '删除站点'
                            }]
                        }]
                    }, {
                        id: 9,
                        label: '配置中心 -> 子站点',
                        children: [{
                            id: 901,
                            label: '站点配置'
                        }]
                    }]
                }],
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                isLoading: false,
                roleInfo: {
                    name: '',
                    description: '',
                    adminList: [],
                    visible: false
                },
                adminOptions: [],
                infoRules: {
                    name: [
                        {validator: checkName, trigger: 'blur'}
                    ],
                    description: [
                        {validator: checkDesc, trigger: 'blur'}
                    ],
                    adminList: [
                        {validator: checkAdminList, trigger: 'blur'}
                    ],
                    visible: [
                        {validator: checkVisible, trigger: 'blur'}
                    ]
                }
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                this.$util.toggleFixedBtnContainer();
                this.$service.getAdminList({
                    pageNum: 1,
                    pageSize: 10000
                }).then(response => {
                    if (response && response.code === 0) {
                        this.adminOptions = response.data.list;
                    }
                });
                if (this.status === 'EDIT_ROLE') {
                    this.getRoleDetail();
                }
            },
            getRoleDetail() {
                this.$service.getRoleDetail(this.$route.params.id).then(response => {
                    if (response && response.code === 0) {
                        for (let key in response.data) {
                            this.roleInfo[key] = response.data[key];
                        }
                    }
                });
            },
            validateAdminList() {
                this.$refs['roleInfo'].validateField('adminList');
            },
            removeAllAdmin() {
                this.roleInfo.adminList.splice(0);
                this.validateAdminList();
            },
            removeAdmin(admin, index) {
                this.roleInfo.adminList.splice(index, 1);
                this.validateAdminList();
            },
            querySearch(queryString, cb) {
                let results = queryString ? this.adminOptions.filter(this.createFilter(queryString)) : this.adminOptions;
                cb(results);
            },
            createFilter(queryString) {
                return (adminOptions) => {
                    return (adminOptions.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
                };
            },
            // 设置频道，对全选进行处理
            setAdmins(item) {
                this.roleInfo.adminList.push({
                    id: item.id,
                    name: item.name
                });
                this.roleInfo.adminList = _.uniqBy(this.roleInfo.adminList, 'id');
                this.validateAdminList();
            },
            // 保存
            saveRoleInfo() {
                this.$refs['roleInfo'].validate((valid) => {
                    if (valid) {
                        this.isLoading = true;
                        switch (this.status) {
                            case 'CREATE_ROLE':
                                this.$service.createRole(this.roleInfo).then(response => {
                                    if (response && response.code === 0) {
                                        this.$message.success('成功创建角色');
                                        this.toRoleList();
                                    } else {
                                        this.isLoading = false;
                                    }
                                });
                                break;
                            case 'EDIT_ROLE':
                                this.$service.updateRoleInfo(this.roleInfo).then(response => {
                                    if (response && response.code === 0) {
                                        this.$message.success('保存角色信息成功');
                                        this.toRoleList();
                                    } else {
                                        this.isLoading = false;
                                    }
                                });
                                break;
                            default:
                                break;
                        }
                    } else {
                        return false;
                    }
                });
            },
            toRoleList() {
                this.$router.push({name: 'RoleList'});
            }
        }
    }
    ;
</script>

<style lang="scss">

    #role-page-container {
        .el-tree-node {
            margin-bottom: 10px;
        }
        .el-tree-node__content {
            background-color: transparent !important;
            &:hover {
                background-color: transparent !important;
            }
        }
    }

</style>

<style lang="scss" scoped>

    .el-tree {
        background: transparent;
    }

    .el-form {
        margin-top: 20px;
    }

    .textarea-tip {
        position: relative;
        right: 96px;
        top: 4px;
        color: #1989FA;
        font-size: 10px;
    }

    .my-tags {
        max-width: 1050px;
    }

</style>
