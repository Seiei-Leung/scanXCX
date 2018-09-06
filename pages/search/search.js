var T;
var app = getApp();

Page({
  data: {
    selectCodes: ["制单"],
    selectCodeIndex: 0,
    inputValue: "",
    tabs: ["分码", "分床"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    resultList: []
  },
  bindKeyInput: function (e) {
    var that = this;
    clearTimeout(T);
    T = setTimeout(() => {
      wx.request({
        url: app.globalData.twUrl + "/estapi/api/CutPieceEntry/SearchData?kind=" + that.data.selectCodes[that.data.selectCodeIndex] + "&keyword=" + e.detail.value,
        method: "GET",
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          console.log(res.data);
          that.setData({
            resultList: res.data
          });
        }

      });
    }, 1500);
  },
  onLoad: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - 112) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  }
});