var Fsuperdbg = true;
var Serverurl = "http://dzyryd2.shop0301.com";
var imgurl = "http://dzadmin2.shop0301.com/";
//var Serverurl = "http://localhost:8587"
Fsuper = {
	getevuserinfo: function() {
		appcan.ajax({
			url: Serverurl + "/app/getevuserinfo",
			type: "POST",
			dataType: "json",
			data: {Fuserid:Fsuper.getuserid()},
			success: function(result) {
				var rows = result.data[0];
				var code = result.code;
				var msg = result.msg;
				var debug = result.debug;
				if(code < 10000) {
					if(code == 0) { //返回成功
						var data = result.data[0];
						appcan.locStorage.setVal("userinfo", data);
					}
				} else {
					if(Fsuperdbg) {
						alert(result.code);
						alert(result.msg);
						alert(result.debug);
					}
				}
			}
		});
	},
	getrows: function(url, parm, addrow, callback) {
		appcan.ajax({
			url: Serverurl + url,
			type: "POST",
			dataType: "json",
			data: parm,
			success: function(result) {
				var rows = result.data.rows;
				var code = result.code;
				var msg = result.msg;
				var end = result.data.end;
				var debug = result.debug;
				if(code < 10000) {
					if(code == 0) { //返回成功
						$(rows).each(function(i, row) {
							addrow(row, end);
						});
					}
				} else {
					if(Fsuperdbg) {
						alert(result.code);
						alert(result.msg);
						alert(result.debug);
					}
				}
				if(callback != undefined) {
					callback();
				}
			}
		});
	},
	getdata: function(url, parm, addrow, callback) {
		appcan.ajax({
			url: Serverurl + url,
			type: "POST",
			dataType: "json",
			data: parm,
			success: function(result) {
				var rows = result.data;
				var code = result.code;
				var msg = result.msg;
				var debug = result.debug;
				if(code < 10000) {
					if(code == 0) { //返回成功
						$(rows).each(function(i, row) {
							addrow(row);
						});
					}
				} else {
					if(Fsuperdbg) {
						alert(result.code);
						alert(result.msg);
						alert(result.debug);
					}
				}
				if(callback != undefined) {
					callback();
				}
			}
		});
	},
	getdelete: function(url, parm, addrow, callback) {
		appcan.ajax({
			url: Serverurl + url,
			type: "POST",
			dataType: "json",
			data: parm,
			success: function(result) {
				var code = result.code;
				var msg = result.msg;
				var debug = result.debug;
				var data = result.data;
				if(code < 10000) {
					if(code == 0) { //返回成功
						addrow(data);
					}
				} else {
					if(Fsuperdbg) {
						alert(result.code);
						alert(result.msg);
						alert(result.debug);
					}
				}
				if(callback != undefined) {
					callback();
				}
			}
		});
	},
	setparm: function(parm) {
		appcan.locStorage.setVal("parm", parm);
	},
	getparm: function() {
		var parm = appcan.locStorage.getVal("parm");
		return parm;
	},
	getuserinfo: function() //获取用户信息
		{
			return JSON.parse(appcan.locStorage.getVal("userinfo"));
		},
	getuserid: function() { //获取用户id
		var userinfo = Fsuper.getuserinfo();
		if(userinfo == null) {
			return -1;
		} else {
			return userinfo.Fid;
		}

	},
	//身份验证
	getuserFauthenticationLevel: function() {
		Fsuper.getevuserinfo();
		var userinfo = Fsuper.getuserinfo();
		var Fidcard = userinfo.Fidcard;
		if(Fidcard == null) {
			return -1;
		} else {
			return 2;
		}
	},
	//设置支付密码
	getCheckPayPswd: function() {
		Fsuper.getevuserinfo();
		var userinfo = Fsuper.getuserinfo();
		var Fpaypwd = userinfo.Fpaypwd;
		if(Fpaypwd == 0) { //未设置支付密码
			return -1;
		} else {
			return 3;
		}
	},
	//银行卡绑定
	getuserBankNum: function() {
		Fsuper.getevuserinfo();
		var userinfo = Fsuper.getuserinfo();
		var FbankNum = userinfo.FbankNum;
		if(FbankNum == null) {
			return -1;
		} else {
			return 4;
		}
	},
	//用户登录验证
	checkUserLogin: function() {
		//Fsuper.getevuserinfo();
		var userid = Fsuper.getuserid();
		if(userid == -1) { //检验用户是否登录 -1未登录
			appcan.window.alert({
				title: "提示",
				content: "您没有登陆或者注册",
				buttons: ['取消', '去完成'],
				callback: function(err, data, dataType, optId) {
					if(data == 1) {
						appcan.window.open({
							name: "login",
							aniId: 1,
							data: "../login/login.html",
						});
					}
				}
			});
			return 0;
		}
	},
	//身份验证
	checkUserauthen: function() {
		Fsuper.getevuserinfo();
		var useralevel = Fsuper.getuserFauthenticationLevel(); //身份验证
		if(useralevel == -1) { //身份验证未认证
			appcan.window.alert({
				title: "提示",
				content: "身份验证未验证，是否去验证",
				buttons: ['取消', '去验证'],
				callback: function(err, data, dataType, optId) {
					if(data == 1) {
						appcan.window.open({
							name: "authentication1",
							aniId: 1,
							data: "../authentication1/authentication1.html",
						});
					}
				}
			});
			return 0;
		}
		//支付密码验证
		var Fpaypwd = Fsuper.getCheckPayPswd();
		if(Fpaypwd == -1) { //身份验证未认证
			appcan.window.alert({
				title: "提示",
				content: "未设置交易密码，是否去设置",
				buttons: ['取消', '去设置'],
				callback: function(err, data, dataType, optId) {
					if(data == 1) {
						appcan.window.open({
							name: "authentication1",
							aniId: 1,
							data: "../authentication2/authentication2.html",
						});
					}
				}
			});
			return 0;
		}
		//银行卡验证
		var FbankNum = Fsuper.getuserBankNum();
		if(FbankNum == -1) { //银行卡验证
			appcan.window.alert({
				title: "提示",
				content: "未绑定银行卡，是否去绑定",
				buttons: ['取消', '去绑定'],
				callback: function(err, data, dataType, optId) {
					if(data == 1) {
						appcan.window.open({
							name: "authentication1",
							aniId: 1,
							data: "../authentication3/authentication3.html",
						});
					}
				}
			});
			return 0;
		}
	},
	getresult: function(url, parm, addrow, callback) {
		appcan.ajax({
			url: Serverurl + url,
			type: "POST",
			dataType: "json",
			data: parm,
			success: function(result) {
				var rows = result.data;
				var code = result.code;
				var msg = result.msg;
				var debug = result.debug;
				if(code < 10000) {

					addrow(rows, code);
				} else {
					if(Fsuperdbg) {
						alert(result.code);
						alert(result.msg);
						alert(result.debug);
					}
				}
				if(callback != undefined) {
					callback();
				}
			}
		});
	}

}

var Safe = {
	serverurl: "",
	encodedes: function(instr) {
		var ciphertext = stringToHex(des(getkey(), instr, 1, 0));
		return ciphertext;
	},
	getsign: function(parm) {
		var inparm = {
			p1: parm,
		}
		var adate = new Date();
		inparm.timestamp = adate.Format("yyyy-MM-dd hh:mm:ss S");
		var parmstr = "";
		for(key in parm) {
			parmstr = parmstr + key + "=" + parm[key] + "&";
		}
		parmstr = parmstr.substring(0, parmstr.length - 1);
		parmstr = parmstr.toUpperCase();
		inparm.Fsupersign = $.md5(parmstr);
		return inparm;
	},
	post: function(url, parm, callback) {
		var signparm = Safe.getsign(parm);
		var enstr = Safe.encodedes(JSON.stringify(signparm));
		appcan.ajax({
			url: url,
			type: "POST",
			dataType: "json",
			async: false,
			data: {
				parm: enstr
			},
			success: function(result) {
				var code = result.code;
				var msg = result.msg;
				var debug = result.debug;
				if(code > 10000) {
					if(Fsuperdbg) {
						alert(debug);
					}
					return;
				}
				callback(result);
			}
		});
	}
}