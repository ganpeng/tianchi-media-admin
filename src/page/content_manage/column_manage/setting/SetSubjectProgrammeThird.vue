<!--内容管理-栏目管理-设置专题内的节目第三步--设置角标组件-->
<template>
    <div>
        <h3 class="text-left">请勾选需要展示的角标：</h3>
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
        <div style="margin: 15px 0;"></div>
        <el-checkbox-group v-model="checkedCornerMarks" @change="checkedCornerMarksChange">
            <el-checkbox v-for="(item,index) in cornerMarks" :label="item.id" :key="index">
                <label>{{item.position}}</label>
                <label>{{item.type}}</label>
                <label>{{item.value}}</label>
            </el-checkbox>
        </el-checkbox-group>
    </div>
</template>

<script>
    import cornerMarkOptions from '@/util/config/corner_mark';

    export default {
        name: 'SetSubjectProgrammeThird',
        data() {
            return {
                checkAll: false,
                checkedCornerMarks: [],
                cornerMarks: cornerMarkOptions,
                isIndeterminate: true
            };
        },
        methods: {
            handleCheckAllChange(val) {
                this.checkedCornerMarks = val ? [1, 2, 3, 4] : [];
                this.isIndeterminate = false;
            },
            checkedCornerMarksChange(value) {
                let checkedCount = value.length;
                this.checkAll = checkedCount === this.cornerMarks.length;
                this.isIndeterminate = checkedCount > 0 && checkedCount < this.cornerMarks.length;
            }
        }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>

    h3 {
        margin-top: 30px;
        margin-bottom: 30px;
        font-size: 18px;
    }

    .el-checkbox {
        display: block;
        margin-top: 20px;
        margin-left: 30px;
        label {
            margin-right: 20px;
        }
    }

</style>
