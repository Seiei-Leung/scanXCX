//index.js
//获取应用实例
const app = getApp();

Page({
    data: {
        dialogTitle: "",
        dialogTxt: "",
        iconType: 0,
        funcType: 0
    },
    onReady: function() {
        this.dialog = this.selectComponent("#dialog");
    },
    goscan: function() {
        var that = this;
        wx.scanCode({
            onlyFromCamera: true,
            success: (res) => {
                var result = res.result;
                wx.request({
                    url: app.globalData.twUrl + '/estapi/api/CutPieceEntry/CheckPosition?p2=' + result,
                    data: {},
                    method: 'GET',
                    header: {
                        'content-type': 'application/json'
                    },
                    success: function(res) {
                        if (res.data.name && !(res.data.name == "netfail")) {
                            if (!res.data.kind) {
                                wx.navigateTo({
                                    url: '../scanresult/scanresult?storageNum=' + result
                                });
                            } else {
                                that.setData({
                                    dialogTitle: "提示",
                                    dialogTxt: "该仓位" + res.data.kind + "区，不能入仓",
                                    iconType: 0
                                });
                                that.dialog.showModal();
                            }
                        } else if (res.data.name == "netfail") {
                          that.setData({
                            dialogTitle: "提示",
                            dialogTxt: "网络故障或接口调用失败，请重新操作！",
                            iconType: 0
                          });
                          that.dialog.showModal();
                        } else {
                            that.setData({
                                dialogTitle: "提示",
                                dialogTxt: "查无此仓位",
                                iconType: 0
                            });
                            that.dialog.showModal();
                        }
                    }
                })
            }
        });
        // wx.navigateTo({
        //   url: '../scanresult/scanresult?storageNum=4a04上'
        // })
        // wx.navigateTo({
        //   url: '../inputbyhand/inputbyhand?storageNum=4b01-1&kind='
        // })
    },
    getOut: function() {
        var that = this;
        wx.scanCode({
            onlyFromCamera: true,
            success: (res) => {
                var result = res.result;
                wx.request({
                    url: app.globalData.twUrl + '/estapi/api/CutPieceEntry/CheckPosition?p2=' + result,
                    data: {},
                    method: 'GET',
                    header: {
                        'content-type': 'application/json'
                    },
                    success: function(res) {
                      if (res.data.name && !(res.data.name == "netfail")) {
                            if (!res.data.kind) {
                                wx.navigateTo({
                                    url: '../scanoutresult/scanoutresult?storageNum=' + result
                                });
                            } else {
                                that.setData({
                                    dialogTitle: "提示",
                                    dialogTxt: "该仓位" + res.data.kind + "区，不能出仓",
                                    iconType: 0
                                });
                                that.dialog.showModal();
                            }
                      } else if (res.data.name == "netfail") {
                        that.setData({
                          dialogTitle: "提示",
                          dialogTxt: "网络故障或接口调用失败，请重新操作！",
                          iconType: 0
                        });
                        that.dialog.showModal();
                      } else {
                            that.setData({
                                dialogTitle: "提示",
                                dialogTxt: "查无此仓位",
                                iconType: 0
                            });
                            that.dialog.showModal();
                        }
                    }
                })
            }
        });
        // wx.navigateTo({
        //   url: '../scanoutresult/scanoutresult?storageNum=3A05下'
        // })
    },
    onLoad: function() {},
    goSearch: function() {
        wx.navigateTo({
            url: '../search/search'
        })
    },
    goStorageImage(event) {
        wx.navigateTo({
            url: '../storageimg/storageimg?storageFloor=' + event.currentTarget.dataset.storagefloor
        })
    },
    goPackagingInStorage() {
        var that = this;
        wx.scanCode({
            onlyFromCamera: true,
            success: (res) => {
                var result = res.result;
                wx.request({
                    url: app.globalData.twUrl + '/estapi/api/CutPieceEntry/CheckPosition?p2=' + result,
                    data: {},
                    method: 'GET',
                    header: {
                        'content-type': 'application/json'
                    },
                    success: function(res) {
                      if (res.data.name && !(res.data.name == "netfail")) {
                            if (!res.data.kind) {
                                wx.navigateTo({
                                    url: '../packaginginstorage/packaginginstorage?storageNum=' + result
                                });
                            } else {
                                that.setData({
                                    dialogTitle: "提示",
                                    dialogTxt: "该仓位" + res.data.kind + "区，不能入仓",
                                    iconType: 0
                                });
                                that.dialog.showModal();
                            }
                        } else if (res.data.name == "netfail") {
                          that.setData({
                            dialogTitle: "提示",
                            dialogTxt: "网络故障或接口调用失败，请重新操作！",
                            iconType: 0
                          });
                          that.dialog.showModal();
                        } else {
                            that.setData({
                                dialogTitle: "提示",
                                dialogTxt: "查无此仓位",
                                iconType: 0
                            });
                            that.dialog.showModal();
                        }
                    }
                })
            }
        });
    },
    goPackagingOutStorage: function() {
        var that = this;
        wx.scanCode({
            onlyFromCamera: true,
            success: (res) => {
                var result = res.result;
                wx.request({
                    url: app.globalData.twUrl + '/estapi/api/CutPieceEntry/CheckPosition?p2=' + result,
                    data: {},
                    method: 'GET',
                    header: {
                        'content-type': 'application/json'
                    },
                    success: function(res) {
                      if (res.data.name && !(res.data.name == "netfail")) {
                            if (!res.data.kind) {
                                wx.navigateTo({
                                    url: '../packagingoutstorage/packagingoutstorage?storageNum=' + result
                                });
                            } else {
                                that.setData({
                                    dialogTitle: "提示",
                                    dialogTxt: "该仓位" + res.data.kind + "区，不能出仓",
                                    iconType: 0
                                });
                                that.dialog.showModal();
                            }
                      } else if (res.data.name == "netfail") {
                        that.setData({
                          dialogTitle: "提示",
                          dialogTxt: "网络故障或接口调用失败，请重新操作！",
                          iconType: 0
                        });
                        that.dialog.showModal();
                      } else {
                            that.setData({
                                dialogTitle: "提示",
                                dialogTxt: "查无此仓位",
                                iconType: 0
                            });
                            that.dialog.showModal();
                        }
                    }
                })
            }
        });
    },
    goFlowerOutStorage: function() {

    },
    goSearchPackaging: function() {
      wx.navigateTo({
        url: '../searchPackaging/searchPackaging',
      })
    },
    test: function() {
        
    }
})