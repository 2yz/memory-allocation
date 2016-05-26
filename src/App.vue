<template xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml">
  <div class="am-container title" style="margin-top: 16px;">
    <h1>动态分区分配方式模拟</h1>
  </div>
  <div class="am-g am-g-fixed">
    <div class="am-u-sm-3">
      <label>内存</label><br/>
      <div class="memory-container">
        <div v-for="item in memory" class="memory-block am-vertical-align animated"
             v-bind:class="{'used':item.jobIndex>=0, 'bounceIn':item.jobIndex>=0 ,'spare':item.jobIndex<0, 'fadeIn':item.jobIndex<0}"
             v-bind:style="{ height: item.size / totalMemory * 100 + '%'}">
          <div class="am-vertical-align-middle center ">
            <span class="memory-size">{{item.size + 'K'}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="am-u-sm-9">
      <div>
        <form class="am-form">
          <div class="am-form-group">
            <label>分配请求</label><br/>
            <textarea v-model="code" class="code" rows="10"></textarea>
          </div>
        </form>
      </div>
      <div>
        <form class="am-form-inline" style="margin: 16px auto;">
          <div class="am-form-group">
            <select v-model="algorithm" v-on:change="selectAlgorithm" class="am-form-field">
              <option selected disabled>选择分配算法</option>
              <option>首次适应算法</option>
              <option>最佳适应算法</option>
            </select>
          </div>
          <div class="am-form-group">
            <button v-on:click="execOneJob" type="button" class="am-btn am-btn-default">逐条执行</button>
            <button v-on:click="execAllJob" type="button" class="am-btn am-btn-default">全部执行</button>
            <button v-on:click="reload" type="button" class="am-btn am-btn-default">重置</button>
          </div>
        </form>
      </div>
      <div>
        <label>已执行的请求</label><br/>
        <select class="executed" size="10" multiple>
          <option v-for="item in executed" track-by="$index">{{item}}</option>
        </select>
      </div>
    </div>
  </div>
  <div class="am-modal am-modal-alert" tabindex="-1" id="my-alert">
    <div class="am-modal-dialog">
      <div class="am-modal-hd"></div>
      <div class="am-modal-bd">{{modalMsg}}</div>
      <div class="am-modal-footer">
        <span class="am-modal-btn">确定</span>
      </div>
    </div>
  </div>
</template>

<script>
  import memoryManagement from './MemoryManagement'

  export default {
    init () {

    },
    data () {
      return {
        msg: 'Hello World! 233',
        code: '作业1申请130K\n作业2申请60K\n作业3申请100k\n作业2释放60K\n作业4申请200K\n作业3释放100K\n作业1释放130K\n作业5申请140K\n作业6申请60K\n作业7申请50K\n作业6释放60K',
        algorithm: '选择分配算法',
        executed: [],
        totalMemory: memoryManagement.totalMemory,
        memory: memoryManagement.memory,
        modalMsg: ''
      }
    },
    methods: {
      selectAlgorithm (e) {
        memoryManagement.selectAllocationAlgorithm(e.target.value)
      },
      execOneJob () {
        this.processJob()
      },
      execAllJob () {
        while (this.processJob()) {
        }
      },
      reload () {
        window.location.reload()
      },
      processJob () {
        if (this.algorithm === '选择分配算法') {
          this.modal('请选择分配算法!')
          return false
        }
        var index = this.code.indexOf('\n')
        var jobStr = ''
        if (index < 0) {
          if (this.code.length !== 0) {
            jobStr = this.code
            this.code = ''
          } else {
            return false
          }
        } else {
          jobStr = this.code.slice(0, index)
          this.code = this.code.slice(index + 1, this.code.length)
        }
        var job = {
          index: undefined,
          size: undefined,
          action: -1
        }
        job.index = parseInt(jobStr.substr(jobStr.search(/[0-9]+/)))
        job.size = parseInt(jobStr.substr(jobStr.search(/[0-9]+K|[0-9]+k/)))
        if (jobStr.indexOf('申请') >= 0) {
          job.action = 1
        } else if (jobStr.indexOf('释放') >= 0) {
          job.action = 0
        }
        if (isNaN(job.index) || isNaN(job.size) || job.action === -1) {
          this.modal('作业指令不正确!')
          return false
        }
        try {
          memoryManagement.allocation(job)
        } catch (e) {
          this.modal(e.message)
          this.executed.push(jobStr + '【失败】')
          return false
        }
        this.executed.push(jobStr)
        return true
      },
      modal (msg) {
        this.modalMsg = msg
        $('#my-alert').modal();
      }
    }
  }
</script>

<style>
  .title {
    text-align: center;
  }

  .memory-container {
    height: 530px;
    border: 1px solid #686868;
  }

  .memory-block {
    width: 100%;
    border: 1px solid #686868;
    box-sizing: border-box;
  }

  .center {
    width: 100%;
    text-align: center;
  }

  .memory-size {
    color: #686868;
    font-weight: bold;
    /*background-color: rgba(255, 255, 255, 0.7);*/
  }

  .used {
    background-color: rgba(240, 128, 128, 0.6);
  }

  .spare {
    background-color: rgba(144, 238, 144, 0.6);
  }

  .code {
    width: 100%;
  }

  .executed {
    width: 100%;
  }
</style>
