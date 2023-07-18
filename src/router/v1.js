import express from "express";
const router = express.Router();


import todomodule from './modules/todo'
router.use('/todos', todomodule);

module.exports = router;