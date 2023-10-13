const mysql = require('mysql');
const dbConfig = require('../db/DBConfig');
const express = require('express');
const multer = require('multer')
const md5 = require('md5-node');
const path = require('path');
const fs = require('fs')
const router = express.Router();

// 使用DBConfig.js的配置信息创建一个MySql链接池
const pool = mysql.createPool(dbConfig.mysql);
// 响应一个JSON数据
const responseJSON = function (res, ret, msg, code) {
    if (ret === 'error') {
        res.json({
            code: code,
            msg: msg,
        })
    } else {
        res.json(ret)
    }
};

// 图片上传
const upload = multer({dest: 'tmp/'})
router.post('/update', upload.single('file'), (req, res) => {
    const _res = res;
    let data = {};
    let imgFile = req.file //获取图片上传的资源
    const tmp = imgFile.path; //获取临时资源
    let ext = path.extname(imgFile.originalname) //利用path模块获取 用户上传图片的 后缀名
    let newName = md5('' + new Date().getTime() + Math.round(Math.random() * 10000)) + ext //给用户上传的图片重新命名 防止重名
    let newPath = '../public/images/' + newName //给图片设置存放目录  提前给当前文件夹下建立一个   images文件夹  ！！！！
    let fileData = fs.readFileSync(tmp) //将上传到服务器上的临时资源 读取到 一个变量里面
    fs.writeFileSync(path.join(__dirname, newPath), fileData) //重新书写图片文件  写入到指定的文件夹下
    data = {
        code: 200,
        msg: '上传成功！',
        data: {
            url: newName,
            app_url: global.app_url + 'public/images/' + newName
        }
    }
    // 以json形式，把操作结果返回给前台页面
    responseJSON(_res, data)
})

// 删除上传的图片
router.post('/del', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        const param = req.body;
        let data = {};
        const _res = res;
        const url = param.url;
        const src = './public/images/' + url.replace(global.app_url + 'public/images/', '');
        // 删除指定文件
        setTimeout(() => {
            fs.unlink(src, function (err) {
                if (err) {
                    // 以json形式，把操作结果返回给前台页面
                    responseJSON(_res, 'error', '删除失败', -1)
                    return;
                }
                data = {
                    code: 200,
                    msg: '删除成功！',
                }
                // 以json形式，把操作结果返回给前台页面
                responseJSON(_res, data)
            })
        }, 500);
        // 释放链接
        connection.release()
    })
})

module.exports = router
