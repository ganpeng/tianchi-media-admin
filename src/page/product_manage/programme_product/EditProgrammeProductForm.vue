<!--编辑节目包表单组件-->
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
        <div class="seperator-line"></div>
        <!--添加节目-->
        <div class="table-block">
            <div class="content-sub-title">添加节目</div>
            <product-select-multiple-programme
                :selectedProgrammeList="selectedProgrammeList"
                ref="selectMultipleProgramme"
                v-on:setProgramme="setProgramme">
            </product-select-multiple-programme>
        </div>
        <div class="seperator-line"></div>
        <!--线上关联节目列表-->
        <div class="table-block">
            <h3 class="content-sub-title">线上关联节目列表</h3>
            <programme-product-operate-table
                v-on:removeSelectRow="removeProgramme"
                v-on:recoverSelectRow="recoverSelectRow"
                :programmeList="onlineProgrammeList"
                model="ORIGIN">
            </programme-product-operate-table>
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="listQueryParams.pageNum"
                :page-sizes="[10, 20, 30, 50]"
                :page-size="listQueryParams.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalAmount">
            </el-pagination>
        </div>
        <div class="seperator-line"></div>
        <!--本次编辑取消关联节目-->
        <div class="table-block">
            <h3 class="content-sub-title">本次编辑取消关联节目</h3>
            <programme-product-operate-table
                v-on:recoverSelectRow="recoverSelectRow"
                :programmeList="removedProgrammeList"
                model="REMOVED">
            </programme-product-operate-table>
        </div>
        <div class="seperator-line"></div>
        <!--除线上关联节目外，本次编辑新增节目-->
        <div class="table-block">
            <h3 class="content-sub-title">本次编辑新增节目</h3>
            <programme-product-operate-table
                v-on:removeSelectRow="removeProgramme"
                :programmeList="addedProgrammeList"
                model="ADDED">
            </programme-product-operate-table>
        </div>
        <!--操作-->
        <div class="fixed-btn-container">
            <el-button class="btn-style-two" type="primary" @click="operateProduct">保存</el-button>
            <el-button class="btn-style-three" @click="toProductList" plain>返回列表</el-button>
        </div>
    </div>
</template>

<script>
    import ProductSelectMultipleProgramme from './ProductSelectMultipleProgramme';
    import ProgrammeProductOperateTable from './ProgrammeProductOperateTable';

    export default {
        name: 'EditProgrammeProductForm',
        components: {
            ProductSelectMultipleProgramme,
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
                    id: this.$route.params.id,
                    category: 'PROGRAMME',
                    name: '',
                    description: '',
                    contentIdList: []
                },
                originContentIdList: [],
                selectedProgrammeList: [],
                // 本产品包线上节目的列表的某一页的数据
                onlineProgrammeList: [],
                // 线上节目列表中移除的节目数据
                removedProgrammeList: [],
                // 除线上节目列表以外的添加的节目列表
                addedProgrammeList: [],
                listQueryParams: {
                    id: this.$route.params.id,
                    pageSize: 10,
                    pageNum: 1
                },
                totalAmount: 0,
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
                this.$util.toggleFixedBtnContainer();
                this.$service.getProductInfo({id: this.$route.params.id}).then(response => {
                    if (response && response.code === 0) {
                        this.productInfo = response.data;
                        if (response.data.contentIdList === null) {
                            this.productInfo.contentIdList = [];
                        }
                        this.originContentIdList = this.productInfo.contentIdList.slice(0);
                        // 设置全部的数据
                        for (let i = 0; i < response.data.contentIdList.length; i++) {
                            this.selectedProgrammeList.push({id: response.data.contentIdList[i]});
                        }
                        this.$nextTick(function () {
                            this.$refs.selectMultipleProgramme.init();
                        });
                    }
                });
                this.getProgrammeProductContentList();
            },
            getProgrammeProductContentList() {
                this.$service.getProgrammeProductContentList(this.listQueryParams).then(response => {
                    if (response && response.code === 0) {
                        this.onlineProgrammeList = response.data.list;
                        this.totalAmount = response.data.total;
                        // 标记线上节目列表中已经去除的节目
                        for (let i = 0; i < this.removedProgrammeList.length; i++) {
                            this.onlineProgrammeList.map(programme => {
                                if (programme.id === this.removedProgrammeList[i].id) {
                                    programme.removed = true;
                                }
                            });
                        }
                    }
                });
            },
            handleSizeChange(pageSize) {
                this.listQueryParams.pageSize = pageSize;
                this.getProgrammeProductContentList();
            },
            handleCurrentChange(pageNum) {
                this.listQueryParams.pageNum = pageNum;
                this.getProgrammeProductContentList();
            },
            // 更新产品包
            operateProduct() {
                this.$refs['productInfo'].validate((valid) => {
                    if (valid) {
                        // 更新产品包
                        this.$service.updateProductInfo(this.productInfo).then(response => {
                            if (response && response.code === 0) {
                                this.$message.success('成功更新产品包');
                                this.toProductList();
                            }
                        });
                    } else {
                        return false;
                    }
                });
            },
            // 取消关联的节目
            removeProgramme(model, removedRow) {
                if (model === 'ORIGIN') {
                    // 添加到线上数据移除列表中
                    this.removedProgrammeList.push(removedRow);
                }
                // 从总的关联节目列表中移除
                for (let i = 0; i < this.productInfo.contentIdList.length; i++) {
                    if (this.productInfo.contentIdList[i] === removedRow.id) {
                        this.productInfo.contentIdList.splice(i, 1);
                    }
                }
                // 源数据节目列表中勾除
                this.$refs.selectMultipleProgramme.cancelSelectRow(removedRow);
                this.$message.success('"' + removedRow.name + '"' + '成功取消关联');
            },
            // 恢复取消关联的节目
            recoverSelectRow(model, recoveredRow) {
                // 如果是移除列表节目恢复关联，则更新线上节目列表状态
                if (model === 'REMOVED') {
                    this.getProgrammeProductContentList();
                }
                // 从线上数据移除列表中去除该项
                for (let i = 0; i < this.removedProgrammeList.length; i++) {
                    if (this.removedProgrammeList[i].id === recoveredRow.id) {
                        this.removedProgrammeList.splice(i, 1);
                    }
                }
                // 恢复关联的节目放到总的关联节目列表中
                this.productInfo.contentIdList.push(recoveredRow.id);
                // 源数据节目列表中勾选恢复节目
                this.$refs.selectMultipleProgramme.recoverSelectRow(recoveredRow);
                this.$message.success('"' + recoveredRow.name + '"' + '成功恢复关联');
            },
            // 设置选择的节目,selectedProgrammes为所有选择的节目列表
            // 重新更新'ORIGIN'、'REMOVED'、'ADDED'列表
            setProgramme(selectedProgrammes, removedProgrammes) {
                // 设置总的选择节目IdList
                this.productInfo.contentIdList = [];
                selectedProgrammes.map(programme => {
                    this.productInfo.contentIdList.push(programme.id);
                });
                // 设置线上去除'REMOVED'列表，与originContentIdList对比
                this.removedProgrammeList = [];
                for (let m = 0; m < removedProgrammes.length; m++) {
                    for (let n = 0; n < this.originContentIdList.length; n++) {
                        if (removedProgrammes[m].id === this.originContentIdList[n]) {
                            this.removedProgrammeList.push(removedProgrammes[m]);
                            break;
                        }
                    }
                }
                // 重新更新线上数据列表状态
                this.getProgrammeProductContentList();
                // 设置新增节目列表
                this.addedProgrammeList = [];
                selectedProgrammes.map(programme => {
                    if (programme.name) {
                        if (this.originContentIdList.length === 0) {
                            this.addedProgrammeList.push(programme);
                        } else {
                            for (let i = 0; i < this.originContentIdList.length; i++) {
                                if (programme.id === this.originContentIdList[i]) {
                                    break;
                                }
                                if (i === this.originContentIdList.length - 1) {
                                    this.addedProgrammeList.push(programme);
                                }
                            }
                        }
                    }
                });
                this.selectedProgrammeList = [];
                for (let i = 0; i < selectedProgrammes.length; i++) {
                    this.selectedProgrammeList.push(selectedProgrammes[i]);
                }
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

    .el-pagination {
        margin-top: 10px;
    }

    .table-block {
        margin-bottom: 40px;
    }

</style>
