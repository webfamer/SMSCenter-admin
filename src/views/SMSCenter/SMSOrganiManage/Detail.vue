<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    width="30%"
    :before-close="handleClose"
  >
    <el-form ref="form" :rules="formRules" :model="form" label-width="120px">
      <el-form-item label="机构名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="单价：元/条" prop="price">
        <el-input v-model="form.price"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="state">
        <el-select v-model="form.state" maxlength="10" placeholder="请选择">
          <el-option
            v-for="item in this.$selectOptions.cooperateState"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="默认优先级" prop="priority">
        <el-select v-model="form.priority" maxlength="10" placeholder="请选择">
          <el-option
            v-for="item in 3"
            :key="item"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" autosize v-model="form.remark"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="addorgani('form')">保存</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { resetDataAttr } from "@/utils/index.js";
import organiApi from "@/api/organiApi";
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
        priority:'',
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
        price: [
          { required: true, message: "请输入价格", trigger: "blur" },
          {
            min: 1,
            max: 10,
            message: "长度在 1 到 10 个字符",
            trigger: "blur"
          }
        ],
        cooperationType: [
          { required: true, message: "请输入状态", trigger: "blur" }
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
        organiApi.getorganiDetail(id).then(res => {
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
    addorgani(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.form.id) {
            organiApi
              .eidtorgani({
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
            organiApi
              .addorgani({
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
