import express from "express";
const router = express.Router();
import fs from "fs";
import path from "path";
import multiparty from "multiparty";



router.get("/", (req, res) => {
    fs.readFile(path.join(__dirname, "todo.json"), (err, data) => {
        if (err) {
            return res.status(500).json({
                message: "Lấy dữ liệu thất bại!",
            });
        }

        if (req.query.id) {
            let todo = JSON.parse(data).find(todo => todo.id == req.query.id);
            if (todo) {
                return res.status(200).json(
                    {
                        data: todo
                    }
                )
            }
        }   

        return res.status(200).json({
            message: "Lấy dữ liệu thành công!",
            data: JSON.parse(data),
        });
    });
});
router.delete("/:todoId", (req, res) => {
    if (req.params.todoId) {
        fs.readFile(path.join(__dirname, "todo.json"), "utf-8", (err, data) => {
            if (err) {
                return res.status(500).json({
                    message: "Đã xảy ra lỗi!"
                });
            }
            let todosData = JSON.parse(data);
            let todoDelete = todosData.find(todo => todo.id == req.params.todoId);
            todosData = todosData.filter((todo) => todo.id != req.params.todoId);
            fs.writeFile(
                path.join(__dirname, "todo.json"),
                JSON.stringify(todosData),
                (err) => {
                    if (err) {
                        return res.status(500).json({
                            message: "Luu file that bai!",
                        });
                    }

                    return res.status(200).json({
                        message: "xoa thanh cong!",
                    });
                }
            );
        })
    }
});

router.post("/", (req, res) => {
    let form = new multiparty.Form();
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(500).send("Lỗi đọc form!");
        }
        console.log("Fields:", fields);
        let newTodo = {
            userId: 1,
            id: Date.now(),
            title: fields.title[0],
            completed: false
        }
        fs.readFile(path.join(__dirname, "todo.json"), 'utf-8', (err, data) => {
            if (err) {
                return res.status(500).json(
                    {
                        message: "Đọc dữ liệu thất bại!"
                    }
                )
            }

            let oldData = JSON.parse(data);
            for (let i in oldData) {
                if (oldData[i].title.includes(newTodo.title)) {
                    return res.status(500).json(
                        {
                            message: "Dữ liệu bị trùng!"
                        }
                    )
                }
            }
            oldData.unshift(newTodo)
            fs.writeFile(path.join(__dirname, "todo.json"), JSON.stringify(oldData), (err) => {
                if (err) {
                    return res.status(500).json(
                        {
                            message: "Ghi file thất bại!"
                        }
                    )
                }
                return res.redirect('/todos')
            })
        })
    })
})
router.patch("/:id", (req, res) => {
    // console.log("du lieu nhan vef", req.body);
    if (req.params.id) {
        let flag = false;
        fs.readFile(path.join(__dirname, "todo.json"), 'utf-8', (err, data) => {
            if (err) {
                return res.status(500).json({
                    message: "Lấy dữ liệu todo thất bại"
                })
            }
            let listTodo = JSON.parse(data);
            listTodo = listTodo.map(todo => {
                if (todo.id == req.params.id) {
                    flag = true;
                    return {
                        ...todo,
                        ...req.body
                    }
                }
                return todo
            })
            fs.writeFile(path.join(__dirname, "todo.json"), JSON.stringify(listTodo), (err) => {
                if (err) {
                    return res.status(500).json({
                        message: "Lưu file thất bại!"
                    })
                }
                return res.status(200).json(
                    {
                        message: "Lưu file thành công!"
                    }
                )
            })
        })
    }
})

module.exports = router;