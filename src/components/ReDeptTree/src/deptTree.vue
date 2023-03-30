<template>
  <div>
    <el-input
      v-model="showDeptName"
      :placeholder="placeholder"
      @click="deptDialog"
    >
      <template v-slot:append>
        <el-button icon="search" @click="deptDialog" />
      </template>
    </el-input>
    <el-dialog
      v-model="visibleDept"
      width="30%"
      :modal="false"
      :title="placeholder"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form size="small" :inline="true">
        <el-form-item label="关键字">
          <el-input v-model="filterText" :input-style="{ width: '150px' }" />
        </el-form-item>
        <el-form-item>
          <el-button type="default">查询</el-button>
        </el-form-item>
      </el-form>
      <el-tree
        class="filter-tree"
        :data="deptList"
        :default-expanded-keys="expandedKeys"
        :props="{ label: 'name', children: 'children' }"
        :expand-on-click-node="false"
        :filter-node-method="filterNode"
        :highlight-current="true"
        node-key="id"
        ref="treeRef"
      />
      <template v-slot:footer>
        <el-button type="default" @click="cancelHandle()">取消</el-button>
        <el-button v-if="query" type="info" @click="clearHandle()">清空</el-button>
        <el-button type="primary" @click="commitHandle()">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, ref, watch } from "vue";
import { IObject } from "@/../types/interface";
import service from "@/service";
import { ElMessage } from "element-plus";

defineOptions({
  name: "deptTree"
});

const filterText = ref("");
const visibleDept = ref(false);
const deptList = ref<any[]>([]);
const showDeptName = ref("");
const expandedKeys = ref<any[]>([]);
const treeRef = ref();

const props = defineProps({
  modelValue: String,
  deptName: String,
  query: Boolean,
  placeholder: String
});

watch(
  () => filterText.value,
  value => {
    treeRef.value.filter(value);
  }
);

watch(
  () => props.deptName,
  value => {
    showDeptName.value = value as string;
  }
);

const getDeptList = (id?: string) => {
  return service.get("/sys/dept/list").then(res => {
    deptList.value = res.data;
    nextTick(() => {
      if (id) {
        treeRef.value.setCurrentKey(id);
        expandedKeys.value = [id];
      }
    });
  });
};

const deptDialog = () => {
  expandedKeys.value = [];
  visibleDept.value = true;
  getDeptList(props.modelValue);
};

const filterNode = (value: string, data: IObject) => {
  if (!value) return true;
  return data.name.indexOf(value) !== -1;
};

const emit = defineEmits(["update:modelValue", "update:deptName"]);

const clearHandle = () => {
  emit("update:modelValue", "");
  emit("update:deptName", "");
  showDeptName.value = "";
  visibleDept.value = false;
  deptList.value = [];
  filterText.value = "";
};

const cancelHandle = () => {
  visibleDept.value = false;
  deptList.value = [];
  filterText.value = "";
};

const commitHandle = () => {
  const node = treeRef.value.getCurrentNode();
  if (!node) {
    ElMessage.error("请选择部门");
    return;
  }
  emit("update:modelValue", node.id);
  emit("update:deptName", node.name);
  showDeptName.value = node.name;
  visibleDept.value = false;
  deptList.value = [];
  filterText.value = "";
};

</script>

<style scoped></style>
