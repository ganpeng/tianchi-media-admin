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
    name: 'AppChannelSearch',
    props: {
        handleSelect: {
            type: Function,
            default: () => {}
        }
    },
    data() {
        return {
            restaurants: [],
            qs: ''
        };
    },
    methods: {
        async querySearchAsync(name, cb) {
            try {
                let res = await this.$service.searchAppChannelList(name);
                if (res && res.code === 0) {
                    let {list} = res.data;
                    cb(list);
                }
            } catch (err) {
                console.log(err);
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
