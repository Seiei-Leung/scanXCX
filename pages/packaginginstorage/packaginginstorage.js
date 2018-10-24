const app = getApp();

Page({
    data: {
        storageNum: "",
        dialogTitle: "",
        dialogTxt: "",
        iconType: 0,
        funcType: 0,
        resultList: [],
        quantityArray: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
        quantityindex: 0,
        isShowQuantity: false,
        sendData: {},
        kind: ""
    },
    onReady: function() {
        this.dialog = this.selectComponent("#dialog");
    },
    onLoad: function(options) {
        this.setData({
            storageNum: options.storageNum
        })
    },
    onShow: function() {
        var that = this;
        if (that.data.storageNum) {
            wx.request({
                url: app.globalData.twUrl + '/estapi/api/CutPieceEntry/SearchBagDataByPosi?position=' + that.data.storageNum,
                data: {},
                method: 'GET',
                header: {
                    'content-type': 'application/json'
                },
                success: function(res) {
                    that.setData({
                        resultList: res.data
                    })
                }
            })
        }
    },
    scan: function(event) {
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
                    sendData.sizes = Scanresult[2];
                    sendData.grpno = "0";
                    sendData.position = that.data.storageNum;
                    that.setData({
                      sendData: sendData,
                      kind: event.currentTarget.dataset.kind,
                      isShowQuantity: true
                    });
                }
            }
        })
    },
    quantityPickerChange: function(e) {
        this.setData({
            quantityindex: e.detail.value
        })
    },
    submitBtn: function() {
        var url;
        var sendData = this.data.sendData;
        sendData.quantity = this.data.quantityArray[this.data.quantityindex];
        if (this.data.kind == "normal") {
          url = "/estapi/api/CutPieceEntry/InsertBagData";
        } else {
          url = "/estapi/api/CutPieceEntry/InsertBagFlowerData";
          sendData.kind = "花片"
        }
        var that = this;
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
                        funcType: 1
                    })
                    that.dialog.showModal();
                } else {
                    that.setData({
                        dialogTitle: "失败",
                        dialogTxt: res1.data.result,
                        iconType: 0,
                        funcType: 1
                    })
                    that.dialog.showModal();
                    console.log(that.data.dialogTitle)
                }
            }
        })
    },
    goByHand: function() {
        wx.navigateTo({
            url: '../packagingbyhand/packagingbyhand?storageNum=' + this.data.storageNum
        })
    }
})