// var express = require("express")
// kích hoạt dotenv
import dotenv from "dotenv"
dotenv.config();
//  gọi thư viện express tạo ra server
import express from "express";
const server = express()

// cấu hình cors cho phép mọi người call api
import cors from 'cors';
server.use(cors());

// cấu hình req.body
import bodyParser from "body-parser";
server.use(bodyParser.json())

// gọi cấu hình routing và yêu cầu server bật /api với  routing đó
import routerConfig from './router'
server.use('/api', routerConfig)

// gọi cấu hình view
import todoConfig from './todoInterface';
server.use(todoConfig)
/* public folder domain/file */
server.use(express.static("public"));

/** yêu cầu server lẳng nghe tại cổng 4000 */
server.listen(process.env.PORT, () => {
    console.log("server da chay tai port", process.env.PORT);
})