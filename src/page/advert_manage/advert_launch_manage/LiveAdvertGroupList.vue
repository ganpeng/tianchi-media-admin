<!-- 直播换台广告组件 -->
<template>
    <advert-group-list :type="5"></advert-group-list>
</template>
<script>
import AdvertGroupList from './AdvertGroupList';
export default {
    name: 'LiveAdvertGroupList',
    components: {
        AdvertGroupList
    }
};
</script>
