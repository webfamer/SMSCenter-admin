<template>
  <el-dialog
    title="开通服务"
    :visible.sync="dialogVisible"
    width="30%"
    :before-close="handleClose"
  >
    <el-form ref="form" :model="form" label-width="150px">
      <el-form-item label="APP名称：">
        <el-input v-model="form.appChiName" placeholder="请输入客户公司全称"></el-input>
      </el-form-item>
      <el-form-item label="图标：">
        <el-upload
          class="upload-demo"
          action="/api/storage/upload/local/icon"
          :headers = "headers"
          list-type="picture"
        >
          <el-button size="small"  icon="el-icon-s-goods">选择附件</el-button>
          <div slot="tip" class="el-upload__tip">
          支持格式：.JGP .PNG 单个文件不能超过20MB
          </div>
        </el-upload>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="saveForm" icon="el-icon-check"
        >提交</el-button
      >
      <el-button @click="resetForm" icon="el-icon-refresh-right"
        >重置</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
import store from '@/store'
import customerApp from '@/api/custmoerApp'
import { resetDataAttr } from "@/utils/index.js";
export default {
  props:{
    userdata:{
      type:Object
    }
  },
  data() {
    return {
      form: {
        appChiName:'xsz'
      },
      saveNode: "", //存储节点的变量
      value1: [],
      tableData: [],
      
      dialogVisible: false,
      treeData: [],
      headers:{
         Authorization: 'Bearer '+store.getters.token,
        //  'Content-Type':"application/json"
        // 'Content-Type':'multipart/form-data'
      }
    };
  },
  methods: {
    saveForm() {
     customerApp
        .addApp({
          merchantId:this.userdata.id,
          ...this.form
        })
        .then(res => {
          if(res.code===0){
            this.$message({
          message: '添加成功',
          type: 'success'
        });
          this.$emit('getAppItem')
          }
        });
    },
    resetForm() {
      resetDataAttr(this, "form");
      this.dialogVisible = false;
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    openDialog(data) {
      if(data){
        this.$nextTick(res=>{
        this.form = data;

        })
      // console.log(this.form,'传递过来的数据')
      // this.form.appChiName = "panshi"

      }
      this.dialogVisible = true;
      resetDataAttr(this, "form");
    },
    editDialog(data) {
      this.dialogVisible = true;
      resetDataAttr(this, "form");
      console.log(data, "传过来的数据");
      this.getTreeNode();
      this.$nextTick(() => {
        this.$refs.tree.setCheckedKeys(data);
      });
    },
    handleCheckChange() {
      let treeNode = this.$refs.tree.getCheckedNodes(true, true);
      let arrNode = [];
      let arrlabel = [];
      treeNode.forEach(item => {
        console.log(item);
        arrlabel.push(item.label);
        arrNode.push(item);
      });
      this.value1 = arrlabel;
      this.saveNode = arrNode;
    },
    selectChange(e) {
      let newarr = [];
      for (var i = 0; i < this.saveNode.length; i++) {
        for (var j = 0; j < e.length; j++) {
          if (e[j] === this.saveNode[i].label) {
            newarr.push(this.saveNode[i]);
          }
        }
      }
      console.log(newarr, "saveNode");
      this.$refs.tree.setCheckedNodes(newarr);
    }
  },
  created(){
    console.log(this.userdata,'121122')
  }
};
</script>

<style lang="scss" scoped>
.el-select {
  width: 100%;
}
/deep/.datechose {
  .el-date-editor {
    width: 100%;
  }
}
</style>
