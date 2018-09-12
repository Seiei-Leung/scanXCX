// pages/scanresult/scanresult.js

var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeIndex: 0,
    storageNum: "",
    orderno: "",
    bedNum: "",
    size: "",
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
      wx.request({
        url: app.globalData.twUrl + '/estapi/api/CutPieceEntry/?p1=' + options.storageNum,
        data: {},
        method: 'GET',
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          that.setData({
            storageNum: options.storageNum
          })
          if (res.data[0] && res.data[0].kind == "分床") {
            that.setData({
              activeIndex: 0,
              orderno: res.data[0].orderno,
              bedNum: res.data[0].bednno
            })
          } else if (res.data[0] && res.data[0].kind == "分码") {
            that.setData({
              activeIndex: 1,
              orderno: res.data[0].orderno,
              size: res.data[0].sizes
            })
          }
        }
      })
    }
  },
  scanForBedNum: function (event) {
    var
      that = this,
      getUrl,
      kind = event.currentTarget.dataset.kind;
    
    if (kind == "bed") {
      kind = "分床";
      getUrl = app.globalData.twUrl + "/estapi/api/CutPieceEntry/InsertData";
      that.setData({
        activeIndex: 0
      });
    } else {
      kind = "分码";
      getUrl = app.globalData.twUrl + "/estapi/api/CutPieceEntry/InsertMatchedData";
      that.setData({
        activeIndex: 1
      });
    }
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        if (res.result.split(":").length < 6) {
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
          sendData.orderno = Scanresult[8];
          sendData.part = Scanresult[0];
          sendData.bedno = Scanresult[6];
          sendData.grpno = Scanresult[5];
          sendData.color = Scanresult[2];
          sendData.sizes = Scanresult[9];
          sendData.quantity = Scanresult[3];
          sendData.kind = kind;
          sendData.position = that.data.storageNum;
          wx.request({
            url: getUrl,
            data: sendData,
            method: 'GET',
            header: {
              'Content-Type': 'application/json'
            },
            complete: function (res) {
              if (res.data.result == "SUCCESS") {
                that.setData({
                  orderno: sendData.orderno,
                  bedNum: sendData.bedno,
                  size: sendData.sizes
                });
                that.setData({
                  dialogTitle: "成功",
                  dialogTxt: "扫码成功",
                  iconType: 1
                });
                that.dialog.showModal();
              } else {
                that.setData({
                  dialogTitle: "失败",
                  dialogTxt: JSON.stringify(res.data.result),
                  iconType: 0
                });
                that.dialog.showModal();
              }
            }
          })
        }
      }
    });
  },
  inputByHand: function() {
    wx.navigateTo({
      url: '../inputbyhand/inputbyhand?storageNum=' + this.data.storageNum
    })
  }
})