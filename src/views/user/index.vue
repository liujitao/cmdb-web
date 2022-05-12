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
        <el-button size="small" type="primary" icon="el-icon-plus" @click="add"> 新增 </el-button>
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
      <el-table-column fixed label="用户ID" width="200" align="center">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column label="用户姓名" width="150" align="center">
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
          <el-tag v-for="(item, index) in scope.row.department" :key="index" effect="plain"> {{ item.department_name }} </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="角色" align="center">
        <template slot-scope="scope">
          <el-tag v-for="(item, index) in scope.row.roles" :key="index" effect="plain"> {{ item.role_name }} </el-tag>
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
      <el-table-column label="操作" width="300" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button plain type="warning" size="mini" @click="edit(scope)"> 重置密码 </el-button>
          <el-button plain type="success" size="mini" @click="edit(scope)"> 修改 </el-button>
          <el-button plain type="danger" size="mini" @click="del(scope)"> 删除 </el-button>
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
    <el-dialog :visible.sync="dialogVisible" :title="dialogType === 'modify' ? '修改' : '新增'">
      <el-form ref="dataForm" :model="temp" label-width="120px" label-position="right">
        <el-form-item label="用户姓名">
          <el-input v-model="temp.user_name" placeholder="请输入用户姓名" />
        </el-form-item>

        <el-form-item label="用户性别">
          <el-radio-group v-model="temp.gender">
            <el-radio :label="0">男</el-radio>
            <el-radio :label="1">女</el-radio>
            <el-radio :label="2">未知</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="移动电话">
          <el-input v-model="temp.mobile" placeholder="请输入移动电话" />
        </el-form-item>

        <el-form-item label="电子邮箱">
          <el-input v-model="temp.email" placeholder="请输入电子邮箱" />
        </el-form-item>

        <el-form-item label="用户部门">
          <el-cascader
            v-model="temp.department"
            :options="departmentOptions"
            :props="{ checkStrictly: true, emitPath: false, expandTrigger: 'hover', value: 'id', label: 'department_name' }"
            :show-all-levels="false"
            clearable
          />
        </el-form-item>

        <el-form-item label="用户角色">
          <el-select v-model="temp.roles" placeholder="请选择角色" multiple>
            <el-option v-for="item in roleOptions" :key="item.role_name" :label="item.role_name" :value="item.id" />
          </el-select>
        </el-form-item>

        <el-form-item label="用户状态">
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
        <el-button type="primary" @click="submit">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { getList } from '@/api/user'
import { getOptions } from '@/api/department'
import { getRoleOptions } from '@/api/role'
import { deepClone, dateFormat } from '@/utils'

const _temp = {
  id: undefined,
  user_name: '',
  gender: 0,
  mobile: '',
  email: '',
  departments: [],
  roles: [],
  status: 1
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
    return {
      total: 0,
      list: [],
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        created_at: undefined,
        status: undefined,
        keyword: undefined
      },
      temp: Object.assign({}, _temp),
      dialogVisible: false,
      dialogType: 'create',
      loading: false,
      departmentOptions: [],
      roleOptions: []
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
        limit: 20,
        created_at: undefined,
        status: undefined,
        keyword: undefined
      }
      this.fetchData()
    },
    fetchData() {
      this.listLoading = true
      getList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
      getOptions().then(response => {
        this.departmentOptions = response.data
      })
      getRoleOptions().then(response => {
        this.roleOptions = response.data.items
      })
    },
    resetTemp() {
      this.temp = Object.assign({}, _temp)
    },
    add() {
      this.resetTemp()
      this.dialogVisible = true
      this.dialogType = 'create'
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    edit(scope) {
      this.resetTemp()
      this.dialogVisible = true
      this.dialogType = 'modify'
      this.temp = deepClone(scope.row)
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
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
    del(scope) {
      this.$confirm('确认删除该条数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        setTimeout(() => {
          this.list.splice(scope.$index, 1)
          this.$message({
            message: '删除成功',
            type: 'success'
          })
        }, 300)
      })
    },
    submit() {
      if (this.loading) {
        return
      }
      this.loading = true
      setTimeout(() => {
        this.$message({
          message: '提交成功',
          type: 'success'
        })
        this.dialogVisible = false
        this.loading = false
      }, 300)
    }
  }
}
</script>
