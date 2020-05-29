<template>
  <div class="customer">
    <el-card class="search-box" shadow="hover">
      <el-row :gutter="20">
        <el-col class="joker-col" :lg="6" :md="8" v-has="'sendtimeInputBtn'">
          <div class="search-item">
            <span>发送时间</span>
            <el-date-picker
              v-model="search.time"
              type="daterange"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions"
              size="mini"
              placeholder="选择开始时间"
            >
            </el-date-picker>
          </div>
        </el-col>
        <el-col class="joker-col" :lg="6" :md="8">
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
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-row
              >
                <el-col :span="5" class="tagLine">渠道名称</el-col>
                <el-col :span="3" class="tagLine"> 价格</el-col>
              </el-row>
              <el-row
                v-for="(item, index) in props.row.channelPriceVOS"
                :key="index"
              >
                <el-col :span="5"   class="tagLine">{{ item.channelName }}</el-col>
                <el-col :span="3"   class="tagLine">{{ item.price }}</el-col>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column
            prop="time"
            label="日期"
            min-width="150"
          ></el-table-column>
          <el-table-column
            prop="departmentName"
            label="部门"
            min-width="150"
          ></el-table-column>
          <el-table-column
            prop="totalNum"
            label="发送总量"
            min-width="100"
          ></el-table-column>
          <el-table-column
            prop="successNum"
            label="成功"
            min-width="100"
          ></el-table-column>
          <el-table-column
            prop="errorNum"
            label="失败"
            min-width="100"
          ></el-table-column>
          <el-table-column
            prop="successRate"
            label="成功率"
            min-width="100"
          ></el-table-column>
          <el-table-column
            prop="price"
            label="结算总金额"
            min-width="100"
          ></el-table-column>
        </el-table>
        <!-- <Pagination
          :page="page"
          @sizeChange="handleSizeChange"
          @currentChange="handleCurrentChange"
        ></Pagination> -->
      </el-card>
    </div>
  </div>
</template>
<script>
import PageMixins from "@/mixins/pageMixins";
import Pagination from "@/components/Pagination/index";
import smsDetailApi from "@/api/SMSDetail";
import _ from "lodash";
import { resetDataAttr } from "@/utils/index.js";
export default {
  mixins: [PageMixins],
  data() {
    return {
      input: "",
      sendTime: "",
      tableData: [],
      search: {
        time: []
      }
    };
  },
  created() {
    this.getTableData();
  },
  computed: {
    pickerOptions() {
      let _this = this;
      return {
        disabledDate(time) {
          const times = 86400000 * 15; //一周的毫秒数
          let curSelectTime = new Date(_this.minDate).getTime();
          let before = curSelectTime - times; //前一周毫秒数
          let after = curSelectTime + times; //后一周毫秒数
          return time.getTime() > after || time.getTime() < before;
        },
        onPick({ maxDate, minDate }) {
          if (!maxDate) {
            _this.minDate = minDate;
          }
        }
      };
    }
  },
  methods: {
    getTableData() {
      let params = {
        startTime: this.search.time[0],
        endTime: this.search.time[1],
        ...this.search
      };
      smsDetailApi
        .getMsgSendCount({
          ...params,
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
  .tagLine {
    border-bottom: 1px solid #ccc;
    margin-bottom: 10px;
    height: 30px;
  }
}
</style>
