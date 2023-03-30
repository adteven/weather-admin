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
      <el-form-item prop="username" label="用户名">
        <el-input
          v-model="dataForm.username"
          placeholder="用户名"
        />
      </el-form-item>
      <el-form-item prop="deptName" label="部门">
        <dept-tree
          v-model="dataForm.deptId"
          placeholder="选择部门"
          v-model:deptName="dataForm.deptName"
        />
      </el-form-item>
      <el-form-item
        prop="password"
        label="密码"
        :class="{ 'is-required': !dataForm.id }"
      >
        <el-input
          v-model="dataForm.password"
          type="password"
          placeholder="密码"
        />
      </el-form-item>
      <el-form-item
        prop="confirmPassword"
        :label="确认密码"
        :class="{ 'is-required': !dataForm.id }"
      >
        <el-input
          v-model="dataForm.confirmPassword"
          type="password"
          placeholder="确认密码"
        />
      </el-form-item>
      <el-form-item prop="realName" label="姓名">
        <el-input
          v-model="dataForm.realName"
          placeholder="姓名"
        />
      </el-form-item>
      <el-form-item prop="gender" label="性别">
        <el-radio-group v-model="dataForm.gender">
          <el-radio :label="0">男</el-radio>
          <el-radio :label="1">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="email" label="邮箱">
        <el-input v-model="dataForm.email" placeholder="邮箱" />
      </el-form-item>
      <el-form-item prop="mobile" label="手机号">
        <el-input v-model="dataForm.mobile" placeholder="手机号" />
      </el-form-item>
      <el-form-item
        prop="roleIdList"
        label="角色"
        class="role-list"
      >
        <el-select
          v-model="dataForm.roleIdList"
          multiple
          placeholder="角色"
        >
          <el-option
            v-for="role in roleList"
            :key="role.id"
            :label="role.name"
            :value="role.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        prop="postIdList"
        label="岗位"
        class="role-list"
      >
        <el-select
          v-model="dataForm.postIdList"
          multiple
          :placeholder="岗位"
        >
          <el-option
            v-for="post in postList"
            :key="post.id"
            :label="post.postName"
            :value="post.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="status" label="状态">
        <el-radio-group v-model="dataForm.status">
          <el-radio :label="0">停用</el-radio>
          <el-radio :label="1">正常</el-radio>
        </el-radio-group>
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
import baseService from "@/service";
import { IObject } from "@/../types/interface";
import { ElMessage } from "element-plus";
import { isEmail, isMobile } from "@/utils/utils";

const emit = defineEmits(["refreshDataList"]);

const visible = ref(false);
const dataFormRef = ref();
const roleList = ref<any[]>([]);
const postList = ref<any[]>([]);

const dataForm = reactive({
  id: "",
  username: "",
  deptId: "",
  deptName: "",
  password: "",
  confirmPassword: "",
  realName: "",
  gender: 0,
  email: "",
  mobile: "",
  roleIdList: [] as IObject[],
  postIdList: [] as IObject[],
  status: 1
});

const validatePassword = (rule: any, value: string, callback: (e?: Error) => any): any => {
  if (!dataForm.id && !/\S/.test(value)) {
    return callback(new Error("必填项不能为空"));
  }
  callback();
};
const validateConfirmPassword = (rule: any, value: string, callback: (e?: Error) => any): any => {
  if (!dataForm.id && !/\S/.test(value)) {
    return callback(new Error("必填项不能为空"));
  }
  if (dataForm.password !== value) {
    return callback(new Error("必填项不能为空"));
  }
  callback();
};
const validateEmail = (rule: any, value: string, callback: (e?: Error) => any): any => {
  if (value && !isEmail(value)) {
    return callback(new Error("邮箱格式不正确"));
  }
  callback();
};
const validateMobile = (rule: any, value: string, callback: (e?: Error) => any): any => {
  if (value && !isMobile(value)) {
    return callback(new Error("手机号格式不正确"));
  }
  callback();
};

const rules = ref({
  username: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
  deptName: [{ required: true, message: "必填项不能为空", trigger: "change" }],
  password: [{ validator: validatePassword, trigger: "blur" }],
  confirmPassword: [{ validator: validateConfirmPassword, trigger: "blur" }],
  realName: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
  email: [{ validator: validateEmail, trigger: "blur" }],
  mobile: [{ validator: validateMobile, trigger: "blur" }]
});

const init = (id?: number) => {
  visible.value = true;
  dataForm.id = "";
  dataForm.deptId = "";

  // 重置表单数据
  if (dataFormRef.value) {
    dataFormRef.value.resetFields();
  }

  Promise.all([getRoleList(), getPostList()]).then(() => {
    if (id) {
      getInfo(id);
    }
  });
};

// 获取角色列表
const getRoleList = () => {
  return baseService.get("/sys/role/list").then((res) => {
    roleList.value = res.data;
  });
};

// 获取岗位列表
const getPostList = () => {
  return baseService.get("/sys/post/list").then((res) => {
    postList.value = res.data;
  });
};

// 获取信息
const getInfo = (id: number) => {
  baseService.get(`/sys/user/${id}`).then((res) => {
    Object.assign(dataForm, res.data);
  });
};

// 表单提交
const dataFormSubmitHandle = () => {
  dataFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false;
    }
    (!dataForm.id ? baseService.post : baseService.put)("/sys/user", {
      ...dataForm,
      roleIdList: [...dataForm.roleIdList]
    }).then((res) => {
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
