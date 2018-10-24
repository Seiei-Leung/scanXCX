// pages/packagingoutstorage/packagingoutstorage.js
const app = getApp();
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
  onLoad: function (options) {
    var that = this;
    if (options.storageNum) {
      that.setData({
        storageNum: options.storageNum
      });
      wx.request({
        url: app.globalData.twUrl + '/estapi/api/CutPieceEntry/SearchBagDataByPosi?position=' + options.storageNum,
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
  outStorage: function (event) {
    var that = this;
    wx.request({
      url: app.globalData.twUrl + '/estapi/api/CutPieceEntry/OutBagStore',
      data: {
        orderno: event.currentTarget.dataset.orderno,
        position: that.data.storageNum,
        bedno: event.currentTarget.dataset.bednno ? event.currentTarget.dataset.bednno : "0",
        kind: event.currentTarget.dataset.kind,
        sizes: event.currentTarget.dataset.sizes ? event.currentTarget.dataset.sizes : "0"
      },
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        if (res.data.result == "SUCCESS") {
          that.setData({
            dialogTitle: "成功",
            dialogTxt: "打包出仓成功",
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