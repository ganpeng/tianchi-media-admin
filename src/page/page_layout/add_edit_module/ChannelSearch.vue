<template>
    <el-autocomplete
        v-model="qs"
        :fetch-suggestions="querySearchAsync"
        value-key="name"
        placeholder="请输入内容"
        @select="selectHandler"
    ></el-autocomplete>
</template>
<script>
export default {
    name: 'ChannelSearch',
    props: {
        handleSelect: {
            type: Function,
            default: () => {}
        },
        isCarousel: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            restaurants: [],
            qs: ''
        };
    },
    methods: {
        querySearchAsync(name, cb) {
            console.log(this.isCarousel);
            if (this.isCarousel) {
                this.$service.searchCarouselChannelList(name)
                    .then((res) => {
                        if (res && res.code === 0) {
                            let {list} = res.data;
                            cb(list);
                        }
                    });
            } else {
                this.$service.searchLiveChannelList(name)
                    .then((res) => {
                        if (res && res.code === 0) {
                            let {list} = res.data;
                            cb(list);
                        }
                    });
            }
        },
        selectHandler(channel) {
            this.handleSelect(channel);
            this.qs = '';
        }
    }
};
</script>
<style lang="scss" scoped>
</style>
