/*
* @Author: Marte
* @Date:   2017-08-12 22:21:53
* @Last Modified by:   Marte
* @Last Modified time: 2017-08-12 22:25:16
*/

// 加载数据库
const mysql = require("mysql");

// 加载数据库连接配置
const config = require('../config/db.config.js')


var pool  = mysql.createPool(config);

module.exports = pool;