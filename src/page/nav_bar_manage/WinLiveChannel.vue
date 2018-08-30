<!--内容管理-栏目管理-布局直播窗口组件-->
<template>
    <div class="ab-center win-live">
        <img src="~assets/img/live_win.png">
        <span>点击设置 / 查看</span>
        <label>{{liveChannelList[0] && liveChannelList[0].channel ?
            (liveChannelList[0].channel.category === 'LIVE' ? '直播' : '轮播') : ''}}频道
            {{liveChannelList[0] && liveChannelList[0].channel ?
            liveChannelList[0].channel.innerName : '未设置'}}
        </label>
    </div>
</template>

<script>

    export default {
        name: 'WinLiveChannel',
        props: {
            navBarId: {
                type: String,
                default: ''
            }
        },
        watch: {
            '$route'(to, from) {
                this.init();
            }
        },
        data() {
            return {
                liveChannelList: []
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                this.$service.getChannelLayout({
                    navBarId: this.navBarId,
                    pageNum: 0,
                    pageSize: 10
                }).then(response => {
                    if (response && response.code === 0) {
                        this.liveChannelList = response.data.list;
                    }
                });
            }
        }
    };
</script>

<style lang="scss" scoped>

    .win-live {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        background-color: $dynamicGray;
        img {
            display: block;
            margin-bottom: 10px;
            width: 52px;
        }
        span {
            margin-bottom: 10px;
            font-size: $largerFontSize;
            color: $baseBlue;
        }
        label {
            color: $baseAsideColor;
            font-size: $largerFontSize;
        }
    }

</style>
