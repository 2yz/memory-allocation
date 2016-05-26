import AllocationInterface from './AllocationInterface'

class BestFit extends AllocationInterface {
  constructor() {
    super()
    this.name = 'BestFit'
  }

  allocation(memory, job) {
    var index = -1
    var size = 0
    for (var i = 0; i < memory.length; ++i) {
      if (memory[i].jobIndex < 0 && memory[i].size >= job.size) {
        if (index < 0) {
          index = i
          size = memory[i].size
        } else if (memory[i].size < size) {
          index = i
          size = memory[i].size
        }
      }
    }
    if (index === -1) throw new Error('空余内存空间不足')
    var start = memory[index].start
    if (size === job.size) {
      memory.splice(index, 1, {start: start, size: job.size, jobIndex: job.index})
    } else {
      memory.splice(index, 1, {start: start, size: job.size, jobIndex: job.index},
        {start: start + job.size, size: memory[index].size - job.size, jobIndex: -1})
    }
  }
}

export default BestFit