const { submitUser, userData, userForm, editUser, updateUser,deleteUser,userLogin,loginSubmit } = require('../controller/emailcontroller');

let url = require('url');

module.exports = (req, res) => {
  
  const parsedUrl = url.parse(req.url, true);
  const { pathname } = parsedUrl;
  const {method} = req;
  console.log(pathname,method   )
if (method === 'POST' && pathname === '/usersubmit') {
  submitUser(req, res);
} else if (method === 'GET' && pathname === '/userdata') {
  userData(req, res);
} else if (method === 'GET' && pathname === '/userform') {
  userForm(req, res);
} else if (method === 'GET' && pathname === '/useredit') {
  editUser(req, res);
} else if (method === 'POST' && pathname === '/userupdate') {
  updateUser(req, res);
} else if (method === 'POST' && pathname === '/userdelete') {
  deleteUser(req, res);
}else if(method ==='GET' && pathname === '/'){
   userLogin(req, res);
} else if(method ==='POST' && pathname ==='/loginSubmit'){
  loginSubmit(req, res)
}
else if(method ==='POST' && pathname === '/dashbord'){
  res.end("login successfully")
}

  else {
  res.writeHead(404, { 'Content-Type': 'text/html' });
  res.end('404 - Not Found');
}
};