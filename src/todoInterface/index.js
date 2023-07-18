import axios from "axios";
import express from "express";
const router = express.Router();
import fs from "fs";
import path from "path";

router.use("/", (req, res) => {
    fs.readFile(
        path.join(__dirname, "templates/home.html"),
        "utf-8",
        async (err, data) => {
            if (err) {
                return res.send("load UI thất bại!");
            }
            let todoContent = ``;
            let listToDo;
            await axios
                .get("http://localhost:4000/api/v1/todos")
                .then((res) => {
                    listToDo = res.data.data;
                })
                .catch((err) => {
                    listToDo = [];
                });
            // console.log(listToDo)
            listToDo.map((todo) => {
                const todoCheck = todo.completed
                    ? `<del>${todo.title}</del>`
                    : todo.title;
                todoContent += `
                <li class="list-group-item d-flex justify-content-between align-items-center border-start-0 border-top-0 border-end-0 border-bottom rounded-0 mb-2">
                         <div class="d-flex align-items-center">
                             <input class="form-check-input me-2" type="checkbox" value="" ${todo.completed ? 'checked' : ''}
                                aria-label="..."
                                onChange="handleChange(event, '${todo.id}')"/>
                            ${todoCheck}
                        </div>
                         <button style="background-color: red !important; border:none !important"  onclick={deleteTodo(event,${todo.id})} type="button" class="btn btn-primary">Delete</button>
                 </li>
                `;
            });
            res.send(data.replace("{{todoContent}}", todoContent));
        }
    );
});

module.exports = router;
