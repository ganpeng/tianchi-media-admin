<!--导入excel统一新建频道组件-->
<template>
    <div class="app-container">
        <upload-excel-component
            :on-success='handleSuccess'
            :before-upload="beforeUpload">
        </upload-excel-component>
        <el-table :data="tableData"
                  border
                  highlight-current-row
                  style="width: 100%;margin-top:20px;">
            <el-table-column
                v-for='item of tableHeader'
                :prop="item"
                :label="item"
                :key='item'>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    import UploadExcelComponent from './UploadExcel';

    export default {
        name: 'CreateChannelByImportExcel',
        components: {UploadExcelComponent},
        data() {
            return {
                tableData: [],
                tableHeader: []
            };
        },
        methods: {
            beforeUpload() {
                return true;
            },
            handleSuccess({results, header}) {
                this.tableData = results;
                this.tableHeader = header;
            }
        }
    };
</script>
