import AllocationInterface from './AllocationInterface'

class FirstFit extends AllocationInterface {
  constructor() {
    super()
    this.name = 'FirstFit'
  }

  allocation(memory, job) {
    var isAllocated = false
    for (var i = 0; i < memory.length; ++i) {
      if (memory[i].jobIndex < 0) {
        var memorySize = memory[i].size
        var start = memory[i].start
        if (memorySize > job.size) {
          memory.splice(i, 1, {start: start, size: job.size, jobIndex: job.index},
            {start: start + job.size, size: memorySize - job.size, jobIndex: -1})
          isAllocated = true
          break
        } else if (memorySize === job.size) {
          memory.splice(i, 1, {start: start, size: job.size, jobIndex: job.index})
          isAllocated = true
          break
        }
      }
    }
    if (!isAllocated) throw new Error('空余内存空间不足')
  }
}

export default FirstFit