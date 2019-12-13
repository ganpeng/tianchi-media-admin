<template>
    <div class="banner-container">
        <div v-if="!isEdit" class="btn-field text-right">
            <el-button @click="editFixedModuleHandler" class="btn-style-five">
                <svg-icon icon-class="edit"></svg-icon>
            </el-button>
        </div>
        <flickity ref="flickity" :options="flickityOptions">
            <div v-for="(banner, index) in bannerList" :key="index" class="carousel-cell">{{banner.index}}</div>
        </flickity>
    </div>
</template>
<script>
import {mapGetters} from 'vuex';
import _ from 'lodash';
import Flickity from 'vue-flickity';
export default {
    name: 'Mfs1',
    components: {Flickity},
    props: {
        isEdit: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            squareIndex: 0,
            navbarId: '',
            flickityOptions: {
                initialIndex: 1,
                prevNextButtons: false,
                pageDots: true,
                wrapAround: true
            },
            bannerList: [
                {
                    index: 1
                },
                {
                    index: 2
                },
                {
                    index: 3
                }
            ]
        };
    },
    async created() {
        try {
            let {navbarId} = this.$route.params;
            this.navbarId = navbarId;
        } catch (err) {
            console.log(err);
        }
    },
    computed: {
        ...mapGetters({
            activeLayout: 'appPageLayout/activeLayout'
        })
    },
    methods: {
        editFixedModuleHandler() {
            let id = _.get(this.activeLayout, '0.id');
            this.$router.push({ name: 'EditAppFixedModule', params: {navbarId: this.navbarId, index: 0}, query: {id} });
        }
    }
};
</script>
<style lang="scss" scoped>
.banner-container {
    position: relative;
    height: 510px;
    .btn-field {
        margin: 10px 0 10px 0;
        display: flex;
        justify-content: flex-end;
    }
    .carousel-cell {
        width: 900px;
        height: 510px;
        background:rgba(37,45,63,0.5);
        border-radius:10px;
        margin-left: 20px;
    }
}
</style>
<style lang="scss">
.banner-container {
    .flickity-page-dots {
        width: 900px;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        text-align: left;
        margin-left: 30px;
        .dot {
            width: 8px;
            height: 8px;
            background: rgba(102,119,153,1);
            border-radius: 2px;
            margin: 0;
            margin-right: 8px;
            &.is-selected {
                width: 16px;
                background: rgba(25,137,250,1);
            }
        }
    }
}
</style>
