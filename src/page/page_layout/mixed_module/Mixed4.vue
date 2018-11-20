<template>
    <div class="mixed4-container">
        <div class="header"></div>
        <div class="content-field">
            <div class="wrapper">
                <div class="field-1"></div>
            </div>
            <div class="wrapper">
                <div class="field-2"></div>
            </div>
            <div class="wrapper">
                <div class="field-3"></div>
            </div>
            <div class="wrapper">
                <div class="field-4"></div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'Mixed4',
    data() {
        return {};
    }
};
</script>
<style lang="scss" scoped>
@mixin paddingBg($paddingNum) {
    height: 0;
    padding-bottom: $paddingNum;
    background: #2A3040;
    border-radius: 8px;
}
.mixed4-container {
    .header {
        margin: 40px 0 10px 0;
    }
    .content-field {
        display: flex;
        .wrapper {
            flex: 1;
            .field-1,
            .field-2,
            .field-3,
            .field-4 {
                @include paddingBg(150.4065%);
            }
        }
        .wrapper + .wrapper {
            margin-left: 2%;
        }
    }
}
</style>
