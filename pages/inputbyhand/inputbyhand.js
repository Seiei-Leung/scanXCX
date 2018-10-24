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
        radioList: [],
        radioValue: '',
        isShowMatches: false
    },
    onReady: function() {
        this.dialog = this.selectComponent("#dialog");
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var activeIndex = 0;
        if (options.kind == "分码") {
            activeIndex = 1;
        } else if (options.kind == "花片") {
            activeIndex = 2;
        }
        this.setData({
            storageNum: options.storageNum,
            activeIndex: activeIndex,
            kind: options.kind
        })
    },
    clickForBedNum: function(event) {

        var kind = event.currentTarget.dataset.kind;
        console.log(kind)
        console.log("this" + this.data.kind)
        if (this.data.kind) {
            if (this.data.kind == "分码" && !(kind == "size")) {
                this.setData({
                    dialogTitle: "提示",
                    dialogTxt: "该仓位为分码，不能放其它裁片",
                    iconType: 0
                })
                this.dialog.showModal();
            } else if (this.data.kind == "分床" && !(kind == "bed")) {
                this.setData({
                    dialogTitle: "提示",
                    dialogTxt: "该仓位为分床，不能放其它裁片",
                    iconType: 0
                })
                this.dialog.showModal();
            } else if (this.data.kind == "花片" && !(kind == "flower")) {
                this.setData({
                    dialogTitle: "提示",
                    dialogTxt: "该仓位为大细花，不能放其它裁片",
                    iconType: 0
                })
                this.dialog.showModal();
            }
        } else {
            if (kind == "bed") {
                this.setData({
                    activeIndex: 0
                });
            } else if (kind == "size") {
                this.setData({
                    activeIndex: 1
                });
            } else {
                this.setData({
                    activeIndex: 2
                })
            }
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
        if (this.data.activeIndex == 0) {
            this.setData({
                isShowMatches: true,
                radioList: [
                    { value: '配好' },
                    { value: '未配', checked: 'true' },
                    { value: '已查' }
                ],
                radioValue: '未配'
            })
        } else if (this.data.activeIndex == 1) {
            this.setData({
                isShowMatches: true,
                radioList: [
                    { value: '配好', checked: 'true' },
                    { value: '未配' },
                    { value: '已查' }
                ],
                radioValue: '配好'
            })
        } else if (this.data.activeIndex == 2) {
            this.setData({
                isShowMatches: true,
                radioList: [
                    { value: '配好', checked: 'true' },
                    { value: '未配' },
                    { value: '已查' }
                ],
                radioValue: '配好'
            })
        }
    },
    submitForMatches: function() {
        this.setData({
            isShowMatches: false
        });
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
        } else if (this.data.activeIndex == 1) {
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
        } else {
            if (!this.data.bednum || !this.data.bednum || !this.data.inputTxt) {
                this.setData({
                    dialogTitle: "失败",
                    dialogTxt: "请输入制单号,床次及尺码",
                    iconType: 0
                })
                this.dialog.showModal();
                return;
            } else {
                getUrl = app.globalData.twUrl + "/estapi/api/CutPieceEntry/InsertFlowerData";
                sendData.orderno = this.data.inputTxt;
                sendData.sizes = this.data.sizenum;
                sendData.bedno = this.data.bednum;
                sendData.kind = "花片";
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
        if (this.data.activeIndex == 2) {
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
        } else {
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
                            sizenum: res.data[0] ? res.data[0].sizes : '',
                            sizeindex: 0
                        });
                    }
                }
            })

        }
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
    radioChange: function(e) {
        this.setData({
            radioValue: e.detail.value
        })
    },
    hideShowMatches: function() {
        this.setData({
            isShowMatches: false
        })
    }
})