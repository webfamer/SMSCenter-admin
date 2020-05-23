<template>
  <div class="customer">
    <el-card class="search-box" shadow="hover">
      <el-row :gutter="20">
        <el-col class="joker-col" :lg="6" :md="8">
          <span>123</span>
          <el-date-picker
            v-model="search.date"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-col>
        <el-col class="joker-col" :lg="6" :md="8">
          <div class="search-item">
            <span>客户名称</span>
            <el-input
              v-model="search.merchantChiName"
              placeholder="搜索客户名称"
            ></el-input>
          </div>
        </el-col>
        <el-col class="joker-col" :lg="6" :md="8">
          <el-button type="primary" icon="el-icon-search" @click="doSearch"
            >查询</el-button
          >
          <el-button
            type="primary"
            icon="el-icon-refresh-right"
            @click="resetForm"
            >重置</el-button
          >
        </el-col>
      </el-row>
    </el-card>

    <div class="content-box">
      <el-card shadow="never">
        <div slot="header" class="clearfix">
          <el-button type="primary" icon="el-icon-plus" @click="add"
            >新增</el-button
          >
        </div>
        <el-table
          :data="tableData"
          style="width: 100%"
          :default-sort="{ prop: 'createTime', order: 'ascending' }"
        >
          <el-table-column
            prop="merchantChiName"
            label="客户名称"
            width="180"
          ></el-table-column>
          <el-table-column
            prop="openedApiAmount"
            label="已开通服务"
            width="180"
          ></el-table-column>
          <el-table-column prop="follower" label="首联系人"></el-table-column>
          <el-table-column
            prop="phoneNumber"
            label="手机号码"
          ></el-table-column>
          <el-table-column
            prop="createTime"
            sortable
            label="创建时间"
          ></el-table-column>
        </el-table>
        <Pagination
          :page="page"
          @sizeChange="handleSizeChange"
          @currentChange="handleCurrentChange"
        ></Pagination>
      </el-card>
    </div>
  </div>
</template>
<script>
import PageMixins from "@/mixins/pageMixins";
import Pagination from "@/components/Pagination/index";
import SMSDetailApi from "@/api/SMSDetail";
import _ from "lodash";
import { resetDataAttr } from "@/utils/index.js";
export default {
  mixins: [PageMixins],
  data() {
    return {
      input: "",
      tableData: [],
      search: {
        date: []
      }
    };
  },
  created() {
    console.log("created");
    this.getTableData();
  },
  methods: {
    getTableData() {
      let params = {
        merchantChiName: this.search.merchantChiName,
        startTime: this.search.date[0],
        endTime: this.search.date[1]
      };
      SMSDetailApi.getMsgDetail({
        ...params,
        pageVo: {
          currentPage: this.page.start,
          pageSize: this.page.limit
        }
      }).then(res => {
        this.tableData = res.data.records;
        this.page.total = res.data.totalPage;
        this.page.start = res.data.currentPage;
      });
    },
    handleSizeChange(v) {
      this.page.limit = v;
      this.getTableData();
    },
    handleCurrentChange(v) {
      this.page.start = v;
      this.getTableData();
    },
    doSearch() {
      console.log(this.search);
      this.getTableData();
    },
    resetForm() {
      this.getTableData();
      resetDataAttr(this, "search");
    }
  },
  components: {
    Pagination
  }
};
</script>
<style lang="scss" scoped>
.customer {
  .search-box{
    .search-item{
      display: flex;
      align-items: center;
      span{
       min-width: 80px;
       text-align: right;
       margin-right: 10px;
      }
    }
  }
  .content-box {
    margin: 30px;
    box-sizing: border-box;
    .pagination {
      margin-top: 30px;
    }
  }
  .joker-col {
    width: auto;
    margin-bottom: 10px;
  }
}
</style>
