<template>
  <div class="customer">
    <el-card class="search-box" shadow="hover">
      <el-row :gutter="20">
        <el-col :span="3">
          <el-input v-model="search.merchantChiName" placeholder="筛选调用客户"></el-input>
        </el-col>
        <el-col :span="3">
          <el-input v-model="search.apiChiName" placeholder="筛选API服务"></el-input>
        </el-col>
        <el-col :span="3">
          <el-input v-model="search.result" placeholder="筛选调用结果"></el-input>
        </el-col>
        <el-col :span="5" :offset="1">
        <el-date-picker
            v-model="search.date"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-col>
        <el-col :span="4" :offset="1" :lg="6" :md="8">
          <el-button type="primary" icon="el-icon-search" @click="doSearch">查询</el-button>
          <el-button type="primary" icon="el-icon-refresh-right" @click="resetForm">重置</el-button>
        </el-col>
      </el-row>
    </el-card>

    <div class="content-box">
      <el-card shadow="never">
        <el-table
          :data="tableData"
          style="width: 100%"
          :default-sort="{ prop: 'date', order: 'descending' }"
        >
          <el-table-column prop="apiChiName" label="API服务名称" width="180"></el-table-column>
          <el-table-column prop="merchantChiName" label="调用客户" width="180"></el-table-column>
          <el-table-column prop="ip" label="调用IP"></el-table-column>
          <el-table-column prop="result" label="调用结果"></el-table-column>
          <el-table-column prop="useTime" label="调用时间" sortable></el-table-column>
        </el-table>
        <div class="block" style="float:right; margin-top:30px;margin-bottom:30px;">
          <Pagination
            :page="page"
            @sizeChange="handleSizeChange"
            @currentChange="handleCurrentChange"
          ></Pagination>
        </div>
      </el-card>
    </div>
  </div>
</template>
<script>
import PageMixins from "@/mixins/pageMixins";
import Pagination from "@/components/Pagination/index";
import diagrameApi from "@/api/diagrameApi";
export default {
  mixins: [PageMixins],
  data() {
    return {
      input: "",
      value1: "",
      value: "", //select选中值
      search: {
        date: []
      },
      tableData: []
    };
  },
  methods: {
    getApiOpration() {
      console.log(122121);
      let params = {
        merchantChiName: this.search.merchantChiName,
        apiChiName: this.search.apiChiName,
        result: this.search.result,
        startTime: this.search.date[0],
        endTime: this.search.date[1]
      };
      diagrameApi
        .getApiopration({
          apiPage: {
            ...params
          },
          pageVo: {
            pageNum: this.page.start,
            pageSize: this.page.limit
          }
        })
        .then(res => {
          this.tableData = res.data.records;
          console.log(this.tableData);
          this.page.total = res.data.totalPage;
          this.page.start = res.data.currentPage;
        });
    },
    doSearch() {
      console.log(this.search);
      this.getApiOpration();
    },
    resetForm() {
      this.getApiOpration();
      resetDataAttr(this, "search");
    },
    handleSizeChange(v) {
      this.page.limit = v;
      this.getApiOpration();
    },
    handleCurrentChange(v) {
      this.page.start = v;
      this.getApiOpration();
    }
  },
  created() {
    this.getApiOpration();
  },
  components: {
    Pagination
  }
};
</script>
<style lang="scss" scoped>
.customer {
  /deep/.search-box {
    .el-date-editor.el-input,
    .el-date-editor.el-input__inner {
      width: 100%;
    }
  }
  .content-box {
    margin: 30px;
    box-sizing: border-box;
    .pagination {
      margin-top: 30px;
    }
  }
}
</style>
