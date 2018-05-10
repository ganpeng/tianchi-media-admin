<!--  选择匹配策略的步骤 -->
<template>
    <div class="container">
        <el-form ref="ruleForm" :model="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="广告作用地区">
                <el-select v-model="ruleForm.region" placeholder="请选择活动区域">
                <el-option label="上海" value="shanghai"></el-option>
                <el-option label="北京" value="beijing"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="广告作用时间" required>
                <el-date-picker
                    v-model="ruleForm.dateRange"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="选择用户" prop="user">
                <el-input type="text" v-model="ruleForm.user"></el-input>
                <el-button type="primary">搜索</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
export default {
    name: 'Strategy',
    data() {
        return {
            ruleForm: {
                region: 'beijing',
                dateRange: '',
                user: ''
            }
        };
    }
};
</script>
<style lang="less" scoped>
</style>


