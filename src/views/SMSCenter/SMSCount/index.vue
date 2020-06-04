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
        <div slot="header" class="clearfix">
          <el-button
            type="primary"
            icon="el-icon-plus"
            size="mini"
            style="float:right"
            @click="downloadExcel"
            v-has="'downloadExcel'"
            >下载表单</el-button
          >
        </div>
        <el-table
          :data="tableData"
          style="width: 100%"
          :default-sort="{ prop: 'createTime', order: 'ascending' }"
        >
          <!-- <el-table-column type="expand">
            <template slot-scope="props">
              <el-row>
                <el-col :span="5" class="tagLine">渠道名称</el-col>
                <el-col :span="3" class="tagLine"> 价格</el-col>
              </el-row>
              <el-row
                v-for="(item, index) in props.row.channelPriceVOS"
                :key="index"
              >
                <el-col :span="5" class="tagLine">{{
                  item.channelName
                }}</el-col>
                <el-col :span="3" class="tagLine">{{ item.price }}</el-col>
              </el-row>
            </template>
          </el-table-column> -->
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
          <el-table-column
            v-for="(item, index) in tableDataHeader"
            :key="index"
            :prop="item.prop"
            :label="item.col"
          >
          </el-table-column>
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
      channelName: "",
      search: {
        time: []
      },
      tableDataHeader: []
    };
  },
  created() {
    this.getTableData();
    this.getdatatime();
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
    ProcessTableData(data) {
      for (var i = 0; i < data.length; i++) {
        let newObj = {};
        data[i].channelPrices.forEach((item, index) => {
          newObj["price" + index] = item;
        });
        data[i] = { ...data[i], ...newObj };
      }
      return data;
    },
    createTabelHead(data) {
      data.forEach((item, index) => {
        this.tableDataHeader.push({ col: item, prop: "price" + index });
      });
    },
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
          if (this.tableDataHeader.length == 0) {
            this.createTabelHead(res.data.channelName);
          }
          this.tableData = this.ProcessTableData(res.data.smsStatisTicsList);
          // this.page.total = res.page.total;
          // this.page.start = res.page.current;
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
    dateFormat(fmt, date) {
      let ret;
      const opt = {
        "Y+": date.getFullYear().toString(), // 年
        "m+": (date.getMonth() + 1).toString(), // 月
        "d+": date.getDate().toString(), // 日
        "H+": date.getHours().toString(), // 时
        "M+": date.getMinutes().toString(), // 分
        "S+": date.getSeconds().toString() // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
      };
      for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
          fmt = fmt.replace(
            ret[1],
            ret[1].length == 1 ? opt[k] : opt[k].padStart(ret[1].length, "0")
          );
        }
      }
      return fmt;
    },
    getdatatime() {
      //默认显示今天
      let date = new Date();
      let formatdate = this.dateFormat("YYYY-mm-dd", date);
      this.search.time = [formatdate, formatdate];
    },

    downloadExcel() {
      smsDetailApi
        .exportExcel({
          startTime: this.search.time[0],
          endTime: this.search.time[1]
        })
        .then(res => {
          const blob = new Blob([res]); //new Blob([res])中不加data就会返回下图中[objece objece]内容（少取一层）
          const fileName = "导出明细.xlsx"; //下载文件名称
          const elink = document.createElement("a");
          elink.download = fileName;
          elink.style.display = "none";
          elink.href = URL.createObjectURL(blob);
          document.body.appendChild(elink);
          elink.click();
          URL.revokeObjectURL(elink.href); // 释放URL 对象
          document.body.removeChild(elink);
        })
        .catch(err => {
          console.log(err);
        });
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
