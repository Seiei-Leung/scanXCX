//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
  },
  goscan: function () {
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        var result = res.result;
        if (result.split(":").length > 6) {
          wx.showModal({
            title: '提示',
            content: "仓位码格式不符"
          });
        } else {
          wx.navigateTo({
            url: '../scanresult/scanresult?storageNum=' + result
          })
        }
      }
    });
    // wx.navigateTo({
    //   url: '../scanresult/scanresult?storageNum=4b01-1'
    // })
  },
  getOut: function() {
    wx.navigateBack({
      delta: -1
    });
  },
  onLoad: function () {
  },
  goSearch: function () {
    wx.navigateTo({
      url: '../search/search'
    })
  },
  requestTest: function() {
    var sendData = {};
    sendData.orderno = 'KF174TK22B';
    sendData.part = '上衣';
    sendData.bedno = '2';
    sendData.grpno = '31';
    sendData.color = '粉红';
    sendData.sizes = '160';
    sendData.quantity = '5';
    sendData.kind = "分码";
    sendData.position = '4A01-1';
    var getUrl = app.globalData.twUrl + "/estapi/api/CutPieceEntry/InsertMatchedData";
    wx.request({
      url: getUrl,
      data: sendData,
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data);
      }
    })
  }
})
