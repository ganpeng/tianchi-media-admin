<!--添加栏目组件-->
<template>
    <el-form
        :model="navBarInfo"
        :rules="infoRules"
        status-icon
        ref="subjectInfo"
        label-width="120px"
        class="form-block fill-form">
        <el-form-item label="栏目标题类型" prop="type" required>
            <el-radio-group v-model="navBarInfo.type">
                <el-radio :label="0">文字
                    <el-input v-model="navBarInfo.name" placeholder="请输入栏目标题，10字以内"></el-input>
                </el-radio>
                <el-radio :label="1">图片</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="栏目板式" required>
            <el-radio-group v-model="navBarInfo.model">
                <el-radio :label="3">新闻板式类</el-radio>
                <el-radio :label="6">电影板式类</el-radio>
                <el-radio :label="9">电视剧板式类</el-radio>
                <el-radio :label="11">专题板式类</el-radio>
            </el-radio-group>
        </el-form-item>
    </el-form>
</template>

<script>

    export default {
        name: 'CreateNavNarForm',
        data() {
            let checkType = (rule, value, callback) => {
                if (this.$util.isEmpty(value)) {
                    return callback(new Error('请选择栏目标题类型'));
                } else {
                    callback();
                }
            };
            return {
                navBarInfo: {
                    type: '',
                    name: '',
                    model: ''
                },
                infoRules: {
                    type: [
                        {validator: checkType, trigger: 'change'}
                    ]
                }
            };
        },
        methods: {}
    };
</script>

<style lang="scss" scoped>

</style>
