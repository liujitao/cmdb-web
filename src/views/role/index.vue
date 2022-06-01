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
      <el-table-column label="角色ID" width="250" align="center" fixed="left">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column label="角色名称" width="250" align="center">
        <template slot-scope="scope">{{ scope.row.role_name }}</template>
      </el-table-column>
      <el-table-column label="描述" align="center">
        <template slot-scope="scope">{{ scope.row.description }}</template>
      </el-table-column>
      <el-table-column label="用户" align="left">
        <template slot-scope="scope">
          <el-tag v-for="(item, index) in scope.row.users" :key="index" effect="plain" style="margin: 0px 2px 0px 2px"> {{ item.user_name }} </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button plain type="success" size="mini" @click="handleUpdate(scope)"> 修改 </el-button>
          <el-button plain type="danger" size="mini" @click="handleDelete(scope)"> 删除 </el-button>
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

    <el-dialog :visible.sync="dialogVisible" :title="dialogType === 'modify' ? '修改' : '新增'">
      <el-form ref="dataForm" :model="temp" :rules="rules" label-width="120px" label-position="right">
        <el-form-item label="角色名称">
          <el-input v-model="temp.role_name" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="temp.description" placeholder="请输入描述" />
        </el-form-item>
        <el-form-item label="权限">
          <el-tree
            ref="tree"
            node-key="id"
            :data="permissionOptions"
            show-checkbox
            :check-strictly="false"
            :props="defaultProps"
          />
        </el-form-item>
      </el-form>
      <div class="text-right">
        <el-button type="primary" @click="dialogType==='create'?createData(temp):updateData()"> 确定 </el-button>
        <el-button type="default" @click="dialogVisible = false"> 取消 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import Pagination from '@/components/Pagination'
import { getRoleList, createRole, updateRole, deleteRole } from '@/api/role'
import { getPermissionOptions } from '@/api/permission'
import { deepClone, dateFormat, dataConvert } from '@/utils'

const _temp = {
  id: '',
  role_name: '',
  description: '',
  permissions: [],
  create_user: '',
  update_user: ''
}

export default {
  components: { Pagination },
  filters: {
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
        limit: 10,
        keyword: undefined
      },
      temp: Object.assign({}, _temp),
      dialogVisible: false,
      dialogType: 'create',
      loading: false,
      permissionOptions: [],
      defaultProps: { children: 'children', label: 'title' },
      // 检验表单输入
      rules: {
        role_name: [{ required: true, trigger: 'blur', message: '请输入角色名称' }]
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
        keyword: undefined
      }
      this.fetchData()
    },
    fetchData() {
      this.listLoading = true
      getRoleList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
      getPermissionOptions().then(response => {
        this.permissionOptions = response.data
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
      this.dialogType = 'modify'
      this.temp = deepClone(scope.row)
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
        // 回显数据
        this.temp.permissions = dataConvert(this.temp.permissions)
        this.$refs.tree.setCheckedKeys(this.temp.permissions)
      })
    },
    handleDelete(scope) {
      this.$confirm('确认删除该条数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteRole({ 'id': scope.row.id }).then(res => {
          console.log('deleteRole...', res)
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
      this.temp.permissions = this.$refs.tree.getCheckedKeys()

      // 调用api创建数据入库
      createRole(this.temp).then(res => {
        this.updateLoading = false
        console.log('createRole...', res)
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
      this.temp.permissions = this.$refs.tree.getCheckedKeys()

      // 调用api更新数据入库
      updateRole(this.temp).then(res => {
        this.updateLoading = false
        console.log('updateRole...', res)
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
