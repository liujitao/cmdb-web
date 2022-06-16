<template>
  <el-row>
    <el-col :span="10">
      <div class="app-container">
        <div class="filter-container">
          <el-tree
            ref="tree"
            node-key="id"
            accordion
            :data="treeData"
            :props="{ children: 'children', label: 'department_name' }"
            :check-strictly="true"
            :default-expand-all="true"
            :highlight-current="true"
            @node-click="handleTreeClick"
          />
        </div>
      </div>
    </el-col>
    <el-col :span="14">
      <div class="app-container">
        <div class="filter-container">
          <span>部门详细信息</span>
          <el-button-group style="float: right;">
            <el-button v-permission="['/setting/department/post']" type="primary" size="small" @click="handlerCreate">新增</el-button>
            <el-button v-permission="['/setting/department/patch']" type="success" size="small" @click="handlerUpdate">修改</el-button>
            <el-button v-permission="['/setting/department/delete']" type="danger" size="small" @click="handlerDelete">删除</el-button>
          </el-button-group>
        </div>

        <div class="filter-container" />
        <el-form ref="dataForm" :model="temp" :rules="rules" label-width="120px">
          <el-form-item>
            <span>部门人员数量</span>
            <el-tag type="warning">{{ temp.sort_id }}</el-tag>
            <span>部门资产数量</span>
            <el-tag type="warning">{{ temp.sort_id }}</el-tag>
          </el-form-item>
          <el-form-item v-if="temp.id" label="部门ID">
            <el-input v-model="temp.id" :disabled="true" />
          </el-form-item>
          <el-form-item label="部门名称" prop="department_name">
            <el-input v-model="temp.department_name" :disabled="isEdit" clearable />
          </el-form-item>
          <el-form-item label="部门描述" prop="description">
            <el-input v-model="temp.description" :disabled="isEdit" clearable />
          </el-form-item>
          <el-form-item label="上级部门" prop="parent_id">
            <el-cascader
              ref="cascader"
              v-model="temp.parent_id"
              :options="treeData"
              :props="{ checkStrictly: true, emitPath: false, multiple: false, children: 'children', value: 'id', label: 'department_name' }"
              :show-all-levels="true"
              :disabled="isEdit"
              clearable
              style="width: 100%"
            />
          </el-form-item>
          <el-form-item label="部门排序" prop="sort_id">
            <el-input-number v-model="temp.sort_id" :disabled="isEdit" :min="1" :max="10000" />
          </el-form-item>
          <el-form-item v-if="isEdit === false">
            <el-button type="primary" size="small" plain @click="handlerType==='create'?createData():updateData()"> 保存 </el-button>
            <el-button type="default" size="small" plain @click="isEdit = false"> 取消 </el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import { Message } from 'element-ui'
import { getDepartmentTree, createDepartment, updateDepartment, deleteDepartment } from '@/api/department'
import permission from '@/directive/permission/index.js' // 权限判断指令

const _temp = {
  id: '',
  department_name: '',
  parent_id: '',
  sort_id: 0,
  create_user: '',
  update_user: ''
}

export default {
  directives: { permission },
  data() {
    return {
      temp: Object.assign({}, _temp),
      loading: false,
      isEdit: true, // 是否可以编辑
      handlerType: '', // 新建 or 编辑
      filterText: '',
      treeData: [],
      // 校验规则
      rules: {
        parent_id: [{ required: true, message: '上级部门必须填写', trigger: 'blur' }],
        department_name: [{ required: true, message: '部门名称必须填写', trigger: 'blur' }],
        description: [{ required: true, message: '部门描述必须填写', trigger: 'blur' }],
        sort_id: [{ required: true, message: '部门排序必须填写,且必须是数字', trigger: 'blur' }]
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    search() {
      this.fetchData()
    },
    refresh() {
      this.fetchData()
    },
    fetchData() {
      this.loading = true
      getDepartmentTree().then(response => {
        this.loading = false
        this.treeData = response.data
      })
    },
    handleTreeClick(data) {
      this.resetTemp()
      this.isEdit = true
      this.temp = data
      console.log(data)
    },
    resetTemp() {
      this.temp = Object.assign({}, _temp)
    },
    createData() {
      this.temp.create_user = this.$store.getters.name

      // 调用api创建数据入库
      createDepartment(this.temp).then(res => {
        console.log('createDepartment...', res)
        this.fetchData()
        this.isEdit = true

        Message({
          message: res.message || 'Error',
          type: 'success',
          duration: 3 * 1000
        })
      }).catch(err => {
        console.log(err)
      })
    },
    updateData() {
      this.temp.update_user = this.$store.getters.name

      // 调用api创建数据入库
      updateDepartment(this.temp).then(res => {
        console.log('updateDepartment...', res)
        this.fetchData()
        this.isEdit = true

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
    handlerCreate() {
      this.resetTemp()
      this.isEdit = false
      this.handlerType = 'create'
    },
    handlerUpdate() {
      this.isEdit = false
      this.handlerType = 'update'
    },
    handlerDelete() {
      this.$confirm('确认删除该条数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteDepartment({ 'id': this.temp.id }).then(res => {
          console.log('deleteDepartment...', res)
          this.fetchData()

          Message({
            message: res.message || 'Error',
            type: 'success',
            duration: 3 * 1000
          })
        }).catch(err => {
          console.log(err)
        })
      })
    }
  }
}
</script>
