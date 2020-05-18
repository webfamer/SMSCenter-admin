<template>
  <div class="customer">
    <el-card class="search-box" shadow="hover">
      <el-row :gutter="20">
        <el-col :span="3" :offset="1">
          <div class="block">
            <el-input v-model="input" placeholder="姓名/手机/邮箱"></el-input>
          </div>
        </el-col>
        <el-col :span="3" :offset="1">
            <el-select v-model="value" placeholder="请选择">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
        </el-col>
        <el-col :span="4" :offset="1" :lg="6" :md="8">
          <el-button type="primary" icon="el-icon-search">查询</el-button>
          <el-button type="primary" icon="el-icon-refresh-right">重置</el-button>
        </el-col>
      </el-row>
    </el-card>

    <div class="content-box">
      <el-card shadow="never">
        <div slot="header" class="clearfix">
          <el-button type="primary" icon="el-icon-plus" @click="add">新增</el-button>
        </div>
        <el-table
          :data="tableData"
          style="width: 100%"
          :default-sort="{ prop: 'date', order: 'descending' }"
        >
          <el-table-column prop="date" label="日期" sortable width="180"></el-table-column>
          <el-table-column prop="name" label="姓名" sortable width="180"></el-table-column>
          <el-table-column prop="address" label="地址" :formatter="formatter"></el-table-column>
          <el-table-column fixed="right" label="操作" width="200">
            <template slot-scope="scope"> 
              <el-button @click="edit(scope.row)" type="text" icon="el-icon-s-tools" size="small">设置</el-button>
              <!-- <el-popover placement="right" width="400" trigger="click">
                <el-button type="text" size="small" icon="el-icon-remove">停用</el-button>
              </el-popover> -->
                <el-popover
    placement="bottom"
    width="200"
    trigger="click">
     <div style="display:flex;flex-direction:column">
    <el-button size="mini" type="primary" @click="closeCustomer">停用员工</el-button>
    <el-button type="primary" size="mini" @click="openCustomer" style="margin-top:6px;margin-left:0px">启用员工</el-button>
  </div>
    <el-button type="text" slot="reference" size="small" icon="el-icon-remove">停用</el-button>
  </el-popover>
   <el-button
                @click="handleClick(scope.row)"
                type="text"
                icon="el-icon-delete-solid"
                size="small"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="block" style="float:right; margin-top:30px;margin-bottom:30px;">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage2"
            :page-sizes="[100, 200, 300, 400]"
            :page-size="100"
            layout="sizes, prev, pager, next"
            :total="1000"
          ></el-pagination>
        </div>
      </el-card>
    </div>
    <Detail ref="detail"></Detail>
  </div>
</template>
<script>
import Detail from "./Detail";
export default {
  data() {
    return {
      input: "",
      value1: "",
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄"
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄"
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄"
        }
      ],
         options: [{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }],
        value: ''
      
    };
  },
  methods: {
    formatter(row, column) {
      //表格排序
      return row.address;
    },
    edit() {
      this.$refs.detail.openDialog();
    },
    add() {
      this.$refs.detail.openDialog();
    },
     closeCustomer() {
         this.$confirm('<strong>是否确定停用客户?</strong><br>停用客户后无法使用所有服务', '确认提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          dangerouslyUseHTMLString: true,
          type: 'warning',
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },
      openCustomer(){
         this.$confirm('<strong>是否确定启用客户?</strong><br>启用后恢复服务的使用', '确认提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          dangerouslyUseHTMLString: true,
          type: 'warning',
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      }
  },
  components: {
    Detail
  }
};
</script>
<style lang="scss" scoped>
.customer {

  .content-box {
    margin: 30px;
    box-sizing: border-box;
    .pagination {
      margin-top: 30px;
    }
  }
}
</style>
