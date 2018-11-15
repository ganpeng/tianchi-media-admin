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
            <el-form-item label="简介" prop="description">
                <el-input
                    v-model="productInfo.description"
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
                <programme-product-operate-table
                    v-on:removeSelectRow="removeProgramme"
                    :programmeList="selectedProgrammeList"
                    model="ADDED">
                </programme-product-operate-table>
            </div>
        </div>
        <div class="operate">
            <el-button type="primary" @click="operateProduct" class="page-main-btn">
                创建
            </el-button>
            <el-button @click="reset"
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
    import ProgrammeProductOperateTable from './ProgrammeProductOperateTable';

    export default {
        name: 'CreateProgrammeProductForm',
        components: {
            SelectMultipleProgramme,
            ProgrammeProductOperateTable
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
            let checkDescription = (rule, value, callback) => {
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
                    description: '',
                    contentIdList: []
                },
                selectedProgrammeList: [],
                infoRules: {
                    name: [
                        {validator: checkName, trigger: 'blur'}
                    ],
                    description: [
                        {validator: checkDescription, trigger: 'blur'}
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
            },
            // 创建产品包
            operateProduct() {
                this.$refs['productInfo'].validate((valid) => {
                    if (valid) {
                        // 设置contentIdList
                        this.productInfo.contentIdList = [];
                        this.selectedProgrammeList.map(programme => {
                            this.productInfo.contentIdList.push(programme.id);
                        });
                        // 创建产品包
                        this.$service.createProduct(this.productInfo).then(response => {
                            if (response && response.code === 0) {
                                this.$message.success('成功创建节目包');
                                this.toProductList();
                            }
                        });
                    } else {
                        return false;
                    }
                });
            },
            // 取消关联的节目
            removeProgramme(model, programme) {
                this.$refs.selectMultipleProgramme.cancelSelectRow(programme);
                this.$message.success('"' + programme.name + '"' + '成功取消关联');
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
