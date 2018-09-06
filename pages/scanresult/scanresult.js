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
    size: ""
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
          if (res.data.kind && res.data.kind == "分床") {
            that.setData({
              activeIndex: 0,
              orderno: res.data.orderno,
              bedNum: res.data.bednno
            })
          } else if (res.data.kind && res.data.kind == "分码") {
            that.setData({
              activeIndex: 1,
              orderno: res.data.orderno,
              size: res.data.sizes
            })
          }
        }
      })
    }
  },
  outStorage: function () {
    var that = this;
    if (that.data.storageNum) {
      wx.request({
        url: app.globalData.twUrl + '/estapi/api/CutPieceEntry/OutStore',
        data: {
          orderno: that.data.orderno,
          position: that.data.storageNum
        },
        method: 'GET',
        header: {
          'Content-Type': 'application/json'
        },
        success: function (res) {
          console.log(res.data);
          if (res.data.result == "SUCCESS") {
            that.setData({
              orderno: "",
              bedNum: "",
              size: ""
            });
            wx.showToast({
              title: '出仓成功',
              icon: 'success',
              duration: 1000
            })
          } else {
            wx.showToast({
              title: res.data.result,
              icon: 'fail',
              duration: 1000
            })
          }
        },
        fail: function (res) {
          console.log(res.data);
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
          wx.showModal({
            title: '扫码失败',
            content: "工飞码格式不符"
          });
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
                })
                wx.showModal({
                  title: '成功',
                  content: "扫码成功"
                });
              } else {
                wx.showModal({
                  title: '失败',
                  content: JSON.stringify(res.data.result)
                });

              }

            }
          })
        }

      }
    });
  }
})