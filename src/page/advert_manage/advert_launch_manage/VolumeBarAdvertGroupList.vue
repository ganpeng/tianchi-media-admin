<!-- 音量条广告组件 -->
<template>
    <advert-group-list :type="6"></advert-group-list>
</template>
<script>
import AdvertGroupList from './AdvertGroupList';
export default {
    name: 'VolumeBarAdvertGroupList',
    components: {
        AdvertGroupList
    }
};
</script>
