//index.js
//获取应用实例
const app = getApp();

Page({
  data: {
  },
  onReady: function () {
    this.dialog = this.selectComponent("#dialog");
  },
  goscan: function () {
    var that = this;
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        var result = res.result;
        wx.request({
          url: app.globalData.twUrl + '/estapi/api/CutPieceEntry/CheckPosition?p2=' + result,
          data: {},
          method: 'GET',
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            if (res.data.name) {
              wx.navigateTo({
                url: '../scanresult/scanresult?storageNum=' + result
              });
            } else {
              that.showDialog();
            }
          }
        })
      }
    });
    // wx.navigateTo({
    //   url: '../scanresult/scanresult?storageNum=4a04上'
    // })
    // wx.navigateTo({
    //   url: '../inputbyhand/inputbyhand?storageNum=4b01-1'
    // })
  },
  getOut: function () {
    var that = this;
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        var result = res.result;
        wx.request({
          url: app.globalData.twUrl + '/estapi/api/CutPieceEntry/CheckPosition?p2=' + result,
          data: {},
          method: 'GET',
          header: {
            'content-type': 'application/json'
          },
          success: function(res) {
            if (res.data.name) {
              wx.navigateTo({
                url: '../scanoutresult/scanoutresult?storageNum=' + result
              });
            } else {
              that.showDialog();
            }
          }
        })
      }
    });
    // wx.navigateTo({
    //   url: '../scanoutresult/scanoutresult?storageNum=3A05下'
    // })
  },
  onLoad: function () {
  },
  goSearch: function () {
    wx.navigateTo({
      url: '../search/search'
    })
  },
  showDialog() {
    this.dialog.showModal();
  }
})
