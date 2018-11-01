<!--节目包表单组件-->
<template>
    <div class="text-left">
        <el-form :model="productInfo"
                 :rules="infoRules"
                 status-icon
                 ref="productInfo"
                 label-width="120px"
                 class="form-block fill-form">
            <el-form-item label="类型" prop="category">
                节目包
            </el-form-item>
            <el-form-item label="名称" prop="name" required>
                <el-input v-model="productInfo.name" placeholder="请填写30个字以内的名称"></el-input>
            </el-form-item>
            <el-form-item label="简介" prop="desc">
                <el-input
                    v-model="productInfo.desc"
                    placeholder="请填写100个字以内的简介"
                    type="textarea"
                    :rows="4">
                </el-input>
            </el-form-item>
        </el-form>
        <div class="block-box text-left">
            <div class="block-title">添加节目</div>
            <select-multiple-programme
                :selectedProgrammeList="selectedProgrammeList"
                ref="selectMultipleProgramme"
                v-on:setProgramme="setProgramme">
            </select-multiple-programme>
            <div class="vice-block">
                <h3 class="block-vice-title">已选节目</h3>
                <el-table
                    :data="selectedProgrammeList"
                    header-row-class-name="common-table-header"
                    row-class-name=programme-row
                    border
                    style="width: 100%">
                    <el-table-column
                        align="center"
                        width="70px"
                        label="序号">
                        <template slot-scope="scope">
                            <label>{{scope.$index + 1}}</label>
                        </template>
                    </el-table-column>
                    <el-table-column
                        align="center"
                        width="120px"
                        prop="code"
                        label="编号">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="name"
                        label="名称">
                    </el-table-column>
                    <el-table-column
                        width="100px"
                        align="center"
                        label="图片">
                        <template slot-scope="scope">
                            <img
                                :src="scope.row.coverImage ? scope.row.coverImage.uri : '' | imageUrl"
                                :alt="scope.row.coverImage.name"
                                v-if="scope.row.coverImage">
                            <label v-else>------</label>
                        </template>
                    </el-table-column>
                    <el-table-column
                        align="center"
                        label="主演">
                        <template slot-scope="scope">
                            <label>{{scope.row.figureListMap | displayFigures('CHIEF_ACTOR')}}</label>
                        </template>
                    </el-table-column>
                    <el-table-column
                        align="center"
                        label="操作"
                        class="operate">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" class="remove-btn"
                                       @click="removeProgramme(scope.$index)">
                                取消关联
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <div class="operate">
            <el-button type="primary" @click="operateProduct" class="page-main-btn">
                {{this.status === '0' ? '创建' : '保存'}}
            </el-button>
            <el-button @click="reset"
                       v-if="this.status === '0' || this.status === '1' "
                       class="page-main-btn"
                       type="primary"
                       plain>
                重置
            </el-button>
            <el-button @click="toProductList" class="page-main-btn">返回列表页</el-button>
        </div>
    </div>
</template>

<script>
    import SelectMultipleProgramme from '../../subject_manage/programme_subject/SelectMultipleProgramme';

    export default {
        name: 'ProgrammeProductForm',
        // status为1代表编辑，0代表创建
        props: {
            status: {
                type: String,
                required: true
            }
        },
        components: {
            SelectMultipleProgramme
        },
        data() {
            let checkName = (rule, value, callback) => {
                if (this.$util.isEmpty(value)) {
                    return callback(new Error('产品包名称不能为空'));
                } else if (this.$util.trim(value).length > 30) {
                    return callback(new Error('产品包名称不能超过30字'));
                } else {
                    callback();
                }
            };
            let checkDesc = (rule, value, callback) => {
                if (this.$util.trim(value).length > 100) {
                    return callback(new Error('产品包描述不能超过100字'));
                } else {
                    callback();
                }
            };
            return {
                productInfo: {
                    id: '',
                    category: 'PROGRAMME',
                    name: '',
                    desc: '',
                    targetIdList: []
                },
                selectedProgrammeList: [],
                infoRules: {
                    name: [
                        {validator: checkName, trigger: 'blur'}
                    ],
                    desc: [
                        {validator: checkDesc, trigger: 'blur'}
                    ]
                }
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            // 初始化数据
            init() {
                this.$nextTick(function () {
                    this.$refs.selectMultipleProgramme.init();
                });
                if (this.status === '1') {
                    this.$service.getProductInfo(this.$route.params.id).then(response => {
                        if (response && response.code === 0) {
                            this.productInfo = response.data;
                        }
                    });
                }
            },
            // 创建或更新产品包
            operateProduct() {
                this.$refs['productInfo'].validate((valid) => {
                    if (valid) {
                        // 设置targetIdList
                        this.productInfo.targetIdList = [];
                        this.selectedProgrammeList.map(programme => {
                            this.productInfo.targetIdList.push(programme.id);
                        });
                        // 创建产品包
                        if (this.status === '0') {
                            this.$service.createProduct(this.productInfo).then(response => {
                                if (response && response.code === 0) {
                                    this.$message.success('成功创建节目包');
                                    this.toProductList();
                                }
                            });
                        } else {
                            // 更新产品包
                            this.productInfo.id = this.$route.params.id;
                            this.$service.updateProductInfo(this.productInfo).then(response => {
                                if (response && response.code === 0) {
                                    this.$message.success('成功更新产品包');
                                    this.toProductList();
                                }
                            });
                        }
                    } else {
                        return false;
                    }
                });
            },
            // 删除选中的节目
            removeProgramme(index) {
                let removedRow = this.selectedProgrammeList.splice(index, 1)[0];
                this.$refs.selectMultipleProgramme.cancelSelectRow(removedRow);
            },
            // 设置选择的节目
            setProgramme(selectedProgrammes) {
                this.selectedProgrammeList = [];
                for (let i = 0; i < selectedProgrammes.length; i++) {
                    this.selectedProgrammeList.push(selectedProgrammes[i]);
                }
            },
            reset() {
                this.$refs['productInfo'].resetFields();
            },
            toProductList() {
                this.$router.push({name: 'ProductList'});
            }
        }
    };
</script>

<style lang="scss" scoped>

    .operate {
        margin-top: 200px;
        margin-bottom: 80px;
        text-align: center;
    }

    .el-table {
        margin: 0px;
        .remove-btn {
            color: $baseRed;
        }
        img {
            width: 70px;
        }
    }

</style>
