// pages/scanresult/scanresult.js

var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    storageNum: "",
    dialogTitle: "",
    dialogTxt: "",
    iconType: 0,
    resultList: [],
    kind: ""
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
            storageNum: options.storageNum,
            resultList: res.data,
            kind: res.data[0] ? res.data[0].kind : ""
          })
        }
      })
    }
  },
  scanForBedNum: function (event) {
    if (this.data.resultList.length == 2) {
      this.setData({
        dialogTitle: "提示",
        dialogTxt: "仓位放置裁片限为两床次或两码的货物！",
        iconType: 0
      });
      this.dialog.showModal();
      return;
    }
    var
      that = this,
      getUrl,
      kind = event.currentTarget.dataset.kind;
    
    if (kind == "bed") {
      if (this.data.kind == '分码') {
        this.setData({
          dialogTitle: "提示",
          dialogTxt: "该仓位为分码，不能放分床裁片",
          iconType: 0
        });
        this.dialog.showModal();
        return;
      }
      kind = "分床";
      getUrl = app.globalData.twUrl + "/estapi/api/CutPieceEntry/InsertData";
    } else {
      if (this.data.kind == '分床') {
        this.setData({
          dialogTitle: "提示",
          dialogTxt: "该仓位为分床，不能放分码裁片",
          iconType: 0
        });
        this.dialog.showModal();
        return;
      }
      kind = "分码";
      getUrl = app.globalData.twUrl + "/estapi/api/CutPieceEntry/InsertMatchedData";
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
                var obj = {};
                obj.orderno = sendData.orderno;
                obj.bednno = sendData.bedno;
                obj.sizes = sendData.sizes;
                obj.kind = sendData.kind;
                var list = that.data.resultList.slice(0, 2);
                list.push(obj);
                that.setData({
                  kind: sendData.kind,
                  resultList: list,
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
  inputByHand: function () {
    if (this.data.resultList.length == 2) {
      this.setData({
        dialogTitle: "提示",
        dialogTxt: "仓位放置裁片限为两床次或两码的货物！",
        iconType: 0
      });
      this.dialog.showModal();
      return;
    }
    wx.navigateTo({
      url: '../inputbyhand/inputbyhand?storageNum=' + this.data.storageNum
    })
  }
})