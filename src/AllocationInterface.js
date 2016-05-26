class AllocationInterface {
  constructor() {
    this.name = 'Default Allocation Algorithm'
  }

  allocation(memory, job) {
    throw new Error('未选择分配算法!')
  }

  free(memory, job) {
    var isFree = false
    for (var i = 0; i < memory.length; ++i) {
      if (memory[i].jobIndex === job.index && memory[i].size >= job.size) {
        memory[i].jobIndex = -1
        this._merge(memory, i)
        isFree = true
        break
      }
    }
    if (!isFree) throw new Error('没有该内存块,无法释放内存!')
  }

  _merge(memory, index) {
    var startIndex = index
    var endIndex = index
    var size = memory[index].size
    if (index - 1 >= 0 && memory[index - 1].jobIndex < 0) {
      startIndex = index - 1
      size += memory[index - 1].size
    }
    if (index + 1 < memory.length && memory[index + 1].jobIndex < 0) {
      endIndex = index + 1
      size += memory[index + 1].size
    }
    if (startIndex === endIndex) return
    var start = memory[startIndex].start
    memory.splice(startIndex, endIndex - startIndex + 1, {start: start, size: size, jobIndex: -1})
  }
}

export default AllocationInterface