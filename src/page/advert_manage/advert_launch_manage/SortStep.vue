<!-- 选中广告排序的组件 -->
<template>
    <ul class="items" id="items">
        <li class="item" v-for="(item, index) in items" :key="index">
            <div class="container">
                <img :src="item.url" width="200px" height="130px">
                <div class="word">{{item.title}}</div>
                <el-button v-if="statusOne" type="primary" class="btn">设置广告落地页</el-button>
                <el-input v-if="statusOne" placeholder="请输入节目名称" v-model="item.programmeName">
                </el-input>
                <el-input v-if="!statusOne" placeholder="请输入内容" v-model="item.link">
                    <template slot="prepend">链接</template>
                </el-input>
            </div>
        </li>
    </ul>
</template>
<script>
export default {
    name: 'StrategyStep',
    props: {
        type: {
            type: Number
        }
    },
    data() {
        return {
             items: [
                {
                    title: '图片1',
                    link: '',
                    programmeName: '节目名称',
                    url: 'https://tse1-mm.cn.bing.net/th?id=OIP.zn7At_hL_CSW6MsoVrzGuAHaEo&w=300&h=187&c=7&o=5&pid=1.7'
                },
                {
                    title: '图片2',
                    link: 'www.baidu.com',
                    programmeName: '节目名称',
                    url: 'http://photocdn.sohu.com/20160107/Img433729049.jpg'
                },
                {
                    title: '图片3',
                    link: '',
                    programmeName: '节目名称',
                    url: 'http://pic.4j4j.cn/upload/pic/20151015/465ce1d4b0.jpg'
                }
            ]
        };
    },
    methods: {
        initDragula() {
            this.$dragula([document.getElementById('items')], {
                direction: 'horizontal'
            });
        }
    },
    computed: {
        statusOne() {
            return this.type === 1 || this.type === 2 || this.type === 3;
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
