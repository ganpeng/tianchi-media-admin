<!-- 广告组弹出框 -->
<template>
    <el-dialog
        :title="dialogStatus === 0 ? '新增广告组' : '编辑广告组'"
        :show-close="false"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        width="80%"
        >
        <el-steps style="text-align:left;" align-center :active="active" finish-status="success">
            <el-step title="请选择广告素材"></el-step>
            <el-step title="排序"></el-step>
            <el-step title="输入广告组名称"></el-step>
        </el-steps>
        <advert-table v-show="active === 0"></advert-table>
        <div v-show="active === 1" class="step2">
            <ul class="items" id="items">
                <li class="item" v-for="(item, index) in items" :key="index">
                    <div class="container">
                        <img :src="item.url" width="200px" height="130px">
                        <div class="word">{{item.title}}</div>
                        <el-input placeholder="请输入内容" v-model="item.link">
                            <template slot="prepend">链接</template>
                        </el-input>
                    </div>
                </li>
            </ul>
        </div>
        <div v-show="active === 2" class="step3">
            <div class="input-item">
                <label>广告组名称: </label>
                <el-input
                    class="input"
                    placeholder="请输入广告组名称：广告内容+匹配策略+日期"
                    v-model="advertGroupName"
                    clearable>
                </el-input>
                <el-tooltip
                    placement="top"
                    content='建议广告组名称采用: "广告内容+匹配策略+日期" 的格式'
                >
                    <i class="el-icon-question pointer"></i>
                </el-tooltip>
            </div>
        </div>
        <span v-show="active !== 2" slot="footer" class="dialog-footer">
            <el-button @click="closeDialog">取消</el-button>
            <el-button v-show="active !== 0" @click="prevStepHandler">上一步</el-button>
            <el-button type="primary" @click="nextStepHandler">下一步</el-button>
        </span>
        <span v-show="active === 2" slot="footer" class="dialog-footer">
            <el-button @click="closeDialog">取消</el-button>
            <el-button @click="prevStepHandler">上一步</el-button>
            <el-button type="primary" @click="closeDialog">确 定</el-button>
        </span>
    </el-dialog>
</template>
<script>
import AdvertTable from './AdvertTable';
export default {
    name: 'AdvertGroupDialog',
    components: {
        AdvertTable
    },
    props: {
        dialogVisible: {
            type: Boolean,
            default: false
        },
        dialogStatus: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            active: 0,
            advertGroupName: '',
            items: [
                {
                    title: '图片1',
                    link: '',
                    url: 'https://tse1-mm.cn.bing.net/th?id=OIP.zn7At_hL_CSW6MsoVrzGuAHaEo&w=300&h=187&c=7&o=5&pid=1.7'
                },
                {
                    title: '图片2',
                    link: 'www.baidu.com',
                    url: 'http://photocdn.sohu.com/20160107/Img433729049.jpg'
                },
                {
                    title: '图片3',
                    link: '',
                    url: 'http://pic.4j4j.cn/upload/pic/20151015/465ce1d4b0.jpg'
                }
            ]
        };
    },
    methods: {
        closeDialog() {
            this.$emit('closeDialog', false);
            this.clearData();
        },
        prevStepHandler() {
            this.active -= 1;
        },
        nextStepHandler() {
            this.active += 1;
            if (this.active === 1) {
                this.$dragula([document.getElementById('items')], {
                    direction: 'horizontal'
                });
            }
        },
        clearData() {
            this.active = 0;
            this.advertGroupName = '';
        }
    }
};
</script>
<style lang="less" scoped>
.list {
    overflow: hidden;
    margin-top: 40px;
    display: flex;
    justify-content: space-around;
}
.input {
    width: 40%;
    margin-top: 40px;
}
.items {
    margin-top: 30px;
    .item {
        display: inline-block;
        width: 200px;
        height: 130px;
        margin-left: 5px;
        cursor: move;
        transition: all 1s;
        text-align: center;
        .container {
            height: 152px;
        }
    }
}

.gu-mirror {
    position: absolute;
    pointer-events: none;
    transition: all 0s !important;
    height: 152px;
    .container {
        .word {
            display: none;
        }
    }
}
.gu-transit {
    color:white;
    border-radius: 2px;
    border: 1px dashed #e1e1e1;
    box-sizing: border-box;
    top: -22px;
    position: relative;
    opacity:1;
    img {
        display:none;
    }
    .word {
        display:none;
    }
}

.fade-enter,
.fade-leave-active {
    opacity: 0;
    transform: translateY(30px);
}

.fade-leave-active {
  position: absolute;
}
</style>
