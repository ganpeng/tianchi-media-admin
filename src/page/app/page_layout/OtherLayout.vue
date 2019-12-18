<template>
    <div class="other-layout-container">
        <div class="other-layout-wrapper">
            <mixed1
                :item="item"
                :index="index"
                :isEdit="false"
                v-if="layoutTemplate === 'M_LT_1'"
            ></mixed1>
            <mixed22
                :item="item"
                :index="index"
                :isEdit="false"
                v-if="layoutTemplate === 'M_LT_2_2'"
            ></mixed22>
            <mixed33
                :item="item"
                :index="index"
                :isEdit="false"
                v-if="layoutTemplate === 'M_LT_3_3'"
            ></mixed33>
        </div>
    </div>
</template>
<script>
import Mixed1 from './mixed_module/Mixed1';
import Mixed22 from './mixed_module/Mixed22';
import Mixed33 from './mixed_module/Mixed33';
export default {
    name: 'OtherLayout',
    components: { Mixed1, Mixed22, Mixed33 },
    props: {
        item: {
            type: Object,
            default: () => {}
        },
        index: {
            type: Number,
            default: 0
        },
        layoutTemplate: {
            type: String,
            required: true
        },
        isEdit: {
            type: Boolean,
            default: false
        }
    }
};
</script>
<style lang="scss" scoped>
.other-layout-wrapper {
    width: 996px;
    margin: 0 auto;
}
</style>
