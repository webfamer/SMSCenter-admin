<template>
  <div>
    <el-table
      :data="tableData"
      style="width: 100%"
      :default-sort="{ prop: 'date', order: 'descending' }"
    >
      <el-table-column prop="apiChiName" label="操作人姓名"></el-table-column>
      <el-table-column prop="status" label="操作记录"></el-table-column>
      <el-table-column prop="startTime" label="操作时间" sortable></el-table-column>
    </el-table>
    <Pagination :page="page" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange"></Pagination>
    <Detail @getoperation = "getOpration"></Detail>
  </div>
</template>

<script>
import customerApi from "@/api/customerApi";
import PageMixins from "@/mixins/pageMixins";
import Pagination from "@/components/Pagination/index";
export default {
  mixins: [PageMixins],
  data() {
    return {
      tableData: []
    };
  },
  methods: {
    getOpration() {
      customerApi
        .getApiOperation({
          pageVo: {
            currentPage: this.page.start,
            pageSize: this.page.limit
          }
        })
        .then(res => {
          this.tableData = res.data.records;
          this.page.total = res.data.totalPage;
          this.page.start = res.data.currentPage;
        });
    },
    handleSizeChange(v) {
      this.page.limit = v;
      this.getCustomerList();
    },
    handleCurrentChange(v) {
      this.page.start = v;
      this.getCustomerList();
    }
  },
  created() {
    this.getOpration();
  },
  components: {
    Pagination
  }
};
</script>

<style>
</style>