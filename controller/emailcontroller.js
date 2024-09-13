const { ObjectId } = require('mongodb');
const url = require('url');
const { getCollection } = require('../model/emailmodel');
const querystring = require('querystring');
const path = require('path');
const ejs = require('ejs');
let bcrypt = require("bcrypt");

async function submitUser(req, res) {
  let body = '';
  req.on('data', (chunk) => body += chunk.toString());
  req.on('end', async () => {
    const formData = querystring.parse(body);
    const coll = await getCollection();
    try {
      await coll.insertOne({
        name: formData.name,
        email: formData.email,
        phone: parseInt(formData.phone),
        pass: await bcrypt.hash(formData.pass,10)
      });
      res.writeHead(302, { Location: '/userlogin' });
      res.end();
    } catch (error) {
      console.error("Error inserting data:", error);
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("500 - Internal Server Error");
    }
  });
}

async function loginSubmit(req, res) {
  let body = '';
  req.on('data', (chunk) => body += chunk.toString());
  req.on('end', async () => {
    const loginData = querystring.parse(body);
    console.log(loginData)
    const coll = await getCollection();
    try {
      const record = await coll.findOne({ email:loginData.email });
      console.log(loginData.pass,record.pass)
      if( await bcrypt.compare(loginData.password,record.pass)){
        res.writeHead(302, { Location: '/userdata' });
        res.end()
      }else{
        res.writeHead(302, { Location: '/' });
        res.end()
      }
      console.log(record);
  }catch (error) {
      console.error("Error fetching data:", error);
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("500 - Internal Server Errors");
    }
});
  
}


async function userData(req, res) {
  const coll = await getCollection();
  try {
    const data_get = await coll.find().toArray();
    const filePath = path.join(__dirname, '../views', 'table.ejs');
    ejs.renderFile(filePath, { data_get }, (err, str) => {
      if (err) {
        console.error("Error rendering table.ejs:", err);
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("500 - Internal Server Error");
      } else {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(str);
      }
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("500 - Internal Server Errors");
  }
}

async function userForm(req, res, record = null) {
  const filePath = path.join(__dirname, '../views', 'form.ejs');
  ejs.renderFile(filePath, { formData: record }, (err, str) => {
    if (err) {
      console.error("Error rendering form.ejs:", err);
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("500 - Internal Server Error");
    } else {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(str);
    }
  });
}

async function userLogin(req, res, record = null) {
  const filePath = path.join(__dirname, '../views', 'login.ejs');
  ejs.renderFile(filePath, { loginData: record }, (err, str) => {
    if (err) {
      console.error("Error rendering login.ejs:", err);
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("500 - Internal Server Error");
    } else {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(str);
    }
  });
}


async function editUser(req, res) {
  const parsedUrl = url.parse(req.url, true);
  const id = parsedUrl.query.id;
  try {
    const objectId = new ObjectId(id);
    const coll = await getCollection();
    const record = await coll.findOne({ _id: objectId });
    if (record) {
      const filePath = path.join(__dirname, '../views', 'form.ejs');
      ejs.renderFile(filePath, { formData: record }, (err, str) => {
        if (err) {
          console.error("Error rendering form.ejs:", err);
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end("500 - Internal Server Error");
        } else {
          res.writeHead(200, { "Content-Type": "text/html" });
          res.end(str);
        }
      });
    } else {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("404 - Record Not Found");
    }
  } catch (error) {
    console.error("Error fetching record for edit:", error);
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("500 - Internal Server Error");
  }
}

async function updateUser(req, res) {
  let body = '';
  req.on('data', chunk => body += chunk.toString());
  req.on('end', async () => {
    const formData = querystring.parse(body);
    const id = formData.id;

    try {
      const objectId = new ObjectId(id);
      const coll = await getCollection();
      await coll.updateOne(
        { _id: objectId },
        {
          $set: {
            name: formData.name,
            email: formData.email,
            phone: parseInt(formData.phone),
            pass: formData.pass,
            conpass: formData.conpass
          }
        }
      );
      res.writeHead(302, { Location: '/userdata' });
      res.end();
    } catch (error) {
      console.error("Error updating data:", error);
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("500 - Internal Server Error");
    }
  });
}

async function deleteUser(req, res) {
  let body = '';
  req.on('data', chunk => body += chunk.toString());
  req.on('end', async () => {
    const formData = querystring.parse(body);
    const id = formData.id;
    try {
      const objectId = new ObjectId(id);
      const coll = await getCollection();
      await coll.deleteOne({ _id: objectId });
      res.writeHead(302, { Location: '/userdata' });
      res.end();
    } catch (error) {
      console.error("Error deleting data:", error);
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("500 - Internal Server Error");
    }
  });
}

module.exports = { submitUser, userData, userForm, editUser, updateUser,deleteUser,userLogin,loginSubmit }
