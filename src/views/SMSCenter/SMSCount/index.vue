<template>
  <div class="customer">
    <pan-shi-search>
      <template #1>
        <el-input
          v-model="search.merchantChiName"
          maxlength="10"
          placeholder="筛选调用客户"
        ></el-input>
      </template>
      <template #2>
        <el-input
          v-model="search.apiChiName"
          maxlength="10"
          placeholder="筛选API服务"
        ></el-input>
      </template>
      <template #3>
        <el-select
          v-model="search.result"
          maxlength="10"
          placeholder="筛选调用结果"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </template>
      <template #4>
        <el-date-picker
          v-model="search.date"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </template>
      <template #5>
        <el-button
          type="primary"
          icon="el-icon-search"
          @click="getTableData(undefined)"
          >查询</el-button
        >
        <el-button
          type="primary"
          icon="el-icon-refresh-right"
          @click="resetForm"
          >重置</el-button
        >
      </template>
    </pan-shi-search>

    <pan-shi-table
      :table="table"
      :total="total"
      :currentPage="currentPage"
      :pageSize="pageSize"
      @pagination="getTableData"
    ></pan-shi-table>
  </div>
</template>
<script>

import diagrameApi from "@/api/diagrameApi";
import { resetDataAttr } from "@/utils/index.js";
import _ from "lodash";
export default {
  components: {
  },
  data() {
    return {
      options: [
        { value: 0, label: "成功" },
        { value: 1, label: "失败" }
      ],
      search: {
        date: [],
        merchantChiName: "",
        apiChiName: "",
        result: ""
      },
      //
      total: 0,
      currentPage: 1,
      pageSize: 10,
      table: {
        body: [
              {
            fieldName: "useTime",
            fieldText: "日期",
            sortable: true,
            type: "time"
          },
          { fieldName: "merchantChiName", fieldText: "部门" },
          { fieldName: "ip", fieldText: "发送总量" },
          { fieldName: "result", fieldText: "成功" },
          { fieldName: "result", fieldText: "失败" },
          { fieldName: "result", fieldText: "成功率" },
          { fieldName: "ip", fieldText: "总计结算金额d" },

          {
            fieldName: "useTime",
            fieldText: "调用时间",
            sortable: true,
            type: "time"
          }
        ],
        tableAttributes: {
          data: []
        },
        defaultSort: 'useTime'
      }
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    getTableData(obj) {
      if (obj && obj.page) {
        this.currentPage = obj.page;
        this.pageSize = obj.limit;
      }
      console.log(this.search)
      let params = {
        merchantChiName: _.trim(this.search.merchantChiName),
        apiChiName: _.trim(this.search.apiChiName),
        result: _.trim(this.search.result),
        startTime: this.search.date[0],
        endTime: this.search.date[1]
      };
      diagrameApi
        .getApiopration({
          ...params,
          pageVo: {
            currentPage: this.currentPage,
            pageSize: this.pageSize
          }
        })
        .then(res => {
          this.table.tableAttributes.data = res.data.records;
          this.total = res.data.total;
        });
    },
    resetForm() {
      resetDataAttr(this, "search");
      this.getTableData();
    },
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
