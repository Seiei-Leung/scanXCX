const app = getApp();

Page({
  data: {
    storageFloor: '',
    resultList: [],
    letterList: ["A", "B", "C", "D", "E"]
  },
  onLoad: function (options) {
    this.setData({
      storageFloor: options.storageFloor
    });
  },
  onShow: function () {
    var that = this;
    wx.request({
      url: app.globalData.twUrl + '/estapi/api/CutPieceEntry/QueryPosition?key=' + that.data.storageFloor,
      method: "GET",
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var letterList = ["A", "B", "C", "D", "E"];
        var resultList = [];
        for (var i = 0; i < letterList.length; i++) {
          var list = [];
          for (var n = 0; n < res.data.length; n++) {
            if (res.data[n].code[1] == letterList[i]) {
              list.push(res.data[n]);
            }
          }
          resultList.push(list);
        }
        console.log(resultList)
        that.setData({
          resultList: resultList
        })
      }
    })

  }
})