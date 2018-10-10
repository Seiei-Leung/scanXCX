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
        iconType: 0,
        kind: "",
        sizeArray: [],
        sizeindex: 0,
        bedArray: [],
        bedindex: 0,
        radioList: [
          { value: '是' },
          { value: '否', checked: 'true' }
        ],
        radioValue: '否'
    },
    onReady: function() {
        this.dialog = this.selectComponent("#dialog");
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            storageNum: options.storageNum,
            activeIndex: (options.kind == "分码" ? 1 : 0),
            kind: options.kind
        })
    },
    clickForBedNum: function(event) {
        var kind = event.currentTarget.dataset.kind;
        if (this.data.kind) {
            if (this.data.kind == "分码" && kind == "bed") {
                this.setData({
                    dialogTitle: "提示",
                    dialogTxt: "该仓位为分码，不能放分床裁片",
                    iconType: 0
                })
                this.dialog.showModal();
            } else if (this.data.kind == "分床" && kind == "size") {
                this.setData({
                    dialogTitle: "提示",
                    dialogTxt: "该仓位为分床，不能放分码裁片",
                    iconType: 0
                })
                this.dialog.showModal();
            }
        } else {
            this.setData({
                activeIndex: (kind == "bed" ? 0 : 1)
            })
        }
    },
    inputChange: function(e) {
        this.setData({
            isSelectOrdernum: true
        });
        var that = this;
        clearTimeout(T);
        T = setTimeout(() => {
            wx.request({
                url: app.globalData.twUrl + '/estapi/api/WorkOrder?keywords=' + escape(e.detail.value),
                method: "GET",
                header: {
                    'content-type': 'application/json'
                },
                success: function(res) {
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
    cancelBtnSelect: function() {
        this.setData({
            isSelectOrdernum: false
        })
    },
    submitBtn: function() {
        var getUrl;
        var that = this;
        var sendData = {};
        sendData.position = this.data.storageNum;
        sendData.part = "0";
        sendData.grpno = "0";
        sendData.color = "0";
        sendData.quantity = "0";
        sendData.matched = that.data.radioValue;
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
            success: function(res) {
                if (res.data.result == "SUCCESS") {
                    that.setData({
                        dialogTitle: "成功",
                        dialogTxt: "入仓成功",
                        iconType: 1,
                        inputTxt: "",
                        bednum: '',
                        sizenum: '',
                        kind: sendData.kind,
                        sizeArray: [],
                        bedArray: []
                    })
                    that.dialog.showModal();
                } else {
                    that.setData({
                        inputTxt: "",
                        bednum: '',
                        sizenum: '',
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
        var getUrl;
        var that = this;
        if (this.data.activeIndex == 0) {
            getUrl = app.globalData.twUrl + "/estapi/api/CutPieceEntry/Bedtime?orderno=" + escape(e.currentTarget.dataset.ordernum)
        } else if (this.data.activeIndex == 1) {
            getUrl = app.globalData.twUrl + "/estapi/api/CutPieceEntry/OrderSize?orderno=" + escape(e.currentTarget.dataset.ordernum)
        }
        wx.request({
            url: getUrl,
            method: 'GET',
            header: {
                'Content-Type': 'application/json'
            },
            success: function(res) {
                that.setData({
                    inputTxt: e.currentTarget.dataset.ordernum,
                    isSelectOrdernum: false,
                });
                if (that.data.activeIndex == 0) {
                    that.setData({
                        bedArray: res.data,
                        bednum: res.data[0] ? res.data[0].bedtime : '',
                        bedindex: 0
                    });
                } else if (that.data.activeIndex == 1) {
                    that.setData({
                        sizeArray: res.data,
                        sizenum: res.data[0] ? res.data[0].sizetime : '',
                        sizeindex: 0
                    });
                }
            }
        })
    },
    bedPickerChange: function(e) {
        this.setData({
            bedindex: e.detail.value,
            bednum: this.data.bedArray[e.detail.value].bedtime
        })
    },
    sizePickerChange: function(e) {
        this.setData({
            sizeindex: e.detail.value,
            sizenum: this.data.sizeArray[e.detail.value].sizes
        })
  },
  radioChange: function (e) {
    this.setData({
      radioValue: e.detail.value
    })
  }
})