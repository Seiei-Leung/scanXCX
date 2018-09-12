// components/dialog/dialog.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    dialogTitle: {
      type: String,
      value: '标题'
    },
    dialogTxt: {
      type: String,
      value: '内容'
    },
    iconType: {
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isShowModel: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    hideModel: function() {
      this.setData({
        isShowModel: false
      })
    },
    showModal: function() {
      this.setData({
        isShowModel: true
      })
    },
    preventTouchMove: function() {}
  }
})
