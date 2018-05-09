<!-- 详情页广告组件 -->
<template>
    <advert-group-list :type="8"></advert-group-list>
</template>
<script>
import AdvertGroupList from './AdvertGroupList';
export default {
    name: 'DetailPageAdvertGroupList',
    components: {
        AdvertGroupList
    }
};
</script>
