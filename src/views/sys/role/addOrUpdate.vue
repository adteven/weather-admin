<template>
  <el-dialog
    v-model="visible"
    :title="!dataForm.id ? '增加' : '编辑'"
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
      <el-form-item prop="name" label="角色名称">
        <el-input v-model="dataForm.name" placeholder="角色名称" />
      </el-form-item>
      <el-form-item prop="remark" label="备注">
        <el-input v-model="dataForm.remark" placeholder="备注" />
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item size="small" label="菜单授权">
            <el-tree
              :data="menuList"
              :props="{ label: 'name', children: 'children' }"
              node-key="id"
              ref="menuListTree"
              accordion
              show-checkbox
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template v-slot:footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmitHandle()">确认</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref, nextTick } from "vue";
import baseService from "@/service";
import { IObject } from "@/../types/interface";
import { ElMessage } from "element-plus";

const emit = defineEmits(["refreshDataList"]);

const visible = ref(false);
const dataFormRef = ref();
const menuList = ref([]);
const deptList = ref([]);
const menuListTree = ref();

const dataForm = reactive({
  id: "",
  name: "",
  menuIdList: [] as IObject[],
  remark: ""
});

const rules = ref({
  name: [{ required: true, message: "必填项不能为空", trigger: "blur" }]
});

const init = (id?: number) => {
  visible.value = true;
  dataForm.id = "";

  // 重置表单数据
  if (dataFormRef.value) {
    dataFormRef.value.resetFields();
  }

  nextTick(() => {
    if (menuListTree.value) {
      menuListTree.value.setCheckedKeys([]);
    }

    Promise.all([getMenuList(), getDeptList()]).then(() => {
      if (id) {
        getInfo(id);
      }
    });
  });
};

// 获取菜单列表
const getMenuList = () => {
  return baseService.get("/sys/menu/select").then(res => {
    menuList.value = res.data;
  });
};

// 获取部门列表
const getDeptList = () => {
  return baseService.get("/sys/dept/list").then(res => {
    deptList.value = res.data;
  });
};

// 获取信息
const getInfo = (id: number) => {
  baseService.get(`/sys/role/${id}`).then(res => {
    Object.assign(dataForm, res.data);

    dataForm.menuIdList.forEach((item: IObject) =>
      menuListTree.value.setChecked(item, true)
    );
  });
};

// 表单提交
const dataFormSubmitHandle = () => {
  dataFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false;
    }
    dataForm.menuIdList = [
      ...menuListTree.value.getHalfCheckedKeys(),
      ...menuListTree.value.getCheckedKeys()
    ];
    (!dataForm.id ? baseService.post : baseService.put)(
      "/sys/role",
      dataForm
    ).then(res => {
      ElMessage.success({
        message: "提交成功",
        duration: 500,
        onClose: () => {
          visible.value = false;
          emit("refreshDataList");
        }
      });
    });
  });
};

defineExpose({
  init
});
</script>

<style lang="scss">
.el-popover.el-popper {
  overflow-x: hidden;
}
.mod-sys__menu {
  .menu-list,
  .icon-list {
    .el-input__inner,
    .el-input__suffix {
      cursor: pointer;
    }
  }
  &-icon-popover {
    width: 458px !important;
    overflow-y: hidden !important;
  }
  &-icon-inner {
    width: 100%;
    max-height: 260px;
    overflow-x: hidden;
    overflow-y: auto;
  }
  &-icon-list {
    width: 458px !important;
    padding: 0;
    margin: -8px 0 0 -8px;
    > .el-button {
      padding: 8px;
      margin: 8px 0 0 8px;
      > span {
        display: inline-block;
        vertical-align: middle;
        width: 18px;
        height: 18px;
        font-size: 18px;
      }
    }
  }
}
</style>
