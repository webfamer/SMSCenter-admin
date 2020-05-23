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
      <el-form-item label="产品名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="短信机构" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="单价：元/条" prop="name">
        <el-input v-model="form.price"></el-input>
      </el-form-item>
      <el-form-item label="合作状态" prop="cooperationType">
        <el-select v-model="form.state" maxlength="10" placeholder="请选择">
          <el-option
            v-for="item in this.$selectOptions.cooperateType"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="切换设置" prop="priority">
        <el-select v-model="form.priority" maxlength="10" placeholder="请选择">
          <el-option
            v-for="item in this.$selectOptions.cooperateType"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="优先级1" size="mini" prop="priority">
        <el-select v-model="form.priority" maxlength="10" placeholder="请选择">
          <el-option
            v-for="item in this.$selectOptions.cooperateType"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="优先级2" size="mini" prop="priority">
        <el-select v-model="form.priority" maxlength="10" placeholder="请选择">
          <el-option
            v-for="item in this.$selectOptions.cooperateType"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="优先级3" size="mini" prop="priority">
        <el-select v-model="form.priority" maxlength="10" placeholder="请选择">
          <el-option
            v-for="item in this.$selectOptions.cooperateType"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
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
import cooperateApi from "@/api/cooperateApi";
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
        cooperationType: [
          { required: true, message: "请选择时区", trigger: "blur" }
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
        this.title = "编辑客户"; //切换弹窗标题
        cooperateApi.getCooperationDetail(id).then(res => {
          this.$nextTick(() => {
            this.form = res.data;
          });
        });
      } else {
        this.title = "新增客户";
        this.$nextTick(() => {
          //新增的时候重置表单就行了
          this.$refs["form"].resetFields();
          resetDataAttr(this, "form");
        });
      }
    },
    addCompany(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.form.id) {
            companyApi
              .eidtCompany({
                ...this.form
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
                  this.$message.error(res.message);
                }
              });
          } else {
            companyApi
              .addCompany({
                ...this.form
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
                  this.$message.error(res.message);
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
};
</script>

<style></style>
