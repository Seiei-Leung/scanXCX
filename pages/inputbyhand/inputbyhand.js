// pages/inputbyhand/inputbyhand.js
const app = getApp();
var T;

Page({
  data: {
    activeIndex: 0,
    isSelectOrdernum: false,
    resultList: [],
    inputTxt: '',
    bednum: '',
    sizenum: '',
    storageNum: '',
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
    this.setData({
      storageNum: options.storageNum
    })

  },
  clickForBedNum: function (event) {
    var kind = event.currentTarget.dataset.kind;
    this.setData({
      activeIndex: (kind == "bed" ? 0 : 1)
    })
    console.log(this.data.activeIndex)
  },
  inputChange: function (e) {
    this.setData({
      isSelectOrdernum: true
    });
    var that = this;
    clearTimeout(T);
    T = setTimeout(() => {
      wx.request({
        url: app.globalData.twUrl + '/estapi/api/WorkOrder?keywords=' + e.detail.value,
        method: "GET",
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          that.setData({
            resultList: res.data
          });
          that.setData({
            inputTxt: e.detail.value
          })
        }
      })
    }, 1500);
  },
  cancelBtnSelect: function () {
    this.setData({
      isSelectOrdernum: false
    })
  },
  submitBtn: function () {
    var getUrl;
    var that = this;
    var sendData={};
    sendData.position = this.data.storageNum;
    sendData.part = "0";
    sendData.grpno = "0";
    sendData.color = "0";
    sendData.quantity = "0";
    if (this.data.activeIndex == 0) {
      if (!this.data.bednum || !this.data.inputTxt) {
        this.setData({
          dialogTitle: "失败",
          dialogTxt: "请输入制单号及床次",
          iconType: 0
        })
        this.dialog.showModal();
        return;
      } else {
        getUrl = app.globalData.twUrl + '/estapi/api/CutPieceEntry/InsertData';
        sendData.orderno = this.data.inputTxt;
        sendData.bedno = this.data.bednum;
        sendData.sizes = "0";
        sendData.kind = "分床";
      }
    } else {
      if (!this.data.sizenum || !this.data.inputTxt) {
        this.setData({
          dialogTitle: "失败",
          dialogTxt: "请输入制单号及尺码",
          iconType: 0
        })
        this.dialog.showModal();
        return;
      } else {
        getUrl = app.globalData.twUrl + "/estapi/api/CutPieceEntry/InsertMatchedData";
        sendData.orderno = this.data.inputTxt;
        sendData.sizes = this.data.sizenum;
        sendData.bedno = "0";
        sendData.kind = "分码";
      }
    }
    wx.request({
      url: getUrl,
      data: sendData,
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        if (res.data.result == "SUCCESS") {
          that.setData({
            dialogTitle: "成功",
            dialogTxt: "入仓成功",
            iconType: 1
          })
          that.dialog.showModal();
          that.setData({
            inputTxt: "",
            bednum: '',
            sizenum: ''
          })
        } else {
          that.setData({
            inputTxt: "",
            bednum: '',
            sizenum: ''
          });
          that.setData({
            dialogTitle: "失败",
            dialogTxt: JSON.stringify(res.data.result),
            iconType: 0
          })
          that.dialog.showModal();
        }
      }
  })
  },
  selectOrdernum: function(e) {
    this.setData({
      inputTxt: e.currentTarget.dataset.ordernum,
      isSelectOrdernum: false
    });
  },
  bednumChange: function (e) {
    this.setData({
      bednum: e.detail.value
    })
  },
  sizenumChange: function (e) {
    this.setData({
      sizenum: e.detail.value
    })
  }
})