<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    width="30%"
    :before-close="handleClose"
  >
    <el-form ref="form" :rules="formRules" :model="form" label-width="120px">
      <el-form-item label="公司名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="合作类型" prop="cooperationTypes">
        <el-select
          multiple
          v-model="form.cooperationTypes"
          maxlength="10"
          placeholder="请选择"
        >
          <el-option
            v-for="item in this.$selectOptions.cooperateType"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="说明" prop="remark">
        <el-input type="textarea" autosize v-model="form.remark"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="addCompany('form')">保存</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { resetDataAttr } from "@/utils/index.js";
import companyApi from "@/api/companyApi";
import {
  validatePhone,
  validateChinese,
  validateEnglish
} from "@/utils/validate";
export default {
  data() {
    return {
      form: {
        name: "",
        cooperationType: "",
        remark: ""
      },
      dialogVisible: false,
      title: "添加客户",
      formRules: {
        name: [
          { required: true, message: "请输入中文名称", trigger: "blur" },
          {
            min: 1,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur"
          }
        ],
        cooperationTypes: [
          { required: true, message: "请选择合作类型", trigger: "blur" }
        ],
        description: [
          { required: true, message: "请输入描述信息", trigger: "blur" },
          { min: 3, max: 100, message: "最多输入3-100个字符", trigger: "blur" }
        ]
      }
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
      this.dialogVisible = true;
      if (id) {
        console.log(id, "传过来的数据");
        this.title = "编辑公司"; //切换弹窗标题
        companyApi.getCompanyDetail(id).then(res => {
          this.form = res.data;
          console.log(this.form);
        });
      } else {
        this.title = "新增公司";
        this.$nextTick(() => {
          //新增的时候重置表单就行了
          this.$refs["form"].resetFields();
          resetDataAttr(this, "form");
        });
      }
    },
    addCompany(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {  //和后台要的传值方式有关
          let sum = this.form.cooperationTypes.reduce((num, item, index) => {
            return num + item;
          });
          console.log(sum, "结算总值");
          let params = JSON.parse(JSON.stringify(this.form));
          params.cooperationType = sum;
          if (this.form.id) {
            companyApi
              .eidtCompany({
                ...params
              })
              .then(res => {
                console.log(res);
                if (res.code == 0) {
                  this.dialogVisible = false;
                  this.$message({
                    message: res.message,
                    type: "success"
                  });
                  this.$emit("getList");
                } else {
                  // this.$message.error(res.message);
                }
              });
          } else {
            companyApi
              .addCompany({
                ...params
              })
              .then(res => {
                if (res.code == 0) {
                  this.dialogVisible = false;
                  this.$message({
                    message: "保存成功",
                    type: "success"
                  });
                  this.$emit("getList");
                } else {
                  // this.$message.error(res.message);
                }
              });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
      console.log(this.form, "hahah");
    }
  },
  created() {
    this.username = this.$store.state.userInfo.username;
  }
};
</script>

<style></style>
