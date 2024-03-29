// pages/course/course.js
const network = require("../../../../../utils/main.js");
const app = getApp();
var pagesize = 20;
var page = 1;
var subId = 0;
var hasmore = null;
var mytopid='';
var nianjiid = '';
Page({

  
  data: {
    //收费提示
    show: {
      middle: false
    },
      kemu: [],
      nianji: [],
      index:0,
      showEmpty: false,
      
      tabs: [],
      list: [],
      selectedTab: subId,
      showEmpty: false,
      

      
  },

  onLoad: function (options) {
      this.empty = this.selectComponent("#empty");
      
      var that = this;
      mytopid = options.mytopid;
      that.setData({
          tabs: app.studyOptions.kemu,
          nianji: app.studyOptions.nianji,
      })
    //   console.log(that.data.nianji)
    //   navtitle双优课 2公共课 3微课
      if (mytopid==0){
          that.setData({
              navtitle:'全部'
          })
      }
      else if (mytopid == 1) {
          that.setData({
              navtitle: '双优课'
          })
      }
      else if (mytopid == 2) {
          that.setData({
              navtitle: '公共课'
          })
      }
      else if (mytopid == 3) {
          that.setData({
              navtitle: '微课'
          })
      }
      that.getList(false);
      
  },
    bindPickerChange(e) {
        var that=this;
        that.setData({
            index: e.detail.value
        })
        for (var i = 0; i < that.data.nianji.length; i++) {
            if (that.data.nianji[that.data.index].title == that.data.nianji[i].title) {
                
                nianjiid = that.data.nianji[i].id
            }
        }
        wx.pageScrollTo({
            scrollTop: 0,
            duration: 0
        });
        page = 1;
        this.getList(false);
    },
  onShow: function () {
      var that = this;
      
      
  },
    swiScrollTab: function (e) {
        subId = e.currentTarget.dataset.index;
        this.setData({
            selectedTab: subId,
            showEmpty: false
        });
        // console.log(subId);
        wx.pageScrollTo({
            scrollTop: 0,
            duration: 0
        });
        page = 1;
        this.getList(false);
    },
    
   
    
    getList: function (contaFlag) {
        var that = this;
        // console.log(that.data.mytopid)
        network.POST({
            url: 'v13/ncourse/course-list',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "page": page,
                "pagesize": pagesize,
                "teacherid": '',
                "subjectid": subId,
                'gradeid': nianjiid,
                "type": mytopid,

            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    var a = res.data.data[0].list;
                    if (contaFlag) {
                        a = that.data.list.concat(a);
                    }
                    that.setData({
                        list: a,
                        showEmpty: a.length == 0 ? true : false
                    });

                    hasmore = res.data.data[0].hasmore;
                } else {

                    wx.showToast({
                        title: res.data.message,
                        icon: 'none',
                        duration: 1000
                    });

                }
            },
            fail: function () {
                wx.hideLoading();
                wx.showToast({
                    title: '服务器异常',
                    icon: 'none',
                    duration: 1000
                })
            }
        });
    },
    onReachBottom: function () {
        var that = this;
        if (that.data.list.length > 0) {
            if (hasmore) {
                page++;
                that.getList(true);
            } else {
                wx.showToast({
                    title: '没有更多了',
                    icon: 'none',
                    duration: 1000
                });
            }
        }
    },
  //提示会员是否到期
  onTransitionEnd() {
    // console.log(`You can't see me 🌚`);
  },
  toggle(type) {
    this.setData({
      [`show.${type}`]: !this.data.show[type]
    });
  },

  togglePopup() {
    this.toggle('middle');
  },
  noBuy: function () {
    this.toggle('middle');
  },
  goBuy: function () {
    wx.navigateTo({
      url: '/pages/my/pages/memberRenewalNewPay/memberRenewalNewPay'
    });
  },
  //判断会员是否过期
  isExpires: function (e) {
    var that = this;
    network.memberExpires(function (res) {
      // console.log(res);
      that.toggle('middle');
    },function(res){
      //如果没过期直接进入详情页
      wx.navigateTo({
        url: '/pages/home/pages/course/courseDetail/courseDetail?courseid=' + e.currentTarget.dataset.myid + '&videopic=' + e.currentTarget.dataset.videopic,
      });
    });
  },
    tz_detail: function (e) {
        wx.navigateTo({
            url: '/pages/home/pages/course/courseDetail/courseDetail?courseid=' + e.currentTarget.dataset.myid + '&videopic=' + e.currentTarget.dataset.videopic,
        })
    },
  onHide: function () {
    this.setData({
      show: {
        middle: false
      }
    });
  },
    onUnload: function () {
        page = 1;
        hasmore = null;
        this.setData({
            showEmpty: false
        });
    }
})