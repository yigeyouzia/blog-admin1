<template>
  <div>
    <el-form
      :model="formData"
      :rules="rules"
      ref="formDataRef"
      label-width="100px"
    >
      <el-row :gutter="10">
        <el-col :span="8">
          <!-- 文件上传 -->
          <el-form-item prop="avatar" label="头像">
            <CoverUpload
              v-model="formData.avatar"
              @callback="saveAvatar"
            ></CoverUpload>
          </el-form-item>
          <el-form-item label="昵称" prop="nickname">
            <el-input placeholder="请输入昵称" v-model="formData.nickName">
            </el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input placeholder="请输入手机号" v-model="formData.phone">
            </el-input>
          </el-form-item>
          <el-form-item label="密码">
            <a
              href="javascript:void(0)"
              class="a-link"
              @click="showUpdatePassword"
              >修改密码</a
            >
          </el-form-item>
          <el-form-item label="默认编辑器" prop="editorType">
            <el-radio-group v-model="formData.editorType">
              <el-radio :label="0">富文本编辑器</el-radio>
              <el-radio :label="1">MarkDown编辑器</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="职业" prop="profession">
            <el-input placeholder="请输入职业" v-model="formData.profession">
            </el-input>
          </el-form-item>
          <el-form-item label="" prop="editorType">
            <el-button type="danger" @click="saveMy">保存</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item label="简介" prop="introduction"> </el-form-item>
          <EditorHtml v-model="formData.introduction"></EditorHtml>
        </el-col>
      </el-row>
    </el-form>
    <!-- form -->
    <Dialog
      :show="dialogConfig.show"
      :title="dialogConfig.title"
      :buttons="dialogConfig.buttons"
      width="400px"
      @close="dialogConfig.show = false"
    >
      <el-form
        :model="passwordFormData"
        :rules="rules"
        ref="passwordFormRef"
        label-width="80px"
      >
        <el-form-item label="密码" prop="password">
          <el-input
            placeholder="请输入密码"
            type="password"
            v-model="passwordFormData.password"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="重复密码" prop="rePassword">
          <el-input
            placeholder="请再次输入密码"
            type="password"
            v-model="passwordFormData.rePassword"
          >
          </el-input>
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>

<script setup>
import { getCurrentInstance, ref, reactive, nextTick } from "vue";
import { useStore } from "vuex";
const store = useStore();
const { proxy } = getCurrentInstance();
const api = {
  getUserInfo: "getUserInfo",
  saveMyInfo: "saveMyInfo",
  updateMyPassword: "updateMyPassword",
  saveAvatar: "saveAvatar",
};

// 重复密码校验
const validateRePass = (rule, value, callback) => {
  if (value !== passwordFormData.value.password) {
    callback(new Error(rule.message));
  } else {
    callback();
  }
};

const rules = {
  nickName: [{ required: true, message: "昵称不能为空" }],
  editorType: [{ required: true, message: "请选择默认编辑器" }],
  password: [
    { required: true, message: "请输入密码" },
    {
      validator: proxy.Verify.password,
      message: "密码最少8位，只能数字字母和特殊字符",
    },
  ],
  rePassword: [
    { required: true, message: "请再次输入密码" },
    {
      validator: validateRePass,
      message: "两次输入的密码不一致",
    },
  ],
  phone: [
    { required: true, message: "请输入手机号" },
    {
      validator: proxy.Verify.phone,
      trigger: "blur",
      message: "请输入正确的手机号",
    },
  ],
};
const formData = ref({});
// 数据获取
const getUserInfo = async () => {
  let result = await proxy.Request({
    url: api.getUserInfo,
  });
  if (!result) {
    return;
  }
  formData.value = result.data;
  // console.log(formData.value);
};
getUserInfo();

// 提交修改
const formDataRef = ref(null);
const saveMy = async () => {
  formDataRef.value.validate(async (valid) => {
    if (!valid) {
      return;
    }
    let result = await proxy.Request({
      url: api.saveMyInfo,
      params: {
        avatar: formData.value.avatar,
        nickName: formData.value.nickName,
        phone: formData.value.phone,
        editorType: formData.value.editorType,
        profession: formData.value.profession,
        introduction: formData.value.introduction,
      },
    });
    if (!result) {
      return;
    }
    proxy.message.success("保存成功");
    // store commit
    store.commit("updateUserInfo", {
      nickName: formData.value.nickName,
      avatar: formData.value.avatar,
    });
  });
};

// 修改头像
const saveAvatar = async (avatar) => {
  let result = await proxy.Request({
    url: api.saveAvatar,
    params: {
      avatar: avatar,
    },
  });
  if (!result) {
    return;
  }
  proxy.message.success("头像修改成功");
  // store commit
  store.commit("updateUserInfo", {
    nickName: formData.value.nickName,
    avatar: avatar,
  });
};

// 修改密码
const passwordFormData = ref({});
const passwordFormRef = ref(null);

const dialogConfig = reactive({
  show: false,
  title: "修改密码",
  buttons: [
    {
      type: "danger",
      text: "确定",
      click: (e) => {
        submitPass();
      },
    },
  ],
});
const showUpdatePassword = () => {
  dialogConfig.show = true;
  nextTick(() => {
    passwordFormRef.value.resetFields();
    passwordFormData.value = {};
  });
};
// 提交密码方法
const submitPass = () => {
  passwordFormRef.value.validate(async (valid) => {
    if (!valid) {
      return;
    }
    let result = await proxy.Request({
      url: api.updateMyPassword,
      params: {
        password: passwordFormData.value.password,
      },
    });
    if (!result) {
      reutrn;
    }
    dialogConfig.show = false;
    proxy.message.success("密码修改成功");
  });
};
</script>

<style lang="scss" scoped>
</style>

