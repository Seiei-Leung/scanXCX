const app = getApp();
var interval = ""; // 记录/清理 时间记录


Page({
  data: {
    storageFloor: '',
    resourceData: [],
    resultList: [],
    letterList: [],
    letterListOfPage: [
      ["A", "B", "C", "D", "E"],
      ["F", "G", "H", "I", "J"]
    ],
    nth: 0, // 设置活动菜单的index
    tmpFlag: true, // 判断左右华东超出菜单最大值时不再执行滑动事件
    time: 0, //  时间记录，用于滑动时且时间小于1s则执行左右滑动
    touchDot: 0, //触摸时的原点
  },
  onLoad: function (options) {
    this.setData({
      storageFloor: options.storageFloor
    });
    var that = this;
    wx.request({
      url: app.globalData.twUrl + '/estapi/api/CutPieceEntry/QueryPosition?key=' + that.data.storageFloor,
      method: "GET",
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({
          resourceData: res.data
        });
        that.resetResultList();
      }
    })
  },
  onShow: function () {

  },
  // 触摸开始事件
  touchStart: function (e) {
    this.setData({
      touchDot: e.touches[0].pageX // 获取触摸时的原点
    });
    var that = this;
    // 使用js计时器记录时间    
    interval = setInterval(function() {
      that.setData({
        time: that.data.time+1 // 获取触摸时的原点
      });
    }, 100);
  },
  // 触摸移动事件
  touchMove: function (e) {
    var touchMove = e.touches[0].pageX;
    // 向左滑动   
    if (touchMove - this.data.touchDot <= -40 && this.data.time < 10) {
      if (this.data.tmpFlag && this.data.nth < this.data.letterListOfPage.length-1) { //每次移动中且滑动时不超过最大值 只执行一次
        this.setData({
          nth: this.data.nth+1,
          tmpFlag: false
        });
        this.resetResultList();
      }
    }
    // 向右滑动
    if (touchMove - this.data.touchDot >= 40 && this.data.time < 10) {
      if (this.data.tmpFlag && this.data.nth > 0) {
        this.setData({
          nth: this.data.nth-1
        });
        this.resetResultList();
      }
    }
  },
  // 触摸结束事件
  touchEnd: function (e) {
    clearInterval(interval); // 清除setInterval
    this.setData({
      time: 0,
      tmpFlag: true // 回复滑动事件
    });
  },
  // 切换页面 
  resetResultList: function() {
    var letterList = this.data.letterListOfPage[this.data.nth];
    var resultList = [];
    for (var i = 0; i < letterList.length; i++) {
      var list = [];
      var resourceData = this.data.resourceData;
      for (var n = 0; n < resourceData.length; n++) {
        if (resourceData[n].code[0] == letterList[i]) {
          list.push(resourceData[n]);
        }
      }
      resultList.push(list);
    }
    this.setData({
      resultList: resultList,
      letterList: letterList
    });
  }
})