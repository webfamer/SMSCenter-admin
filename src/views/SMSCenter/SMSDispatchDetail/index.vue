<template>
  <div class="customer">
    <el-card class="search-box" shadow="hover">
      <el-row :gutter="20">
        <el-col class="joker-col" :lg="6" :md="8" v-has="'phoneInputBtn'">
          <div class="search-item">
            <span>手机号</span>
            <el-input
              size="mini"
              v-model="search.phone"
              placeholder="搜索手机号"
            ></el-input>
          </div>
        </el-col>
        <el-col class="joker-col" :lg="6" :md="8" v-has="'productSelectBtn'">
          <div class="search-item">
            <span>应用名称</span>
                    <el-select
              v-model="search.applicationId"
              maxlength="10"
              size="mini"
              placeholder="请选择"
            >
              <el-option
                v-for="dataItem in appName"
                :key="dataItem.id"
                :label="dataItem.name"
                :value="dataItem.id"
              ></el-option>
            </el-select>
          </div>
        </el-col>
        <el-col class="joker-col" :lg="6" :md="8" v-has="'sendTypeSelectBtn'">
          <div class="search-item">
            <span>发送类型</span>
            <el-select
              v-model="search.sendType"
              maxlength="10"
              size="mini"
              placeholder="请选择"
            >
              <el-option
                v-for="dataItem in  this.$selectOptions.sendType"
                :key="dataItem.value"
                :label="dataItem.label"
                :value="dataItem.value"
              ></el-option>
            </el-select>
          </div>
        </el-col>
        <el-col class="joker-col" :lg="6" :md="8" v-has="'sendOrganiSelectBtn'">
          <div class="search-item">
            <span>发送机构</span>
            <el-select
              v-model="search.channelId"
              maxlength="10"
              size="mini"
              placeholder="请选择"
            >
              <el-option
                v-for="dataItem in  organiName"
                :key="dataItem.id"
                :label="dataItem.name"
                :value="dataItem.id"
              ></el-option>
            </el-select>
          </div>
        </el-col>
        <el-col class="joker-col" :lg="6" :md="8" v-has="'sendContentInputBtn'">
          <div class="search-item">
            <span>发送内容</span>
            <el-input
              size="mini"
              v-model="search.content"
              placeholder="搜索发送内容"
            ></el-input>
          </div>
        </el-col>
        <el-col class="joker-col" :lg="6" :md="8" v-has="'sendtypeSelectBtn'">
          <div class="search-item">
            <span>发送状态</span>
            <el-select
              v-model="search.sendState"
              maxlength="10"
              size="mini"
              placeholder="请选择"
            >
              <el-option
                v-for="dataItem in  this.$selectOptions.sendState"
                :key="dataItem.value"
                :label="dataItem.label"
                :value="dataItem.value"
              ></el-option>
            </el-select>
          </div>
        </el-col>
        <el-col class="joker-col" :lg="6" :md="8" v-has="'sendtimeInputBtn'">
          <div class="search-item">
            <span>发送时间</span>
            <el-date-picker
              v-model="search.startTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              size="mini"
              placeholder="选择开始时间"
            >
            </el-date-picker>
            -
            <el-date-picker
              v-model="search.endTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              size="mini"
              placeholder="选择结束"
            >
            </el-date-picker>
          </div>
        </el-col>
        <el-col class="joker-col" :lg="6" :md="8" v-has="'sendPriceInputBtn'">
          <div class="search-item">
            <span>结算价格</span>
            <el-input
              size="mini"
              v-model="search.beginPrice"
              placeholder="开始价格范围"
            ></el-input>
            -
            <el-input
              size="mini"
              v-model="search.endPrice"
              placeholder="结束价格范围"
            ></el-input>
          </div>
        </el-col>
        <el-col class="joker-col" :lg="6" :md="8" v-has="'phoneInputBtn'">
          <el-button
          v-has="'searchBtn'"
            type="primary"
            icon="el-icon-search"
            size="mini"
            @click="doSearch"
            >查询</el-button
          >
          <el-button
          v-has="'resetBtn'"
            type="primary"
            size="mini"
            icon="el-icon-refresh-right"
            @click="resetForm"
            >重置</el-button
          >
        </el-col>
      </el-row>
    </el-card>

    <div class="content-box">
      <el-card shadow="never">
        <el-table
          :data="tableData"
          style="width: 100%"
          :default-sort="{ prop: 'createTime', order: 'ascending' }"
        >
          <el-table-column
            label="序号"
            type="index"
            min-width="100"
          ></el-table-column>
          <el-table-column
            prop="sendTime"
            label="发送时间"
            min-width="180"
          ></el-table-column>
          <el-table-column
            prop="phone"
            label="发送手机号"
            min-width="180"
          ></el-table-column>
          <el-table-column
            prop="applicationName"
            label="应用名称"
            min-width="150"
          ></el-table-column>
          <el-table-column
            prop="sendType"
            label="发送类型"
            min-width="100"
            :formatter="formatType"
          ></el-table-column>
          <el-table-column
            prop="sendPattern"
            label="发送模式"
            :formatter="formatPattern"
            min-width="100"
          ></el-table-column>
          <el-table-column
            prop="channelName"
            label="发送机构"
            min-width="100"
          ></el-table-column>
          <el-table-column
            prop="content"
            label="发送内容"
            min-width="180"
          ></el-table-column>
          <el-table-column
            prop="state"
            label="发送状态"
            min-width="100"
            :formatter="formatstate"
          ></el-table-column>
          <el-table-column
            prop="price"
            label="结算价格"
            min-width="100"
          ></el-table-column>
          <el-table-column
            prop="remark"
            label="备注"
            min-width="180"
          ></el-table-column>
        </el-table>
        <Pagination
        v-has="'sendDetaiPaginationBtn'"
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
import smsDetailApi from "@/api/SMSDetail";
import appApi from "@/api/appApi";
import organiApi from "@/api/organiApi";
import {formatform} from '@/assets/js/tableFormatter'
import _ from "lodash";
import { resetDataAttr } from "@/utils/index.js";
export default {
  mixins: [PageMixins],
  data() {
    return {
      input: "",
      sendTime: "",
      tableData: [],
      search: {},
      appName: [],
      organiName: []
    };
  },
  created() {
    this.getTableData();
    this.getAppName();
    this.getOrganiName();
  },
  methods: {
    getTableData() {
      smsDetailApi
        .getMsgSendLog({
          ...this.search,
          page: {
            current: this.page.start,
            size: this.page.limit
          }
        })
        .then(res => {
          this.tableData = res.data;
          this.page.total = res.page.total;
          this.page.start = res.page.current;
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
      this.getTableData();
    },
    resetForm() {
      resetDataAttr(this, "search");
      this.getTableData();
    },
    getAppName() {
      appApi.getAppAll().then(res => {
        this.appName = res.data;
      });
    },
    getOrganiName() {
      organiApi.getorganiAll().then(res => {
        this.organiName = res.data;
      });
    },
    //格式化表单
    formatType(row) {
      return formatform(row, "sendType", "sendType");
    },
    formatPattern(row) {
      return formatform(row, "sendPattern", "sendPattern");
    },
    formatstate(row) {
      return formatform(row, "sendState", "state");
    }
  },

  components: {
    Pagination
  }
};
</script>
<style lang="scss" scoped>
.customer {
  .search-box {
    .search-item {
      display: flex;
      align-items: center;
      span {
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
