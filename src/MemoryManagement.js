import AllocaionInterface from './AllocationInterface'
import FirstFit from './FirstFit'
import BestFit from './BestFit'

var allocationInterface = new AllocaionInterface()
var firstFit = new FirstFit()
var bestFit = new BestFit()

class MemoryManagement {
  constructor() {
    this.allocationAlgorithm = allocationInterface
    this.totalMemory = 640
    this.memory = [{start: 0, size: 640, jobIndex: -1}]
  }

  selectAllocationAlgorithm(algorithmName) {
    switch (algorithmName) {
      case '首次适应算法':
        this.allocationAlgorithm = firstFit
        break;
      case '最佳适应算法':
        this.allocationAlgorithm = bestFit
        break;
    }
  }

  allocation(job) {
    if (job.action) {
      this.allocationAlgorithm.allocation(this.memory, job)
    } else {
      this.allocationAlgorithm.free(this.memory, job)
    }
  }
}

var memoryManagement = new MemoryManagement()

export default memoryManagement