<template>
    <div class="other-layout-container">
        <person
            :item="item"
            :index="index"
            v-if="layoutTemplate === 'LT_F_6'"
        ></person>
        <!-- <mixeds6
            :item="item"
            :index="index"
            v-if="renderType === 'FIGURE' && layoutTemplate === 'FIGURE'"
        ></mixeds6> -->
    </div>
</template>
<script>
// import Mixeds6 from './mixed_module/Mixeds6';
import Person from './mixed_module/Person';
export default {
    name: 'OtherLayout',
    components: {
        // Mixeds6,
        Person
    },
    props: {
        item: {
            type: Object,
            default: () => {}
        },
        index: {
            type: Number,
            default: 0
        },
        renderType: {
            type: String,
            required: true
        },
        layoutTemplate: {
            type: String,
            required: true
        },
        isEdit: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {};
    },
    created() {},
    methods: {}
};
</script>
<style lang="scss" scoped>
</style>
