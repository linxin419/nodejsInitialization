const query = require("../db/query");
const express = require("express");
const test_sql = require("../db/test_sql");
const router = express.Router();
// 响应一个JSON数据
const responseJSON = function (res, ret, msg, code) {
    if (ret === "error") {
        res.json({
            code: code,
            msg: msg,
        });
    } else {
        res.json(ret);
    }
};

router.post("/post", async function (req, res, next) {
    // 获取前台页面传过来的参数
    const param = req.body;
    const _res = res;
    let data = [];
    const testQuery = await query(test_sql.test_query, [])
   if (testQuery) {
       data = {
           code: 200,
           msg: "成功",
       };
   }
    responseJSON(_res, data);
});

router.get('/get', async function (req, res, next) {
    // 获取前台页面传过来的参数
    const param = req.query || req.params;
    let data;
    const _res = res;
    const testQuery = await query(test_sql.test_query, [])
    if (testQuery) {
        data = {
            code: 200,
            msg: "成功",
        };
    }
    responseJSON(_res, data)
})

module.exports = router;
