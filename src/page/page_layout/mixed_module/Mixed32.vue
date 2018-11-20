<template>
    <div class="mixed23-container">
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
                    <div class="bottom-right-field"></div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {

};
</script>
<style lang="scss" scoped>
@mixin paddingBg($paddingNum) {
    height: 0;
    padding-bottom: $paddingNum;
    background: #2A3040;
    border-radius: 8px;
}
.mixed23-container {
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
                    @include paddingBg(53.5714%);
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
                &:first-child {
                    margin-right: 2%;
                }
            }
            .bottom-left-field,
            .bottom-right-field {
                @include paddingBg(30.2325%);
            }
        }
    }
}
</style>
