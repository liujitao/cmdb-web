<template>
  <div class="app-container">
    <div class="filter-container">
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
      <el-table-column
        fixed
        align="center"
        label="角色ID"
        width="200"
      >
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column
        label="部门名称"
        align="center"
        width="200"
      >
        <template slot-scope="scope">{{ scope.row.department_name }}</template>
      </el-table-column>
      <el-table-column
        label="用户"
        align="center"
      >
        <template slot-scope="scope">{{ scope.row.users | usersFilter }}</template>
      </el-table-column>
      <el-table-column
        fixed="right"
        align="center"
        label="操作"
        width="300"
      >
        <template slot-scope="scope">
          <el-button plain type="warning" size="mini" @click="edit(scope)"> 权限 </el-button>
          <el-button plain type="success" size="mini" @click="edit(scope)"> 修改 </el-button>
          <el-button plain type="danger" size="mini" @click="del(scope)"> 删除 </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="fetchData"
    />

    <el-dialog
      :visible.sync="dialogVisible"
      :title="dialogType === 'modify' ? '修改' : '新增'"
    >
      <el-form
        ref="dataForm"
        :model="temp"
        label-width="120px"
        label-position="right"
      >
        <el-form-item label="用户组名称">
          <el-input v-model="temp.title" placeholder="请输入用户组名称" />
        </el-form-item>
        <el-form-item label="用户组标识">
          <el-input v-model="temp.name" placeholder="请输入用户组标识" />
        </el-form-item>
        <el-form-item label="菜单权限">
          <el-tree
            ref="tree"
            :data="menus"
            :props="defaultMenuProps"
            show-checkbox
            accordion
            node-key="id"
            class="permission-tree"
          />
        </el-form-item>
        <el-form-item label="用户组状态">
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
import { getList } from '@/api/department'
import { getList as getMenu } from '@/api/permission'
import { deepClone, dateFormat } from '@/utils'

const _temp = {
  id: '',
  title: '',
  name: '',
  perm: [],
  status: 1
}

export default {
  components: {
    Pagination
  },
  filters: {
    usersFilter(users) {
      const data = []
      users.forEach(item => {
        if (item !== []) {
          data.push(item.user_name)
        }
      })
      return data.join(',')
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
      menus: [],
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        keyword: undefined
      },
      temp: Object.assign({}, _temp),
      dialogVisible: false,
      dialogType: 'create',
      loading: false,
      defaultMenuProps: {
        children: 'children',
        label: 'title'
      }
    }
  },
  created() {
    this.fetchData()
    this.fetchMenu()
  },
  methods: {
    search() {
      this.fetchData()
    },
    refresh() {
      this.listQuery = {
        page: 1,
        limit: 20,
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
    },
    fetchMenu() {
      getMenu().then(response => {
        this.menus = response.data.list
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
