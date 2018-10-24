
var app = getApp();

Page({
  data: {
    storageNum: "",
    resultList: [],
    dialogTitle: "",
    dialogTxt: "",
    iconType: 0
  },
  onReady: function () {
    this.dialog = this.selectComponent("#dialog");
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    if (options.storageNum) {
      that.setData({
        storageNum: options.storageNum
      });
      wx.request({
        url: app.globalData.twUrl + '/estapi/api/CutPieceEntry/?p1=' + options.storageNum,
        data: {},
        method: 'GET',
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          that.setData({
            resultList: res.data
          })
          console.log(res.data)
        }
      })
    }
  },

  outStorage: function(event) {
    console.log(123);
    var that = this;
    wx.request({
      url: app.globalData.twUrl + '/estapi/api/CutPieceEntry/OutStore',
      data: {
        orderno: event.currentTarget.dataset.orderno,
        position: that.data.storageNum,
        sizes: event.currentTarget.dataset.sizes ? event.currentTarget.dataset.sizes : "0",
        kind: event.currentTarget.dataset.kind,
        bedno: event.currentTarget.dataset.bednno ? event.currentTarget.dataset.bednno : "0"
      },
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        if (res.data.result == "SUCCESS") {
          that.setData({
            dialogTitle: "成功",
            dialogTxt: "出仓成功",
            iconType: 1
          })
          that.dialog.showModal();
          var list = that.data.resultList.slice(0, that.data.resultList.length);
          list.splice(event.currentTarget.dataset.index, 1);
          that.setData({
            resultList: list
            });
        } else {
          that.setData({
            dialogTitle: "失败",
            dialogTxt: JSON.stringify(res.data.result),
            iconType: 0
          })
          that.dialog.showModal();

        }
      }
    })
  }
})