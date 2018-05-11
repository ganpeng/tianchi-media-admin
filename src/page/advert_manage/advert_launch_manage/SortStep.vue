<!-- 选中广告排序的组件 -->
<template>
    <div class="container">
        <ul class="items" id="items">
            <li class="item" v-for="(item, index) in checkedAdvertList" :key="index">
                <div class="container">
                    <img :src="item.img" width="200px" height="130px">
                    <div class="word">{{item.title}}</div>
                    <el-button @click="setAdvert(item.id)" v-if="statusOne" type="primary" class="btn">设置广告落地页</el-button>
                    <p v-if="statusOne">{{item.programmeName}}</p>
                    <el-input v-if="!statusOne" placeholder="请输入内容" v-model="item.link">
                        <template slot="prepend">链接</template>
                    </el-input>
                </div>
            </li>
        </ul>
        <el-dialog
            title="请选择落地页类型"
            :visible.sync="dialogVisible"
            :append-to-body="true"
            :close-on-click-modal="false"
            :show-close="false"
            width="30%">
                <div class="container">
                    <el-form ref="form" label-width="80px">
                        <el-form-item>
                            <el-radio-group v-model="linkType">
                                <el-radio :label="1">平台节目</el-radio>
                                <el-radio :label="2">商城商品</el-radio>
                                <el-radio :label="3">外部链接</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item :label="linkLabel">
                            <el-input v-model="link" placeholder="请输入内容"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="closeDialog">取 消</el-button>
                <el-button type="primary" @click="enterHandler">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    name: 'StrategyStep',
    props: {
        type: {
            type: Number
        },
        checkedAdvertList: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            dialogVisible: false,
            linkType: '',
            currentAdvertId: '',
            link: ''
        };
    },
    methods: {
        initDragula() {
            this.$dragula([document.getElementById('items')], {
                direction: 'horizontal'
            });
        },
        setAdvert(id) {
            this.dialogVisible = true;
            this.currentAdvertId = id;
        },
        closeDialog() {
            this.dialogVisible = false;
        },
        enterHandler() {
            if (this.link === '' || this.linkType === '') {
                return false;
            } else {
                let item = this.checkedAdvertList.find((item) => item.id === this.currentAdvertId);
                item.programmeName = this.link;
                this.link = '';
                this.currentAdvertId = '';
                this.linkType = '';
                this.closeDialog();
            }
        }
    },
    computed: {
        statusOne() {
            return this.type === 1 || this.type === 2 || this.type === 3;
        },
        linkLabel() {
            switch (this.linkType) {
                case 1:
                    return '节目ID';
                case 2:
                    return '商品ID';
                case 3:
                    return '外链URL';
                default:
                    return '';
            }
        }
    }
};
</script>
<style lang="less" scoped>

.btn {
    margin: 10px 0;
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
        img {
            width: 200px;
            height: 130px;
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
