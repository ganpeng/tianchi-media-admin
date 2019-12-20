<template>
    <div class="fixed-layout-container">
        <mfs1 :isEdit="isEdit" v-if="layoutTemplate === 'M_FS_1'"></mfs1>
    </div>
</template>
<script>
import Mfs1 from './fixed_module/Mfs1';
export default {
    name: 'FixedLayout',
    components: {Mfs1},
    props: {
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
.fixed-layout-container {
    overflow: hidden;
}
</style>
