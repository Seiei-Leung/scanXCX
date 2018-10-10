var T, T1, T2;
var app = getApp();

Page({
  data: {
    selectCodes: ["制单"],
    selectCodeIndex: 0,
    inputValue: "",
    bedList: []
  },
  bindKeyInput: function (e) {
    var that = this;
    clearTimeout(T);
    T = setTimeout(() => {
      wx.request({
        url: app.globalData.twUrl + "/estapi/api/CutPieceEntry/SearchBagData?orderno=" + escape(e.detail.value),
        method: "GET",
        success: function (res) {
          console.log(res.data);
          var bedList = [];
          res.data.forEach((item) => {
            if (item.bedno) {
              bedList.push(item);
            }
          });
          that.setData({
            resultList: bedList,
            bedList: bedList
          });
        }
      });
    }, 1500);
  },
  
  bindBednumInput: function (e) {
    var that = this;
    clearTimeout(T2);
    T2 = setTimeout(() => {
      var bedList = [];
      if (e.detail.value) {
        that.data.resultList.forEach((item) => {
          if (item.bedno == e.detail.value) {
            bedList.push(item)
          }
        })
        that.setData({
          bedList: bedList
        })
      }
    }, 1500);
  }
})