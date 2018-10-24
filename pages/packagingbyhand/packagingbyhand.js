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
        funcType: 0,
        sizeArray: [],
        sizeindex: 0,
        bedArray: [],
        bedindex: 0,
        quantityArray: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
        quantityindex: 0,
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
        })
    },
    clickForBedNum: function(event) {
        var kind = event.currentTarget.dataset.kind;
        if (kind == "packaging") {
            this.setData({
                activeIndex: 0
            });
        } else if (kind == "flower") {
            this.setData({
                activeIndex: 1
            });
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
                        inputTxt: e.detail.value,
                        resultList: res.data
                    });
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
        var sendData = {};
        var that = this;
        var url = "";
        sendData.orderno = that.data.inputTxt;
        sendData.bedno = that.data.bednum;
        sendData.sizes = that.data.sizenum;
        sendData.grpno = "0";
        sendData.position = that.data.storageNum;
        sendData.quantity = that.data.quantityArray[that.data.quantityindex];
        if (this.data.activeIndex == 0) {
          url = "/estapi/api/CutPieceEntry/InsertBagData";
        } else if (this.data.activeIndex == 1)  {
          url = "/estapi/api/CutPieceEntry/InsertBagFlowerData";
          sendData.kind = "花片"
        }
         wx.request({
            url: app.globalData.twUrl + url,
            data: sendData,
            type: "GET",
            complete: function(res1) {
                console.log(res1)
                if (res1.data.result == "SUCCESS") {
                    that.setData({
                        dialogTitle: "成功",
                        dialogTxt: "打包入仓成功",
                        iconType: 1,
                        funcType: 0
                    })
                    that.dialog.showModal();
                } else {
                    that.setData({
                        dialogTitle: "失败",
                        dialogTxt: res1.data.result,
                        iconType: 0,
                        funcType: 0
                    })
                    that.dialog.showModal();
                    console.log(that.data.dialogTitle)
                }
            }
        })
    },
    selectOrdernum: function(e) {
        var getUrl;
        var that = this;
        wx.request({
            url: app.globalData.twUrl + "/estapi/api/CutPieceEntry/OrderSize?orderno=" + escape(e.currentTarget.dataset.ordernum),
            method: 'GET',
            header: {
                'Content-Type': 'application/json'
            },
            success: function(res) {
                console.log(res);
                that.setData({
                    sizeArray: res.data,
                    sizenum: res.data[0] ? res.data[0].sizes : '',
                    sizeindex: 0
                });
                wx.request({
                    url: app.globalData.twUrl + "/estapi/api/CutPieceEntry/Bedtime?orderno=" + escape(e.currentTarget.dataset.ordernum),
                    method: 'GET',
                    header: {
                        'Content-Type': 'application/json'
                    },
                    success: function(res) {
                        console.log(res);
                        that.setData({
                            inputTxt: e.currentTarget.dataset.ordernum,
                            isSelectOrdernum: false,
                        });
                        that.setData({
                            bedArray: res.data,
                            bednum: res.data[0] ? res.data[0].bedtime : '',
                            bedindex: 0
                        });
                    }
                })
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
    quantityPickerChange: function(e) {
        this.setData({
            quantityindex: e.detail.value
        })
    },
    hideShowMatches: function() {
        this.setData({
            isShowMatches: false
        })
    }
})