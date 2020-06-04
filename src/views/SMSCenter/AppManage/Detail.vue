<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    width="30%"
    :before-close="handleClose"
  >
    <el-form ref="form" :rules="formRules" :model="form" label-width="120px">
      <el-form-item label="应用名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="所属公司" prop="departmentId">
        <el-select
          v-model="form.departmentId"
          maxlength="10"
          placeholder="请输入"
        >
          <el-option
            v-for="item in this.companyNameData"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <div v-for="(item, index) in form.dynamicItem" :key="index">
        <el-form-item
          :label="'白名单ip' + (index + 1)"
          :prop="'dynamicItem.'+index+'.appIp'"
          :rules="[
            { required: true, message: '请输入ip地址', trigger: 'blur' },
            { validator: validateIp, trigger: 'blur' }
          ]"
        >
          <el-row>
            <el-col :span="19" style="margin-right:5px">
              <el-input v-model="item.appIp" size="mini"></el-input>
            </el-col>
            <el-col :span="4">
              <i
                class="el-icon-plus"
                @click="addItem(item, index)"
                style="cursor:pointer;"
              ></i>
              <i
                class="el-icon-delete"
                @click="deleteItem(item, index)"
                style="cursor:pointer"
              ></i>
            </el-col>
          </el-row>
        </el-form-item>
      </div>
      <el-form-item label="当前状态" prop="state">
        <el-select v-model="form.state" maxlength="10" placeholder="请输入">
          <el-option
            v-for="item in this.$selectOptions.cooperateState"
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
      <el-button type="primary" @click="addApp('form')">保存</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { resetDataAttr } from "@/utils/index.js";
import appApi from "@/api/appApi";
import companyApi from "@/api/companyApi";
import { validatePhone, validateIp } from "@/utils/validate";
export default {
  data() {
    return {
      form: {
      dynamicItem: [{ appIp: "" }],
      },
      companyNameData: [],
      dialogVisible: false,
      title: "添加客户",
      validateIp:validateIp,
      formRules: {
        name: [
          { required: true, message: "请输入名称", trigger: "blur" },
          {
            min: 1,
            max: 20,
            message: "长度在 1 到 20 个字符",
            trigger: "blur"
          }
        ],
        departmentId: [
          { required: true, message: "请选择公司", trigger: "blur" }
        ],
        state:[
          { required: true, message: "请选择状态", trigger: "blur" }
        ],
        description: [
          { required: true, message: "请输入描述信息", trigger: "blur" },
          { min: 3, max: 100, message: "最多输入3-100个字符", trigger: "blur" }
        ],
        appIp: [
          { required: true, message: "请输入ip地址", trigger: "blur" },
          { validator: validateIp, trigger: "blur" }
        ],
        phoneNumber: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          { validator: validatePhone, trigger: "blur" }
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
    openDialog(row) {
      this.dialogVisible = true;
      this.getCompanyNameList();
      if (row) {
        this.title = "编辑应用"; //切换弹窗标题
        // this.form = row;
        // this.$nextTick(()=>{
        //   this.dynamicItem = this.processToArr(res.data.appIp);
        // })
        appApi.getAppDetail(row.id).then(res => {
          this.$nextTick(() => {
            this.form = res.data;
            //vue 不允许在已经创建的实例上动态添加新的根级响应式属性 
            this.$set(this.form,'dynamicItem',this.processToArr(res.data.ip))
          });
        });
      } else {
        (this.title = "新增应用"),
          this.$nextTick(() => {
            this.$refs["form"].resetFields();
            resetDataAttr(this, "form");
          });
      }
    },
    getCompanyNameList() {
      companyApi.getAllCompany().then(res => {
        this.$nextTick(() => {
          this.companyNameData = res.data;
        });
      });
    },
    processToString(item) {
      var arr = [];
      item.forEach(item => {
        arr.push(item.appIp);
      });
      return arr.join(",");
    },
    processToArr(item) {
      var arr = [];
      item.split(",").forEach(item => {
        arr.push({ appIp: item });
      });
      console.log(arr, "回显数组");
      return arr;
    },
    addItem() {
      console.log(this.form.dynamicItem)
      this.form.dynamicItem.push({
        appIp: ""
      });
    },
    deleteItem(item, index) {
      if (index > 0) {
        this.form.dynamicItem.splice(index, 1);
      }
    },
    addApp(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let appIp = this.processToString(this.form.dynamicItem);
          if (this.form.id) {
            appApi
              .eidtApp({
                ...this.form,
                appIp
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
            appApi
              .addApp({
                ...this.form,
                appIp
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
