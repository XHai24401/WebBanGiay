var jsonwebtoken = require('jsonwebtoken');
var config = require('./../../config/setting.json');

function verifyTokenAdmin(req, res, next) {

  var token = req.cookies.adminToken;
  if (!token) return res.send('<script>window.location.href="/admin/login"; alert("Vui lòng đăng nhập!"); </script>');
    
  try{
    const decoded = jsonwebtoken.verify(token, config.jwt.secret);
    req.adminId = decoded._id;
    next();
  }
  catch(err){
    return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
  }
}

module.exports = verifyTokenAdmin;