
const app = getApp();

Page({
  data: {
    storageNum: "",
    dialogTitle: "",
    dialogTxt: "",
    iconType: 0,
    resultList: []
  },
  onReady: function () {
    this.dialog = this.selectComponent("#dialog");
  },
  onLoad: function (options) {
    this.setData({
      storageNum: options.storageNum
    })
  },
  onShow: function () {
    var that = this;
    if (that.data.storageNum) {
      wx.request({
        url: app.globalData.twUrl + '/estapi/api/CutPieceEntry/SearchBagDataByPosi?position=' + that.data.storageNum,
        data: {},
        method: 'GET',
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          that.setData({
            resultList: res.data
          })
        }
      })
    }
  },
  scan: function() {
    var that = this;
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        if (!(res.result.split(":").length == 4)) {
          that.setData({
            dialogTitle: "扫码失败",
            dialogTxt: "工飞码格式不符",
            iconType: 0
          })
          that.dialog.showModal();
        } else {
          var
            Scanresult = res.result.split(":"),
            sendData = {};
          sendData.orderno = Scanresult[0];
          sendData.bedno = Scanresult[1];
          sendData.grpno = "0";
          sendData.position = that.data.storageNum
            wx.request({
              url: app.globalData.twUrl + "/estapi/api/CutPieceEntry/InsertBagData",
              data: sendData,
              type: "GET",
              complete: function (res1) {
                console.log(res1)
                if (res1.data.result == "SUCCESS") {
                  that.setData({
                    dialogTitle: "成功",
                    dialogTxt: "打包入仓成功",
                    iconType: 1
                  })
                  that.dialog.showModal();
                } else {
                  that.setData({
                    dialogTitle: "失败",
                    dialogTxt: res1.errMsg,
                    iconType: 0
                  })
                  that.dialog.showModal();
                  console.log(that.data.dialogTitle)
                }
              }
            })
        }
      }
    })
  }
})