<!--用户列表操作设备组件-->
<template>
    <div>
        <ul>
            <li
                v-for="(item, index) in currentUserInfo.stbList"
                :key="index"
                class="stb-item">
                <label>设备{{index + 1}}：</label>
                <span>{{item.no}}</span>
                <el-button
                    v-if="item.onLine"
                    size="mini"
                    type="danger"
                    plain
                    @click="disabledStb(item,index)">
                    禁用
                </el-button>
                <el-button
                    v-else
                    size="mini"
                    type="success"
                    plain
                    @click="recoverStb(item,index)">
                    恢复
                </el-button>
                <el-select
                    v-if="!item.onLine"
                    v-model="item.reason"
                    @change="pickReason($event,item,index)"
                    placeholder="请选择禁用原因">
                    <el-option
                        v-for="item in reasonOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </li>
        </ul>
        <div class="text-right">
            <span slot="footer" class="dialog-footer">
               <el-button @click="closeDialog" class="page-vice-btn">取消</el-button>
               <el-button type="primary" @click="operateStb" class="page-vice-btn">确定</el-button>
            </span>
        </div>
    </div>
</template>

<script>

    export default {
        name: 'OperateStb',
        props: {
            userInfo: {
                type: Object,
                default: function () {
                    return {};
                }
            }
        },
        data() {
            return {
                currentUserInfo: [],
                reasonOptions: [{
                    value: 0,
                    label: '欠费'
                }, {
                    value: 1,
                    label: '其它'
                }]
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                this.currentUserInfo = this.userInfo;
            },
            // 禁用设备
            disabledStb(item, index) {
                item.onLine = false;
                this.currentUserInfo.stbList.splice(index, 1, item);
            },
            // 恢复设备
            recoverStb(item, index) {
                item.onLine = true;
                item.reason = '';
                this.currentUserInfo.stbList.splice(index, 1, item);
            },
            // 选择禁用原因
            pickReason(value, item, index) {
                item.reason = value;
                this.currentUserInfo.stbList.splice(index, 1, item);
            },
            // 保存禁用设备用户,关闭窗口，刷新列表
            operateStb() {
                this.$emit('closeDialog');
            },
            closeDialog() {
                this.$emit('closeDialog');
            }
        }
    };
</script>

<style lang="scss" scoped>

    ul {
        .stb-item {
            display: flex;
            margin-bottom: 20px;
            justify-content: left;
            label {
                width: 80px;
                height: 40px;
                font-size: 14px;
                line-height: 40px;
            }
            span {
                width: 120px;
                height: 40px;
                line-height: 40px;
                text-align: left;
            }
            .el-button {
                margin: 5px 10px;
            }
        }
    }

    .dialog-footer {
        margin: 30px 0px;
    }

</style>
