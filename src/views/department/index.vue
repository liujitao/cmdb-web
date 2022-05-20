<template>
  <el-row>
    <el-col :span="10">
      <div class="app-container">
        <div class="filter-container">
          <el-input v-model="filterText" placeholder="输入关键字进行过滤" />
        </div>
        <div class="filter-container">
          <el-tree
            ref="tree"
            node-key="id"
            :data="treeData"
            :props="defaultProps"
            :check-strictly="false"
            :filter-node-method="filterNode"
            default-expand-all
          />
        </div>
      </div>
    </el-col>
    <el-col :span="14">
      <div class="app-container">
        <div class="filter-container">
          <el-alert
            title="请勿乱删除部门, 确实需要删除部门的时候, (1).请确定这个部门下面没有子部门, (2).请确定这个部门下面没有用户. 只有满足以上两种情况才可以删除部门成功!"
            type="warning"
          />
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import { getDepartmentTree } from '@/api/department'
import { deepClone } from '@/utils'

const _temp = {
  id: '',
  parent_id: '',
  department_name: ''
}

export default {
  data() {
    return {
      temp: Object.assign({}, _temp),
      dialogVisible: false,
      dialogType: 'create',
      loading: false,
      filterText: '',
      treeData: [],
      defaultProps: { children: 'children', label: 'department_name' }
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
      getDepartmentTree().then(response => {
        this.treeData = response.data
      })
    },
    resetTemp() {
      this.temp = Object.assign({}, _temp)
    },
    handlerCreate() {
      this.resetTemp()
      this.dialogVisible = true
      this.dialogType = 'create'
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handlerUpdate(scope) {
      this.resetTemp()
      this.dialogVisible = true
      this.dialogType = 'modify'
      this.temp = deepClone(scope.row)
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handlerDelete(scope) {
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
    }
  }
}
</script>
