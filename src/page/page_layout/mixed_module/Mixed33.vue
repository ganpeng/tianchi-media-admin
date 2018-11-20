<template>
    <div class="mixed33-container">
        <div class="header"></div>
        <div class="content-field">
            <div class="top-field">
                <div class="wrapper">
                    <div class="top-left-field"></div>
                </div>
                <div class="wrapper">
                    <div class="top-middle-field"></div>
                </div>
                <div class="wrapper">
                    <div class="top-right-field"></div>
                </div>
            </div>
            <div class="bottom-field">
                <div class="wrapper">
                    <div class="bottom-left-field"></div>
                </div>
                <div class="wrapper">
                    <div class="bottom-middle-field"></div>
                </div>
                <div class="wrapper">
                    <div class="bottom-right-field"></div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'Mixed33',
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
.mixed33-container {
    .header {
        margin: 40px 0 10px 0;
    }
    .content-field {
        .top-field {
            display: flex;
            margin-bottom: 2%;
            .wrapper {
                flex: 1;
                .top-left-field,
                .top-middle-field,
                .top-right-field {
                    @include paddingBg(39.8809%);
                }
            }
            .wrapper + .wrapper {
                margin-left: 2%;
            }
        }
        .bottom-field {
            display: flex;
            .wrapper {
                flex: 1;
                .bottom-left-field,
                .bottom-middle-field,
                .bottom-right-field {
                    @include paddingBg(39.8809%);
                }
            }
            .wrapper + .wrapper {
                margin-left: 2%;
            }
        }
    }
}
</style>
