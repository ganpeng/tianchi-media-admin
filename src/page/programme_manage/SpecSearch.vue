<template>
    <el-autocomplete
        v-model="qs"
        :fetch-suggestions="querySearchAsync"
        value-key="name"
        placeholder="请选择规格"
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
            let restaurants = role.SPEC.map((item) => {
                return {
                    name: item.label
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
