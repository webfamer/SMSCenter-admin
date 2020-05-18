<template>
  <div class="apiManage">
    <el-card class="search-box" shadow="hover">
    <p class="title">
          <i class="el-icon-menu"></i>API组服务管理
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
          <el-table-column prop="groupChiName" label="API分组名称"  width="180"></el-table-column>
          <el-table-column prop="apiCount" label="包含API数"  width="180"></el-table-column>
          <el-table-column prop="description" label="描述" ></el-table-column>
          <el-table-column prop="gmtModified" label="修改时间" ></el-table-column>
          <el-table-column  label="操作" width="150" >
            <template slot-scope="scope" >
                <el-button
                @click="deleteApiGroup(scope.row)"
                type="text"
                icon="el-icon-edit"
                size="small"
              >删除</el-button>
              <el-button  type="text" icon="el-icon-s-shop" size="small" @click="edit(scope.row)">配置</el-button>
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
    <Detail ref="detail" @getList="getCustomerGroup"></Detail>
  </div>
</template>
<script>
import Detail from "./Detail";
import customerApiGroup from '@/api/customerGroupApi'
import PageMixins from "@/mixins/pageMixins";
import Pagination from "@/components/Pagination/index";
import {resetDataAttr} from '@/utils/index.js'
export default {
     mixins:[PageMixins],
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
      console.log(data)
      this.$refs.detail.openDialog(data);
    },
    add() {
      this.$refs.detail.openDialog();
    },
    deleteApiGroup(row) {
      this.$confirm(
        "<strong>是否删除api组?</strong>",
      "确认提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          dangerouslyUseHTMLString: true,
          type: "warning"
        }
      )
        .then(() => {
customerApiGroup
        .delApiGroup({
            groupId: row.id,
            status: 99
        })
        .then(res => {
          if (res.code === 0) {
            this.getCustomerGroup();
            this.$message({
              message: "删除成功",
              type: "success"
            });
          } else {
            this.$message.error(res.msg);
          }
        });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消停用"
          });
        });
    },
     handleSizeChange(v){
        this.page.limit = v;
        this.getCustomerGroup();
    },
    handleCurrentChange(v){
      this.page.start = v;
        this.getCustomerGroup();
    },
       getCustomerGroup() {
      console.log(122121);
      customerApiGroup.getApiGroup({
      pageVo:{
        currentPage:this.page.start,
        pageSize:this.page.limit
      }
      }).then(res => {
        this.tableData = res.data.records;
        this.page.total=res.data.totalPage;
        this.page.start = res.data.currentPage;
      });
    },
  },
  created(){
this.getCustomerGroup()
  },
  components: {
    Detail,Pagination
  }
};
</script>
<style lang="scss" scoped>
.apiManage {
  .search-box{
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
