<template>
  <el-dialog
    v-model="visible"
    :title="!dataForm.id ? '添加' : '编辑'"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form
      :model="dataForm"
      :rules="rules"
      ref="dataFormRef"
      @keyup.enter="dataFormSubmitHandle()"
      label-width="120px"
    >
      <el-form-item prop="name" label="部门名称">
        <el-input v-model="dataForm.name" placeholder="部门名称" />
      </el-form-item>
      <el-form-item
        prop="parentName"
        label="上级部门"
        class="dept-list"
      >
        <el-popover
          :width="400"
          ref="deptListPopover"
          placement="bottom-start"
          trigger="click"
          popper-class="popover-pop"
        >
          <template v-slot:reference>
            <el-input
              v-model="dataForm.parentName"
              :readonly="true"
              placeholder="上级部门"
            >
              <template v-slot:suffix>
                <el-icon
                  v-if="superAdmin === 1 && dataForm.pid !== '0'"
                  @click.stop="deptListTreeSetDefaultHandle()"
                  class="el-input__icon"
                  ><circle-close
                /></el-icon>
              </template> </el-input
          ></template>
          <div class="popover-pop-body">
            <el-tree
              :data="deptList"
              :props="{ label: 'name', children: 'children' }"
              node-key="id"
              ref="deptListTree"
              :highlight-current="true"
              :expand-on-click-node="false"
              accordion
              @current-change="deptListTreeCurrentChangeHandle"
            />
          </div>
        </el-popover>
      </el-form-item>
      <el-form-item prop="sort" :label="$t('dept.sort')">
        <el-input-number
          v-model="dataForm.sort"
          controls-position="right"
          :min="0"
          label="排序"
        />
      </el-form-item>
    </el-form>
    <template v-slot:footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmitHandle()">确认</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import service from "@/service";
import { IObject } from "@/../types/interface";
import { useUserStoreHook } from "@/store/modules/user";
import { ElMessage } from "element-plus";

const emit = defineEmits(["refreshDataList"]);
const visible = ref(false);
const dataFormRef = ref();
const deptList = ref([]);
const deptListPopover = ref();
const deptListTree = ref();

const dataForm = reactive({
  id: "",
  name: "",
  pid: "",
  parentName: "",
  sort: 0
});

const superAdmin = useUserStoreHook()?.superAdmin;

const rules = ref({
  name: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
  parentName: [{ required: true, message: "必填项不能为空", trigger: "change" }]
});

const init = (id?: number) => {
  visible.value = true;
  dataForm.id = "";

  // 重置表单数据
  if (dataFormRef.value) {
    dataFormRef.value.resetFields();
  }

  getDeptList().then(() => {
    if (id) {
      getInfo(id);
    } else if (superAdmin === 1) {
      deptListTreeSetDefaultHandle();
    }
  });
};

// 获取部门列表
const getDeptList = () => {
  return service.get("/sys/dept/list").then(res => {
    if (res.code !== 0) {
      return ElMessage.error(res.msg);
    }
    deptList.value = res.data;
  });
};

// 获取信息
const getInfo = (id: number) => {
  service.get(`/sys/dept/${id}`).then(res => {
    Object.assign(dataForm, res.data);

    if (dataForm.pid === "0") {
      return deptListTreeSetDefaultHandle();
    }
    deptListTree.value.setCurrentKey(dataForm.pid);
  });
};

// 上级部门树, 设置默认值
const deptListTreeSetDefaultHandle = () => {
  dataForm.pid = "0";
  dataForm.parentName = "一级部门";
};

// 上级部门树, 选中
const deptListTreeCurrentChangeHandle = (data: IObject) => {
  dataForm.pid = data.id;
  dataForm.parentName = data.name;
  deptListPopover.value.hide();
};

// 表单提交
const dataFormSubmitHandle = () => {
  dataFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false;
    }
    (!dataForm.id ? service.post : service.put)("/sys/dept", dataForm).then(
      res => {
        ElMessage.success({
          message: "提交成功",
          duration: 500,
          onClose: () => {
            visible.value = false;
            emit("refreshDataList");
          }
        });
      }
    );
  });
};

defineExpose({
  init
});
</script>

<style lang="scss" scoped>
.mod-sys__dept {
  .dept-list {
    .el-input__inner,
    .el-input__suffix {
      cursor: pointer;
    }
  }
}
</style>
