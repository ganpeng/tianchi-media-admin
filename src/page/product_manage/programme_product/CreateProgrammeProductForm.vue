<!--节目包表单组件-->
<template>
    <div class="text-left product-container">
        <el-form
            :model="productInfo"
            :rules="infoRules"
            status-icon
            ref="productInfo"
            label-width="120px"
            class="form-block fill-form">
            <el-form-item label="类型" prop="category">
                <label class="product-category">节目包</label>
            </el-form-item>
            <el-form-item label="名称" prop="name" required>
                <el-input
                    v-model="productInfo.name"
                    size="medium"
                    placeholder="请填写30个字以内的名称">
                </el-input>
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
        <div class="seperator-line"></div>
        <!--已选节目-->
        <h3 class="content-sub-title">已选节目
            <el-button @click="selectProgrammeVisible = true" class="contain-svg-icon btn-style-two">
                <svg-icon icon-class="link_programme"></svg-icon>
                关联节目
            </el-button>
        </h3>
        <programme-product-operate-table
            v-if="selectedProgrammeList.length !== 0"
            v-on:removeSelectRow="removeProgramme"
            :programmeList="selectedProgrammeList"
            model="ADDED">
        </programme-product-operate-table>
        <div class="fixed-btn-container">
            <el-button class="btn-style-two" type="primary" @click="operateProduct">保存</el-button>
            <el-button class="btn-style-three" @click="toProductList" plain>返回列表</el-button>
        </div>
        <el-dialog
            title="关联节目"
            :visible.sync="selectProgrammeVisible"
            :close-on-click-modal=false
            custom-class="normal-dialog"
            top="13vh"
            width="80%">
            <select-multiple-programme
                v-if="selectProgrammeVisible"
                ref="selectMultipleProgramme"
                :selectedProgrammeList="selectedProgrammeList">
            </select-multiple-programme>
            <span slot="footer" class="dialog-footer">
                <el-button @click="selectProgrammeVisible = false">取消</el-button>
                <el-button type="primary" @click="confirmLinkProgramme">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import SelectMultipleProgramme from '../../subject_manage/components/SelectMultipleProgramme';
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
                selectProgrammeVisible: false,
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
            this.$util.toggleFixedBtnContainer();
        },
        methods: {
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
            // 确认关联节目
            confirmLinkProgramme() {
                this.selectedProgrammeList = this.$refs.selectMultipleProgramme.getSelectedProgrammeList();
                this.selectProgrammeVisible = false;
                this.$message.success('成功关联节目');
            },
            // 取消关联的节目
            removeProgramme(model, programme) {
                this.$message.success('"' + programme.name + '"' + '成功取消关联');
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

    .el-form {
        margin-bottom: 40px;
    }

    .product-container {
        margin-top: 30px;
    }

    .select-line {
        margin-top: 30px;
    }

    .product-category {
        color: #fff;
    }

    .el-table {
        margin-bottom: 80px;
        .remove-btn {
            font-size: 14px;
            color: #C35757;
        }
    }

</style>

<!--全局el-dialog样式-->
<style lang="scss">

    .normal-dialog {
        background: #293550;
        border: 0 solid #637497;
        box-shadow: 2px 4px 10px 0 rgba(0, 0, 0, 0.30);
        border-radius: 8px;
        .el-dialog__header {
            padding: 0px;
            height: 50px;
            line-height: 55px;
            background: #1F2D4D;
            .el-dialog__title {
                font-size: 20px;
                color: #909399;
            }
            .el-dialog__headerbtn {
                top: 16px;
                font-size: 15px;
                .el-dialog__close {
                    color: #C35757;
                }
            }
        }
        .el-dialog__footer {
            .el-button {
                width: 100px;
                height: 40px;
                &.el-button--default {
                    color: $dangerColor;
                }
                &.el-button--default.el-button--primary {
                    color: #A3D0FD;
                }
                &:first-child {
                    margin-left: 10px;
                }
            }
        }
    }

</style>
