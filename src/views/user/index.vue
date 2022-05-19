<template>
  <div class="app-container">
    <div class="filter-container">
      <el-date-picker
        v-model="listQuery.created_at"
        size="small"
        type="datetimerange"
        range-separator="-"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd HH:mm:ss"
        class="filter-item"
        :editable="false"
      />
      <el-select
        v-model="listQuery.status"
        size="small"
        placeholder="选择状态"
        clearable
        class="filter-item"
      >
        <el-option label="正常" :value="1" />
        <el-option label="禁用" :value="0" />
      </el-select>
      <el-input
        v-model="listQuery.keyword"
        size="small"
        placeholder="请输入关键词"
        clearable
        class="filter-item w-200"
      />
      <el-button-group class="filter-item">
        <el-button size="small" type="primary" icon="el-icon-search" @click="search"> 搜索 </el-button>
        <el-button size="small" type="primary" icon="el-icon-refresh" @click="refresh"> 重置 </el-button>
        <el-button size="small" type="primary" icon="el-icon-plus" @click="handleCreate"> 新增 </el-button>
      </el-button-group>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      height="100%"
      class="table-container"
      highlight-current-row
    >
      <el-table-column label="用户ID" width="250" align="center" fixed="left">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column label="用户名称" align="center">
        <template slot-scope="scope">{{ scope.row.user_name }}</template>
      </el-table-column>
      <el-table-column label="性别" width="80" align="center">
        <template slot-scope="scope"><span>{{ scope.row.gender | genderFilter }}</span></template>
      </el-table-column>
      <el-table-column label="移动电话" width="150" align="center">
        <template slot-scope="scope">{{ scope.row.mobile }}</template>
      </el-table-column>
      <el-table-column label="电子邮箱" width="200" align="center">
        <template slot-scope="scope">{{ scope.row.email }}</template>
      </el-table-column>
      <el-table-column label="所在部门" width="150" align="center">
        <template slot-scope="scope">
          <el-tag v-for="(item, index) in scope.row.departments" :key="`department-${index}`" effect="plain" style="margin: 0px 2px 0px 2px"> {{ item.department_name }} </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="角色" width="200" align="center">
        <template slot-scope="scope">
          <el-tag v-for="(item, index) in scope.row.roles" :key="`role-${index}`" effect="plain" style="margin: 0px 2px 0px 2px"> {{ item.role_name }} </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="建立时间" align="center">
        <template slot-scope="scope">{{ scope.row.create_at | datetimeFilter }}</template>
      </el-table-column>
      <el-table-column label="状态" width="80" align="center">
        <template slot-scope="scope">
          <el-switch
            :value="scope.row.status"
            :active-value="1"
            :inactive-value="0"
            @change="changeStatus($event, scope)"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="250" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button plain type="warning" size="mini" @click="handlePassword(scope)"> 重置密码 </el-button>
          <el-button plain type="success" size="mini" @click="handleUpdate(scope)"> 修改 </el-button>
          <el-button plain type="danger" size="mini" @click="handleDelete(scope)"> 删除 </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="fetchData"
    />

    <!-- 弹出窗口 -->
    <el-dialog :visible.sync="dialogVisible" :title="dialogType === 'update' ? '修改' : '新增'">
      <el-form ref="dataForm" :model="temp" :rules="rules" label-width="120px" label-position="right">
        <el-form-item label="用户姓名" prop="user_name">
          <el-input v-model="temp.user_name" placeholder="请输入用户姓名" />
        </el-form-item>

        <el-form-item label="用户性别" prop="gender">
          <el-radio-group v-model="temp.gender">
            <el-radio :label="0">男</el-radio>
            <el-radio :label="1">女</el-radio>
            <el-radio :label="2">未知</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="移动电话" prop="mobile">
          <el-input v-model="temp.mobile" placeholder="请输入移动电话" />
        </el-form-item>

        <el-form-item label="电子邮箱" prop="email">
          <el-input v-model="temp.email" placeholder="请输入电子邮箱" />
        </el-form-item>

        <el-form-item label="用户部门" prop="departments">
          <el-cascader
            ref="tree"
            v-model="temp.departments"
            :options="departmentOptions"
            :props="{ checkStrictly: false, emitPath: false, multiple: true, expandTrigger: 'hover', value: 'id', label: 'department_name' }"
            :show-all-levels="true"
            clearable
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="用户角色" prop="roles">
          <el-select
            v-model="temp.roles"
            placeholder="请选择角色"
            multiple
            clearable
            style="width: 100%"
          >
            <el-option v-for="(item, index) in roleOptions" :key="`roleOption-${index}`" :value="item.id" :label="item.role_name" />
          </el-select>
        </el-form-item>

        <el-form-item label="用户状态" prop="status">
          <el-radio-group v-model="temp.status">
            <el-radio :label="0">禁用</el-radio>
            <el-radio :label="1">正常</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <div class="text-right">
        <el-button type="danger" @click="dialogVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogType==='create'?createData(temp):updateData()">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import Pagination from '@/components/Pagination'
import { getUserList, createUser, updateUser, deleteUser, changePassword } from '@/api/user'
import { getDepartmentOptions } from '@/api/department'
import { getRoleOptions } from '@/api/role'
import { validMobile, validEmail } from '@/utils/validate'
import { deepClone, dateFormat, dataConvert } from '@/utils'

const _temp = {
  id: undefined,
  user_name: '',
  gender: 0,
  mobile: '',
  email: '',
  departments: [],
  roles: [],
  status: 1,
  create_user: '',
  update_user: ''
}

export default {
  components: { Pagination },
  filters: {
    genderFilter(gender) {
      const genderMap = {
        0: '女',
        1: '男',
        2: '未知'
      }
      return genderMap[gender]
    },
    datetimeFilter(datatime) {
      const date = new Date(datatime)
      return dateFormat('YYYY-mm-dd HH:MM:SS', date)
    }
  },
  data() {
    const validateMobile = (rule, value, callback) => {
      if (!validMobile(value)) {
        callback(new Error('请输入正确的手机号码'))
      } else {
        callback()
      }
    }

    const validateEmail = (rule, value, callback) => {
      if (!validEmail(value)) {
        callback(new Error('请输入正确的电子邮件地址'))
      } else {
        callback()
      }
    }

    const validateDepartments = (rule, value, callback) => {
      if (!this.temp.departments.length) {
        callback(new Error('请选择部门'))
      } else {
        callback()
      }
    }

    return {
      total: 0,
      list: [],
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        created_at: undefined,
        status: undefined,
        keyword: undefined
      },
      temp: Object.assign({}, _temp),
      dialogVisible: false,
      dialogType: 'create',
      loading: false,
      departmentOptions: [],
      roleOptions: [],
      // 检验表单输入
      rules: {
        user_name: [{ required: true, trigger: 'blur', message: '请输入用户名' }],
        mobile: [{ required: true, trigger: 'blur', validator: validateMobile }],
        email: [{ required: true, trigger: 'blur', validator: validateEmail }],
        departments: [{ type: 'array', required: true, trigger: 'blur', validator: validateDepartments }]
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    search() {
      this.fetchData()
    },
    refresh() {
      this.listQuery = {
        page: 1,
        limit: 10,
        created_at: undefined,
        status: undefined,
        keyword: undefined
      }
      this.fetchData()
    },
    fetchData() {
      this.listLoading = true
      getUserList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
      getDepartmentOptions().then(response => {
        this.departmentOptions = response.data
      })
      getRoleOptions().then(response => {
        this.roleOptions = response.data
      })
    },
    resetTemp() {
      this.temp = Object.assign({}, _temp)
    },
    handleCreate() {
      this.resetTemp()
      this.dialogVisible = true
      this.dialogType = 'create'
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(scope) {
      this.resetTemp()
      this.dialogVisible = true
      this.dialogType = 'update'
      this.temp = deepClone(scope.row)
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
        // 回显数据
        this.temp.departments = dataConvert(this.temp.departments)
        this.temp.roles = dataConvert(this.temp.roles)
      })
    },

    handleDelete(scope) {
      this.$confirm('确认删除该条数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUser({ 'id': scope.row.id }).then(res => {
          console.log('deleteUser...', res)
          this.fetchData()

          Message({
            message: res.message || 'Error',
            type: 'success',
            duration: 3 * 1000
          })
        }).catch(err => {
          console.log(err)
          this.updateLoading = true
        })
      })
    },
    changeStatus(value, scope) {
      setTimeout(() => {
        this.list[scope.$index].status = value
        this.$message({
          message: '更新成功',
          type: 'success'
        })
      }, 300)
    },
    handlePassword(scope) {
      this.$confirm('确认重置密码吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        changePassword({ 'id': scope.row.id, 'password': '' }).then(res => {
          console.log('changePassword...', res)
          this.fetchData()

          Message({
            message: res.message || 'Error',
            type: 'success',
            duration: 3 * 1000
          })
        }).catch(err => {
          console.log(err)
          this.updateLoading = true
        })
      })
    },
    createData() {
      this.updateLoading = true
      this.temp.create_user = this.$store.getters.name

      // 调用api创建数据入库
      createUser(this.temp).then(res => {
        this.updateLoading = false
        console.log('createUser...', res)
        this.fetchData()
        this.dialogVisible = false

        Message({
          message: res.message || 'Error',
          type: 'success',
          duration: 3 * 1000
        })
      }).catch(err => {
        console.log(err)
        this.updateLoading = true
      })
    },
    updateData() {
      this.updateLoading = true
      this.temp.update_user = this.$store.getters.name

      // 调用api更新数据入库
      updateUser(this.temp).then(res => {
        this.updateLoading = false
        console.log('updateUser...', res)
        this.fetchData()
        this.dialogVisible = false

        Message({
          message: res.message || 'Error',
          type: 'success',
          duration: 3 * 1000
        })
      }).catch(err => {
        console.log(err)
        this.updateLoading = true
      })
    }
  }
}
</script>
