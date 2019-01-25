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
import role from '@/util/config/role';
export default {
    name: 'SpecSearch',
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
        querySearchAsync(queryString, cb) {
            let restaurants = role.MAIN_ROLE_OPTIONS.map((item) => {
                return {
                    name: item.label,
                    value: item.value
                };
            });
            var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;
            cb(results);
        },
        createStateFilter(queryString) {
            return (state) => {
                return (state.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
            };
        },
        selectHandler(category) {
            this.handleSelect(category);
            this.qs = '';
        }
    }
};
</script>
<style lang="scss" scoped>
</style>
