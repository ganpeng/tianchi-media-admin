<template>
    <div class="edit-app-fixed-module">
        <ul class="block-cell-list">
            <li class="block-cell-item"></li>
            <li class="block-cell-item"></li>
        </ul>
        <ul class="block-cell-list">
            <li class="block-cell-item"></li>
            <li class="block-cell-item"></li>
        </ul>
    </div>
</template>
<script>
export default {
    name: 'EditAppFixedModule',
    async created() {
        try {
            // let {navbarId} = this.$route.params;
            // let {id} = this.$route.query;
            // this.navbarId = navbarId;
            // await this.getNavbarList();
            // await this.getLayoutByNavbarId(navbarId);
            // this.layoutTemplate = this.getLayoutTemplateByNavbarId(id);
        } catch (err) {
            console.log(err);
        }
    }
};
</script>
<style lang="scss" scoped>
.edit-app-fixed-module {
    .block-cell-list {
        .block-cell-item {

        }
    }
}
</style>
