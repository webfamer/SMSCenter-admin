<template>
  <div class="apiManage">
    <el-card class="search-box" shadow="hover">
      <p class="title">
        <i class="el-icon-menu"></i>API服务管理
      </p>
    </el-card>

    <div class="content-box">
      <el-card shadow="never">
        <div slot="header" class="clearfix">
          <el-button type="primary" icon="el-icon-plus" @click="add">添加</el-button>
        </div>
        <el-table
          :data="tableData"
          style="width: 100%"
          border
          :default-sort="{ prop: 'date', order: 'descending' }"
        >
          <el-table-column prop="apiChiName" label="API服务名称" width="180"></el-table-column>
          <el-table-column prop="status" label="上架状态" width="180"></el-table-column>
          <el-table-column prop="apiPath" label="API路径"></el-table-column>
          <el-table-column prop="remark" label="描述"></el-table-column>
          <el-table-column prop="gmtModified" label="修改时间" sortable></el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <el-button
                @click="deleteApi(scope.row)"
                type="text"
                icon="el-icon-edit"
                size="small"
              >下架</el-button>
              <el-button
                @click="edit(scope.row)"
                type="text"
                icon="el-icon-s-cooperation"
                size="small"
              >配置</el-button>
            </template>
          </el-table-column>
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
    <Detail ref="detail" @getList="getCustomerList"></Detail>
  </div>
</template>
<script>
import Detail from "./Detail";
import customerApiList from "@/api/customerApi";
import PageMixins from "@/mixins/pageMixins";
import Pagination from "@/components/Pagination/index";
import { resetDataAttr } from "@/utils/index.js";
export default {
  mixins: [PageMixins],
  data() {
    return {
      input: "",
      value1: "",
      tableData: [],
      value: ""
    };
  },
  methods: {
    edit(data) {
      this.$refs.detail.openDialog(data);
    },
    add() {
      this.$refs.detail.openDialog();
    },
    handleSizeChange(v) {
      this.page.limit = v;
      this.getCustomerList();
    },
    handleCurrentChange(v) {
      this.page.start = v;
      this.getCustomerList();
    },
    getCustomerList() {
      console.log(122121);
      customerApiList
        .getApi({
          api: {},
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
    deleteApi(row) {
      console.log(row);
      this.$confirm(
        "<strong>是否删除api?</strong>",
        "确认提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          dangerouslyUseHTMLString: true,
          type: "warning"
        }
      )
        .then(() => {
      customerApiList
        .delApi({
            apiId: row.id,
            status: 99
        })
        .then(res => {
          if (res.code === 0) {
            this.dialogVisible = false;
            this.getCustomerList();
            this.$message({
              message: res.msg,
              type: "success"
            });
          } else {
            this.$message.error(res.msg);
          }
        })
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消停用"
          });
        });
    }
  },
  created() {
    this.getCustomerList();
  },
  components: {
    Detail,
    Pagination
  }
};
</script>
<style lang="scss" scoped>
.apiManage {
  .search-box {
    .title {
      color: #666666;
      font-size: 20px;
      padding-left: 20px;
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
