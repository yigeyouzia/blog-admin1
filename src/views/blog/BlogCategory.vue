<template>
  <div>
    <el-button type="danger" @click="showEdict('add')">新增专题</el-button>
    <Table
      :columns="columns"
      :showPagination="false"
      :dataSource="tableData"
      :fetch="loadDataList"
      :options="tableOptions"
    >
      <template #cover="{ row }">
        <!-- 图片 -->
        <Cover :cover="row.cover"></Cover>
      </template>
      <template #op="{ index, row }">
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
          <a
            href="javascript:void(0)"
            :class="[index == 0 ? 'not-allow' : 'a-link']"
            @click="changeSort(index, 'up')"
            v-if="userInfo.userId == row.userId"
            >上移</a
          >
          <span v-else>--</span>
          <el-divider direction="vertical" />
          <a
            href="javascript:void(0)"
            :class="[
              index == tableData.list.length - 1 ? 'not-allow' : 'a-link',
            ]"
            @click="changeSort(index, 'down')"
            v-if="userInfo.userId == row.userId"
            >下移</a
          >
          <span v-else>--</span>
        </div>
      </template>
    </Table>
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
  </div>
</template>

<script setup>
import { getCurrentInstance, nextTick, reactive, ref } from "vue";
const { proxy } = getCurrentInstance();

const api = {
  loadDataList: "/category/loadAllCategory4Blog", // 获取博客分类
  saveCategory: "/category/saveCategory4Blog",
  delCategory: "/category/delCategory4Blog",
  changeSort: "/category/changeCategorySort4Blog",
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
    width: 100,
  },
  {
    label: "操作",
    prop: "op",
    width: 200,
    scopedSlots: "op",
  },
];

const tableData = reactive({});
const tableOptions = {
  exHeight: 10,
};
const loadDataList = async () => {
  let result = await proxy.Request({
    url: api.loadDataList,
  });
  if (!result) {
    return;
  }
  //   console.log(result);
  tableData.list = result.data;
};

// 新增 修改
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
    formDataRef.value.resetFields(); // form组件 清空表单
    if (type == "add") {
      formData.value = {};
      dialogConfig.title = "新增分类";
    } else if (type == "update") {
      // console.log(data);
      dialogConfig.title = "编辑分类";
      formData.value = JSON.parse(JSON.stringify(data));
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
const del = (data) => {
  proxy.Confirm(`你确定要删除${data.categoryName}`, async () => {
    let result = await proxy.Request({
      url: api.delCategory,
      params: {
        categoryId: data.categoryId,
      },
    });
    if (!result) {
      return;
    }
    loadDataList();
    proxy.message.success("删除成功");
  });
};
// 排序 上下移
const changeSort = async (index, dir) => {
  let categoryList = tableData.list;
  if (index == 0 && dir == "up") {
    return;
  }
  if (index == tableData.list.length - 1 && dir == "down") {
    return;
  }
  let temp = categoryList[index];
  let num = dir == "down" ? 1 : -1;
  categoryList.splice(index, 1); // 先删除 再添加
  categoryList.splice(index + num, 0, temp); // 临时值塞进
  console.log(JSON.stringify(categoryList));

  let result = await proxy.Request({
    url: api.changeSort,
    dataType: "json",
    params: categoryList,
  });
  if (!result) {
    return;
  }
  proxy.message.success("排列成功");
  loadDataList();
};
</script>

<style lang="scss" scoped>
</style>