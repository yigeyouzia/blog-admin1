<template>
  <!-- 新增博客组件 -->
  <div>
    <!-- 新增修改弹窗 -->
    <Window
      :show="windowConfig.show"
      :buttons="windowConfig.buttons"
      @close="closeWindow"
    >
      <el-form :model="blogFormData" ref="blogFormRef" :rules="rules">
        <el-form-item prop="title">
          <!-- 套一层重写input框样式 -->
          <div class="title-input">
            <el-input
              placeholder="请输入博客标题"
              v-model="blogFormData.title"
            ></el-input>
          </div>
        </el-form-item>
        <el-form-item prop="markdownContent">
          <!-- 必须套一层 -->
          <div :style="{ width: '100%' }">
            <EditorHtml
              v-model="blogFormData.content"
              :height="editorHTMLHeight"
              v-if="blogFormData.editorType == 0"
            ></EditorHtml>
            <EditorMarkdown
              v-else
              v-model="blogFormData.markdownContent"
              :height="editorMDHeight"
              @htmlContent="setHtmlContent"
            ></EditorMarkdown>
          </div>
        </el-form-item>
      </el-form>
      <!-- 弹框 -->
      <Dialog
        :show="dialogConfig.show"
        :title="dialogConfig.title"
        :buttons="dialogConfig.buttons"
        width="800px"
        @close="dialogConfig.show = false"
      >
        <el-form
          :model="blogFormData"
          :rules="rules"
          ref="settingsFormRef"
          label-width="80px"
          class="blog-setting-form"
        >
          <!-- 分类 -->
          <el-form-item prop="categoryId" label="博客分类">
            <el-select
              v-model="blogFormData.categoryId"
              class="m-2"
              clearable
              placeholder="请选择分类"
              :style="{ width: '100%' }"
            >
              <el-option
                :label="item.categoryName"
                :value="item.categoryId"
                v-for="(item, index) in categoryList"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- 文件上传 -->
          <el-form-item prop="cover" label="封面">
            <CoverUpload v-model="blogFormData.cover"></CoverUpload>
          </el-form-item>
          <!-- 类型 -->
          <el-form-item prop="type" label="博客类型">
            <el-radio-group v-model="blogFormData.type">
              <el-radio :label="0">原创</el-radio>
              <el-radio :label="1">转载</el-radio>
            </el-radio-group>
          </el-form-item>
          <!-- 地址 -->
          <el-form-item
            prop="reprintUrl"
            label="原文地址"
            v-if="blogFormData.type == 1"
          >
            <el-input
              placeholder="请输入原文地址"
              v-model="blogFormData.reprintUrl"
              :autosize="{ minRows: 4, maxRows: 4 }"
            >
            </el-input>
          </el-form-item>
          <!-- 评论 -->
          <el-form-item
            prop="allowComment"
            label="评论"
            v-model="blogFormData.type"
          >
            <div class="allow-comment">
              <el-radio-group v-model="blogFormData.allowComment">
                <el-radio :label="1">允许</el-radio>
                <el-radio :label="0">不允许</el-radio>
              </el-radio-group>
              <span class="info"
                >请先在评论设置里设置好相应参数,评论才会生效</span
              >
            </div>
          </el-form-item>
          <!-- 简介 -->
          <el-form-item label="简介" prop="summary">
            <el-input
              placeholder="博客摘要"
              v-model="blogFormData.summary"
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 4 }"
            >
            </el-input>
          </el-form-item>
          <!-- 标签 -->
          <el-form-item label="简介" prop="categoryDesc">
            <div class="tag-input-panel">
              <div class="tag-list">
                <el-tag
                  v-for="(item, index) in blogFormData.tag"
                  :key="index"
                  @close="closeTag(index)"
                  class="tag-item"
                  closable
                  >{{ item }}</el-tag
                >
              </div>
              <span class="info" v-if="blogFormData.tag.length == 0"
                >添加标签更容易被搜索引擎收录</span
              >
              <span
                class="iconfont icon-add"
                @click="showTagInputHandler"
                v-if="!showTagInput"
              ></span>
              <el-input
                class="tag-input"
                v-if="showTagInput"
                v-model="tagInputValue"
                @blur="saveTagInput"
                @keyup.enter="saveTagInput"
              ></el-input>
            </div>
          </el-form-item>
        </el-form>
      </Dialog>
    </Window>
  </div>
</template>

<script setup>
import {
  ref,
  reactive,
  nextTick,
  getCurrentInstance,
  onMounted,
  onUnmounted,
} from "vue";
const { proxy } = getCurrentInstance();
const editorMDHeight = window.innerHeight - 60 - 20 - 30 - 50 - 10 - 70;
const editorHTMLHeight = window.innerHeight - 60 - 20 - 30 - 50 - 100 - 70;

const api = {
  loadDataList: "/category/loadAllCategory4Blog",
  saveBlog: "/blog/saveBlog",
  getUserInfo: "getUserInfo",
  getBlogDetail: "/blog/getBlogById",
  autoSave: "/blog/autoSaveBlog",
};
const init = (type, data) => {
  startTimer();
  windowConfig.show = true; // 打开博客编辑栏
  nextTick(() => {
    // blogFormRef.value.resetFields();
    blogFormData.value = { tag: [] };
    if (type == "add") {
      getUserInfo();
    } else {
      getBlogDetail(data.blogId);
    }
  });
};

defineExpose({ init });

const getUserInfo = async () => {
  let result = await proxy.Request({
    url: api.getUserInfo,
  });
  if (!result) {
    return;
  }
  blogFormData.value.editorType = result.data.editorType;
};

// 根据id获取博客详情
const getBlogDetail = async (blogId) => {
  let result = await proxy.Request({
    url: api.getBlogDetail,
    params: {
      blogId: blogId,
    },
  });
  if (!result) {
    return;
  }
  blogFormData.value = result.data;
  // tag分割|
  if (result.data.tag) {
    blogFormData.value.tag = result.data.tag.split("|");
  } else {
    blogFormData.value.tag = [];
  }
  // console.log(blogFormData.value);
};
// 自动保存
let timmer = ref(null);
const startTimer = () => {
  timmer.value = setInterval(() => {
    autoSave();
  }, 10000);
};

const cleanTimer = () => {
  if (timmer.value !== null) {
    clearInterval(timmer.value);
    timmer.value = null;
  }
};
const autoSave = async () => {
  // 如果标题内容为空  不用保存
  if (
    blogFormData.value.title == undefined ||
    blogFormData.value.content == undefined ||
    timmer.value == null ||
    dialogConfig.show
  ) {
    return;
  }
  const params = {};
  Object.assign(params, blogFormData.value);
  let result = await proxy.Request({
    url: api.autoSave,
    showLoading: false,
    params: params,
  });
  if (!result) {
    return;
  }
  blogFormData.value.blogId = result.data;
};

// 新增修改弹框
const windowConfig = reactive({
  show: false,
  buttons: [
    {
      type: "danger",
      text: "确定",
      click: (e) => {
        showSettings();
      },
    },
  ],
});

const emit = defineEmits();
const closeWindow = () => {
  windowConfig.show = false;
  emit("callBack");
  if (timmer.value != null) {
    cleanTimer();
  }
};

// 1.markdown 博客正文
const blogFormRef = ref();
const blogFormData = ref({ tag: [] }); // 博客数据
// markdown编辑器设置html内容
const setHtmlContent = (htmlContent) => {
  blogFormData.value.content = htmlContent;
};
// 展示配置弹框
const showSettings = () => {
  blogFormRef.value.validate(async (valid) => {
    if (!valid) {
      return;
    }
    dialogConfig.show = !dialogConfig.show;
  });
  // console.log(dialogConfig.show);
};
const rules = {
  title: [{ required: true, message: "请选择文章标题" }],
  markdownContent: [{ required: true, message: "请选择文章内容" }],
  categoryId: [{ required: true, message: "请选择博客分类" }],
  cover: [{ required: true, message: "请选择博客封面" }],
  reprintUrl: [{ required: true, message: "请输入原文地址" }],
  allowComment: [{ required: true, message: "请选择是否允许评论" }],
};

// 2.配置弹框 提交新增博客
const dialogConfig = reactive({
  show: false,
  title: "博客设置",
  buttons: [
    {
      type: "danger",
      text: "确定",
      click: (e) => {
        // 提交表单
        submitBlog();
      },
    },
  ],
});

// 博客数据 默认有tag属性
// const blogFormData = ref({ tag: [] });
const categoryList = ref([]); // 博客分类数据

const loadCategoryList = async () => {
  let result = await proxy.Request({
    url: api.loadDataList,
  });
  if (!result) {
    return;
  }
  categoryList.value = result.data;
};

onMounted(() => {
  loadCategoryList();
});
onUnmounted(() => {
  cleanTimer();
});
// 标签关闭 并且删除form里的数据
const showTagInput = ref(false);
const closeTag = (index) => {
  blogFormData.value.tag.splice(index, 1);
  // console.log(blogFormData.value.tag);
};
// 添加标签
const showTagInputHandler = () => {
  showTagInput.value = true;
};
// 标签输入框内容
const tagInputValue = ref(null);
// 失去焦点或者按下enter保存标签
const saveTagInput = () => {
  showTagInput.value = false; // input 框关闭
  if (tagInputValue.value) {
    if (blogFormData.value.tag.indexOf(tagInputValue.value) === -1) {
      blogFormData.value.tag.push(tagInputValue.value);
    } else {
      proxy.message.warning("重复");
    }
  }
  tagInputValue.value = undefined; // 清空input值
};

// 提交表单
const settingsFormRef = ref();
const submitBlog = () => {
  settingsFormRef.value.validate(async (valid) => {
    if (!valid) {
      return;
    }
    // let params = {
    //   blogId: blogFormData.blogId,
    //   title: blogFormData.title,
    //   markdownContent: blogFormData.markdownContent,
    //   content: blogFormData.content,
    //   editorType: 1,
    // };
    let params = {};
    Object.assign(params, blogFormData.value);
    // console.log(blogFormData.value);
    params.tag = params.tag.join("|");
    // Object.assign(params, blogFormData.value);
    let result = await proxy.Request({
      url: api.saveBlog,
      params,
    });
    if (!result) {
      return;
    }
    // dialogConfig.show = false;
    proxy.message.success("博客保存成功");
    closeWindow();
    emit("callBack");
  });
};
</script>

<style lang="scss">
.el-form-item.is-error .el-input__wrapper {
  box-shadow: none;
}
.title-input {
  width: 100%;
  border-bottom: 1px solid #ddd;
  .el-input__wrapper {
    box-shadow: none;
  }

  input {
    font-size: 18px;
  }
}
// 评论
.blog-setting-form {
  .allow-comment {
    display: flex;
    .info {
      margin-left: 10px;
      color: rgb(175, 175, 175);
      font-size: 13px;
    }
  }
  //   标签
  .tag-input-panel {
    display: flex;
    align-items: center;
    // 标签排列
    .tag-list {
      display: flex;
      .tag-item {
        margin-right: 10px;
      }
    }
    .info {
      color: rgb(175, 175, 175);
      font-size: 13px;
      margin-right: 10px;
    }
    .icon-add {
      margin-right: 10px;
      color: red;
      cursor: pointer;
    }
    .tag-input {
      width: 100px;
    }
  }
}
</style>
