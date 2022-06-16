<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button v-permission="['/setting/permission/post']" size="small" class="filter-item" type="primary" icon="el-icon-plus" @click="handleCreate"> 新增 </el-button>
    </div>

    <el-table
      ref="tree"
      v-loading="listLoading"
      element-loading-text="Loading"
      border
      fit
      height="100%"
      class="table-container"
      highlight-current-row
      :data="list"
      row-key="id"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column label="名称" width="150" align="left">
        <template slot-scope="scope">{{ scope.row.title }}</template>
      </el-table-column>

      <el-table-column label="类型" width="80" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.permission_type | typeTagFilter" effect="plain">{{ scope.row.permission_type | typeTextFilter }} </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="图标" width="120" align="center">
        <template slot-scope="scope">
          <i v-if="scope.row.permission_type!==2" :class="scope.row.icon" />
          <span v-else-if="scope.row.permission_type===2 && scope.row.path.match(/\/post$/g)">
            <el-tag size="mini" type="success" effect="plain">POST</el-tag>
          </span>
          <span v-else-if="scope.row.permission_type===2 && scope.row.path.match(/\/get$/g)">
            <el-tag size="small" type effect="plain">GET</el-tag>
          </span>
          <span v-else-if="scope.row.permission_type===2 && scope.row.path.match(/\/patch$/g)">
            <el-tag size="small" type="warning" effect="plain">PATCH</el-tag>
          </span>
          <span v-else-if="scope.row.permission_type===2 && scope.row.path.match(/\/delete$/g)">
            <el-tag size="small" type="danger" effect="plain">DELETE</el-tag>
          </span>
        </template>
      </el-table-column>

      <el-table-column label="标识" width="150">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>

      <el-table-column label="组件">
        <template slot-scope="scope">{{ scope.row.component }}</template>
      </el-table-column>

      <el-table-column label="路径">
        <template slot-scope="scope">{{ scope.row.path }}</template>
      </el-table-column>

      <el-table-column label="重定向url">
        <template slot-scope="scope">{{ scope.row.redirect }}</template>
      </el-table-column>

      <el-table-column label="排序" width="50" align="center">
        <template slot-scope="scope">{{ scope.row.sort_id }}</template>
      </el-table-column>

      <el-table-column label="操作" width="300" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button v-permission="['/setting/permission/patch']" plain type="success" size="mini" @click="handleUpdate(scope)"> 修改 </el-button>
          <el-button v-permission="['/setting/permission/delete']" plain type="danger" size="mini" @click="handleDelete(scope)"> 删除 </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType === 'modify' ? '修改' : '新增'">
      <el-form ref="dataForm" :model="temp" label-width="120px" label-position="right">

        <el-form-item label="类型">
          <el-radio-group v-model="temp.permission_type">
            <el-radio-button v-for="(type, index) in permissionType" :key="index" :label="index">{{ type }}</el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item :label="permissionType[temp.permission_type] + '名称'" prop="title">
          <el-input v-model="temp.title" :placeholder="permissionType[temp.permission_type] + '名称'" />
        </el-form-item>

        <el-form-item v-if="temp.permission_type!==0" label="所属上级">
          <el-cascader
            v-model="temp.parent_id"
            :options="parents"
            :props="{ checkStrictly: true, emitPath: false, expandTrigger: 'hover', value: 'id', label: 'title' }"
            :show-all-levels="false"
            clearable
          />
        </el-form-item>

        <el-form-item v-if="temp.permission_type===0" label="图标">
          <e-icon-picker v-model="temp.icon" :options="options" />
          <e-icon :icon-name="temp.icon" />
        </el-form-item>

        <el-form-item v-if="temp.permission_type!==2" label="标识">
          <el-input v-model="temp.name" placeholder="请输入标识" />
        </el-form-item>

        <el-form-item v-if="temp.permission_type!==2" label="组件">
          <el-input v-model="temp.component" placeholder="目录类型 填写 Layout, 菜单类型 填写对应的@/views目录, 如 settting/user/index" />
        </el-form-item>

        <el-form-item label="路径">
          <el-input v-model="temp.path" placeholder="操作类型 填写 上级菜单路径 + 对应操作 [ post get patch delete ], 如 settting/user/get" />
        </el-form-item>

        <el-form-item v-if="temp.permission_type ===0" label="重定向url">
          <el-input v-model="temp.redirect" placeholder="面包屑组件重定向,例 /setting/user, 可留空" />
        </el-form-item>

        <el-form-item label="排序">
          <el-input-number v-model="temp.sort_id" :precision="0" :min="0" :max="127" />
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

import { EIcon, EIconPicker } from 'e-icon-picker'
import 'e-icon-picker/lib/symbol.js' // 基本彩色图标库
import 'e-icon-picker/lib/index.css' // 基本样式，包含基本图标
import 'font-awesome/css/font-awesome.min.css' // font-awesome 图标库
import 'element-ui/lib/theme-chalk/icon.css' // element-ui 图标库

import { getPermissionList, createPermission, updatePermission, deletePermission } from '@/api/permission'
import { deepClone } from '@/utils'
import permission from '@/directive/permission/index.js' // 权限判断指令

const _temp = {
  id: '',
  parent_id: '',
  title: '',
  name: '',
  icon: '',
  path: '',
  component: '',
  permission_type: 0,
  sort_id: 0
}

export default {
  filters: {
    typeTagFilter(type) {
      const typeMap = {
        0: 'primary',
        1: 'success',
        2: 'warning'
      }
      return typeMap[type]
    },
    typeTextFilter(type) {
      const typeMap = {
        0: '目录',
        1: '菜单',
        2: '操作'
      }
      return typeMap[type]
    }
  },
  components: { EIcon, EIconPicker },
  directives: { permission },
  data() {
    return {
      filterText: '',
      list: [],
      parents: [],
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      listLoading: true,
      dialogVisible: false,
      dialogType: 'create',
      loading: false,
      temp: Object.assign({}, _temp),
      permissionType: ['目录', '菜单', '操作'],
      // e-icon-picker 配置
      options: {
        FontAwesome: true,
        ElementUI: true,
        eIcon: false, // 自带的图标，来自阿里妈妈
        eIconSymbol: false, // 是否开启彩色图标
        addIconList: [],
        removeIconList: [],
        zIndex: 3100// 选择器弹层的最低层,全局配置
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getPermissionList().then(response => {
        this.list = response.data
        this.parents = [...[{
          id: '',
          title: '根目录'
        }], ...response.data]
        this.listLoading = false
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
      })
    },
    handleDelete(scope) {
      this.$confirm('确认删除该条数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deletePermission({ 'id': scope.row.id }).then(res => {
          console.log('deletePermission...', res)
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
      createPermission(this.temp).then(res => {
        this.updateLoading = false
        console.log('createPermission...', res)
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
      updatePermission(this.temp).then(res => {
        this.updateLoading = false
        console.log('updatePermission...', res)
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
