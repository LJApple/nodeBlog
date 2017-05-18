const crypto = require('crypto');

module.exports = {
	MD5_suffix:'fafadfasfaffa率瓯海VOA放假哦',
	md5:function(str){
		var obj = crypto.createHash('md5');
		obj.update(str);
		return obj.digest('hex');
	}
}


