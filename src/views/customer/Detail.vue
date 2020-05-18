<template>
  <el-dialog title="添加客户" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="客户中文名称">
        <el-input v-model="form.merchantChiName"></el-input>
      </el-form-item>
      <el-form-item label="客户英文名称">
        <el-input v-model="form.merchantEngName"></el-input>
      </el-form-item>
       <el-form-item label="客户描述">
        <el-input v-model="form.description"></el-input>
      </el-form-item>
      <el-form-item label="首联系人">
        <el-input v-model="form.follower"></el-input>
      </el-form-item>
      <el-form-item label="手机号码">
        <el-input v-model="form.phoneNumber"></el-input>
      </el-form-item>
      <!-- <el-form-item label="营业执照">
    <el-upload
  class="upload-demo"
  action="https://jsonplaceholder.typicode.com/posts/"
  :on-preview="handlePreview"
  :on-remove="handleRemove"
  :before-remove="beforeRemove"
  multiple
  :limit="3"
  :on-exceed="handleExceed"
  :file-list="fileList">
  <el-button plain class="el-icon-box">选择附件</el-button>
  <div slot="tip" class="el-upload__tip">支持格式：.JGP .PNG 单个文件不能超过20MB</div>
</el-upload>
      </el-form-item>-->
      <!-- <el-form-item label="负责人员">
        <el-input v-model="form.username" suffix-icon="el-icon-user-solid"></el-input>
      </el-form-item> -->
      <!-- <el-form-item label="接收邮件通知">
     <el-checkbox v-model="checked">邮件通知</el-checkbox>
      <el-input v-model="form.name" placeholder="请输入邮箱，多个邮箱请用；隔开，最多5个"></el-input>
      </el-form-item>-->
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="addCustomerList">保存</el-button>
    </span>
  </el-dialog>
</template>

<script>
import CustomerApi from "@/api/customer.js";
import { resetDataAttr } from "@/utils/index.js";
export default {
  data() {
    return {
      form: {},
      dialogVisible: false
    };
  },
  methods: {
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    openDialog(id) {
      resetDataAttr(this, "form");
      console.log(this.$options.data(), "this.$options.data");
      if (id) {
        CustomerApi.getCustomerDetail({
            merchantId:id
        }).then(res => {
          if (res.code === 0) {
            this.form = res.data;
          }
        });
      }
      this.dialogVisible = true;
    },
    addCustomerList() {
      console.log(this.form, "hahah");
      if (this.form.id) {
        CustomerApi.eidtCustomer({
            merchantId: this.form.id,
            ...this.form
        }).then(res => {
          console.log(res);
          if (res.code === 0) {
            this.dialogVisible = false;
            this.$message({
              message: res.msg,
              type: "success"
            });
            this.$emit("getList");
          } else {
            this.$message.error(res.msg);
          }
        });
      } else {
        CustomerApi.addCustomer({
            ...this.form,
        }).then(res => {
          if (res.code === 0) {
            this.dialogVisible = false;
            this.$message({
              message: "保存成功",
              type: "success"
            });
            this.$emit("getList");
          } else {
            this.$message.error(res.msg);
          }
        });
      }
    }
  },
  created() {
    this.username = this.$store.state.userInfo.username;
  }
};
</script>

<style></style>
