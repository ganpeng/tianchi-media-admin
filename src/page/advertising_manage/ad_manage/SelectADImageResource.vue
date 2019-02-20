<!--选择广告资源（图片、视频）组件-->
<template>
    <div>
        <el-select
            v-model="adOwner"
            @change="getADResource"
            clearable
            placeholder="请选择广告主">
            <el-option
                v-for="item in ownerOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
        </el-select>
    </div>
</template>

<script>
    export default {
        name: 'SelectADImageResource',
        props: {},
        data() {
            return {
                adOwner: '',
                ownerOptions: []
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                this.$service.getOwners.then(response => {
                    if (response && response.code === 0) {
                        this.ownerOptions = response.data.list;
                    }
                });
            },
            getADResource() {

            }
        }
    };
</script>

<style lang="scss" scoped>

</style>
