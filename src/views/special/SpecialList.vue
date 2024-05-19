<template>
  <div>
    <el-button type="danger" @click="showEdict('add')">新增分类</el-button>
    <el-row :gutter="10" :style="{ 'margin-top': '10px' }">
      <el-col :span="14">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>专题</span>
            </div>
          </template>
          <Table
            :columns="columns"
            :showPagination="true"
            :dataSource="tableData"
            :fetch="loadDataList"
            :options="tableOptions"
            @rowClick="rowClick"
            ref="dataTableRef"
          >
            <template #cover="{ row }">
              <!-- 图片 -->
              <Cover :cover="row.cover"></Cover>
            </template>
            <template #op="{ row }">
              <div class="op">
                <a
                  href="javascript:void(0)"
                  class="a-link"
                  @click="showEdict('update', row)"
                  v-if="userInfo.userId == row.userId"
                  >修改</a
                >
                <span v-else>--</span>
                <el-divider direction="vertical" />
                <a
                  href="javascript:void(0)"
                  class="a-link"
                  @click="del(row)"
                  v-if="userInfo.userId == row.userId"
                  >删除</a
                >
                <span v-else>--</span>
                <el-divider direction="vertical" />
                <!-- 如果是第一个 不能上移 not-allow -->
              </div>
            </template>
          </Table>
        </el-card>
      </el-col>
      <el-col :span="10">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>专题</span>
            </div>
          </template>
          <!-- tree -->
          <div :style="{ 'margin-bottom': '5px' }">
            <el-alert
              title="红色代表草稿绿色代表已发布、拖动文章修改排序"
              type="info"
              show-icon
              :closable="false"
            />
          </div>
          <div class="special-blog-tree">
            <el-tree
              class="tree-panel"
              ref="refTree"
              :data="blogList"
              defaultExpandAll
              node-key="blogId"
              :expand-on-click-node="false"
              :props="treeProps"
              :highlight-current="true"
              draggable
              @node-drop="blogDrag"
            >
              <template #default="{ data }">
                <span class="custom-node-style">
                  <span class="node-title">
                    <!-- 草稿 -->
                    <span
                      v-if="data.status == 0"
                      :style="{ color: 'red', 'font-size': '13px' }"
                    >
                      {{ data.title }}</span
                    >
                    <span
                      v-else
                      :style="{ color: 'green', 'font-size': '13px' }"
                    >
                      {{ data.title }}</span
                    >
                  </span>
                  <span class="node-op">
                    <template v-if="data.blogId === '0'">
                      <a
                        class="a-link"
                        href="javascript:void(0)"
                        @click="editBlog('add', data)"
                        >新增文章</a
                      >
                    </template>
                    <template v-else>
                      <a
                        class="a-link"
                        href="javascript:void(0)"
                        @click="showDetail(data)"
                        >预览</a
                      >
                      <el-divider direction="vertical" />
                      <a
                        class="a-link"
                        href="javascript:void(0)"
                        @click="editBlog('edit', data)"
                        v-if="
                          userInfo.userId == data.userId ||
                          userInfo.roleType == 1
                        "
                        >修改</a
                      >
                      <span v-else>--</span>
                      <el-divider direction="vertical" />
                      <a
                        class="a-link"
                        href="javascript:void(0)"
                        @click="delBlog(data)"
                        v-if="
                          userInfo.userId == data.userId ||
                          userInfo.roleType == 1
                        "
                        >删除</a
                      >
                      <span v-else>--</span>
                      <el-divider direction="vertical" />
                      <a
                        class="a-link"
                        href="javascript:void(0)"
                        @click="editBlog('add', data)"
                        >新增下级文章</a
                      >
                    </template>
                  </span>
                </span>
              </template>
            </el-tree>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <!-- form -->
    <Dialog
      :show="dialogConfig.show"
      :title="dialogConfig.title"
      :buttons="dialogConfig.buttons"
      width="500px"
      @close="dialogConfig.show = false"
    >
      <el-form
        :model="formData"
        :rules="rules"
        ref="formDataRef"
        label-width="80px"
      >
        <el-form-item prop="categoryName" label="名称">
          <el-input placeholder="请输入名称" v-model="formData.categoryName">
          </el-input>
        </el-form-item>
        <!-- 文件上传 -->
        <el-form-item prop="cover" label="封面">
          <CoverUpload v-model="formData.cover"></CoverUpload>
        </el-form-item>
        <el-form-item label="简介" prop="categoryDesc">
          <el-input
            placeholder="请输入简介"
            v-model="formData.categoryDesc"
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 4 }"
          >
          </el-input>
        </el-form-item>
      </el-form>
    </Dialog>
    <BlogEdit ref="blogEditRef" @callback="saveBlogCallback"></BlogEdit>
    <BlogDetail ref="blogDetailRef"></BlogDetail>
  </div>
</template>

<script setup>
import { getCurrentInstance, nextTick, reactive, ref } from "vue";
import VueCookies from "vue-cookies";
import BlogEdit from "./BlogEdit.vue";
import BlogDetail from "./BlogDetail.vue";

const { proxy } = getCurrentInstance();

const api = {
  loadDataList: "/category/loadCategory4Special",
  saveCategory: "/category/saveCategory4Special",
  delCategory: "category/delCategory4Special",
  getSpecialInfo: "blog/getSpecialInfo",
  delBlog: "/blog/recoveryBlog",
  updateSpecialBlogSort: "blog/updateSpecialBlogSort",
};
const userInfo = ref(proxy.VueCookies.get("userInfo") || {});

const columns = [
  {
    label: "封面",
    prop: "cover",
    width: 100,
    scopedSlots: "cover",
  },
  {
    label: "名称",
    prop: "categoryName",
    width: 200,
  },
  {
    label: "简介",
    prop: "categoryDesc",
  },
  {
    label: "博客数量",
    prop: "blogCount",
    width: 90,
  },
  {
    label: "操作",
    prop: "op",
    width: 150,
    scopedSlots: "op",
  },
];

const tableData = reactive({});
const tableOptions = {
  exHeight: 130,
};
const dataTableRef = ref(null);
// tree初始化
const currentCategoryId = ref(null);
const loadDataList = async () => {
  let result = await proxy.Request({
    url: api.loadDataList,
  });
  if (!result) {
    return;
  }
  // console.log(result);
  Object.assign(tableData, result.data);
  if (currentCategoryId.value == null && result.data.list.length > 0) {
    currentCategoryId.value = result.data.list[0].categoryId;
    loadBlogList();
  }
  // ui组件方法  选中
  nextTick(() => {
    dataTableRef.value.setCurrentRow("categoryId", currentCategoryId.value);
  });
};

// 新增 修改 专题
const blogEditRef = ref(null);
const editBlog = (type, data) => {
  blogEditRef.value.init(type, data);
};
const dialogConfig = reactive({
  show: false,
  title: "标题",
  buttons: [
    {
      type: "danger",
      text: "确定",
      click: (e) => {
        submitForm();
      },
    },
  ],
});
const formData = ref({});
const rules = {
  categoryName: [{ required: true, message: "请输入分类名称" }],
};
const formDataRef = ref();

// 打开展示表单
const showEdict = (type, data) => {
  dialogConfig.show = !dialogConfig.show;
  // 等待窗口弹出再改数据
  nextTick(() => {
    if (type == "add") {
      dialogConfig.title = "新增分类";
      // formDataRef.value.resetFields(); // form组件 清空表单
      formData.value = {};
    } else if (type == "update") {
      // console.log(data);
      dialogConfig.title = "编辑分类";
      formData.value = data;
    }
  });
};
const emit = defineEmits(["close"]);
const close = () => {
  emit("close");
};
// 上传表单
const submitForm = () => {
  formDataRef.value.validate(async (valid) => {
    if (!valid) {
      return;
    }
    let params = {};
    Object.assign(params, formData.value);
    let result = await proxy.Request({
      url: api.saveCategory,
      params: params,
    });
    if (!result) {
      return;
    }
    dialogConfig.show = false;
    proxy.message.success("保存成功");
    loadDataList();
  });
};
// 删除
const delBlog = (data) => {
  // console.log(data.blogId);
  proxy.Confirm(`你确定要删除【${data.title}】吗？`, async () => {
    let result = await proxy.Request({
      url: api.delBlog,
      params: {
        blogId: data.blogId,
      },
    });
    if (!result) {
      return;
    }
    loadBlogList();
    proxy.message.success("删除成功");
  });
};
// 专题树
// 获取专题文章
const rowClick = (row) => {
  // console.log(row);
  currentCategoryId.value = row.categoryId;
  loadBlogList();
};
const blogList = ref([]);
const loadBlogList = async () => {
  console.log(currentCategoryId.value);
  let result = await proxy.Request({
    url: api.getSpecialInfo,
    params: {
      categoryId: currentCategoryId.value,
      showType: "1",
    },
  });
  // console.log(result)
  blogList.value = result.data;
};

// 属性展示专题
const treeProps = {
  children: "children",
  label: "title",
  value: "blogId",
};
// 树拖拽排序
//拖动改变排序，修改父级
const blogDrag = async (draggingNode, dropNode, dropType, ev) => {
  console.log(draggingNode, dropNode, dropType);
  //拖入某个节点内，修改父级节点为目标节点，同时修改目标节点下的所有子节点的排序
  let parentNode = null;
  if (dropType == "inner") {
    //拖入某个几点内，修改父级节点为目标节点，同时修改目标节点下的所有子节点的排序
    parentNode = dropNode;
  } else {
    //拖入之前，之后，修改被拖动的节点的父节点为目标节点的父节点，同时修改目标节点父节点下所有的子节点的排序
    parentNode = dropNode.parent;
  }
  //操作的节点ID
  const blogId = draggingNode.data.blogId;
  const pBlogId = parentNode.data.blogId;
  //需要从新排序的博客ID
  const blogIds = [];
  parentNode.childNodes.forEach((element) => {
    blogIds.push(element.data.blogId);
  });
  let params = {
    blogId,
    pBlogId,
    blogIds: blogIds.join(","),
  };
  let result = await proxy.Request({
    url: api.updateSpecialBlogSort,
    params,
  });
  if (!result) {
    return;
  }
  //重新加载文章树
  loadBlogList();
};
// 保存专题博客回调
const saveBlogCallback = () => {
  loadBlogList();
};

//详情
const blogDetailRef = ref(null);
const showDetail = (data) => {
  blogDetailRef.value.showDetail(data);
};
</script>

<style lang="scss">
.tree-panel {
  height: calc(100vh - 290px);
  overflow: auto;
  .custom-node-style {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
}
</style>