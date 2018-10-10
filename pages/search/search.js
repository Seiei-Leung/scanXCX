var T,T1,T2;
var app = getApp();

Page({
  data: {
    selectCodes: ["制单"],
    selectCodeIndex: 0,
    inputValue: "",
    resultList: [],
    bedList: [],
    sizesList: [],
    pakeageList: [],
    RSpakeageList:[],
    RSbedList: [],
    RSsizesList: [],
    bedKey: "",
    sizeKey: ""
  },
  bindKeyInput: function(e) {
    var that = this;
    clearTimeout(T);
    T = setTimeout(() => {
      wx.request({
        url: app.globalData.twUrl + "/estapi/api/CutPieceEntry/SearchData?kind=" + that.data.selectCodes[that.data.selectCodeIndex] + "&keyword=" + escape(e.detail.value),
        method: "GET",
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          console.log(res.data);
          var sizesList = [];
          var bedList = [];
          var pakeageList = [];
          res.data.forEach((item) => {
            if (item.kind == "分码") {
              sizesList.push(item);
            }
            if (item.kind == "分床") {
              bedList.push(item);
            }
            if (item.kind == "打包") {
              pakeageList.push(item);
            }
          });
          that.setData({
            resultList: res.data,
            RSsizesList: sizesList,
            RSbedList: bedList,
            RSpakeageList: pakeageList
          });
          if (that.data.bedKey) {
            bedList = [];
            that.data.RSbedList.forEach((item) => {
              if (item.bedno == that.data.bedKey) {
                bedList.push(item);
              }
            });
          }
          if (that.data.sizeKey) {
            sizesList = [];
            that.data.RSsizesList.forEach((item) => {
              if (item.sizes == that.data.sizeKey || that.data.sizeKey.toUpperCase()) {
                sizesList.push(item);
              }
            });
          }
          that.setData({
            sizesList: sizesList,
            bedList: bedList,
            pakeageList: pakeageList
          });
        }

      });
    }, 1500);
  },
  onLoad: function() {
  },
  bindSizeInput: function (e) {
    var that = this;
    clearTimeout(T1);
    T1 = setTimeout(() => {
      var sizesList = [];
      that.setData({
        sizeKey: e.detail.value
      });
      if (e.detail.value == "") {
        if (!that.data.bedKey) {
          that.setData({
            sizesList: that.data.RSsizesList,
            bedList: that.data.RSbedList,
            pakeageList: that.data.RSpakeageList
          });
        } else {
          var bedList=[];
          that.data.RSbedList.forEach((item) => {
            if (item.bedno == that.data.bedKey) {
              bedList.push(item);
            }
          });
          that.setData({
            pakeageList: [],
            sizesList: [],
            bedList: bedList
          });
        }
      } else {
        that.data.sizesList.forEach((item) => {
          if (item.sizes == e.detail.value || item.sizes == e.detail.value.toUpperCase()) {
            sizesList.push(item);
          }
        });
        that.setData({
          pakeageList: [],
          sizesList: sizesList,
          bedList: []
        });
      }
    }, 1500);
  },
  bindBednumInput: function (e) {
    var that = this;
    clearTimeout(T2);
    T2 = setTimeout(() => {
      var bedList = [];
      that.setData({
        bedKey: e.detail.value
      });
      if (e.detail.value == "") {
        if (!that.data.sizeKey) {
          that.setData({
            pakeageList: that.data.RSpakeageList,
            sizesList: that.data.RSsizesList,
            bedList: that.data.RSbedList
          });
        } else {
          var sizesList = [];
          that.data.RSsizesList.forEach((item) => {
            if (item.sizes == that.data.sizeKey || item.sizes == that.data.sizeKey.toUpperCase()) {
              sizesList.push(item);
            }
          });
          that.setData({
            pakeageList: [],
            sizesList: sizesList,
            bedList: []
          });
        }
      } else {
        that.data.bedList.forEach((item) => {
          if (item.bedno == e.detail.value) {
          bedList.push(item);
          }
        });
        that.setData({
          pakeageList: [],
          sizesList: [],
          bedList: bedList
        })
      }
    }, 1500);
  }
});