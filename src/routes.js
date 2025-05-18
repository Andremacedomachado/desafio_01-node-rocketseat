import { randomUUID } from 'node:crypto'

import { Database } from "./database/database.js"
import { buildRoutePath } from "./utils/build-route-path.js"

const database = new Database()

export const routes = [
    {
        method: "PUT",
        path: buildRoutePath("/communication_test/:id"),
        handler: (req, res) => {
            const { body, url, query, params } = req
            console.log(body, url, query, params)

            res.statusCode = 200
            return res
                .setHeader('Content-type', 'application/json')
                .end(JSON.stringify({
                    bodyReceived: body,
                    params,
                    query
                }))
        },
    },
    {
        method: "POST",
        path: buildRoutePath("/tasks"),
        handler: (req, res) => {
            const { title, description } = req.body
            if (!title) {
                return res.writeHead(400).end(
                    JSON.stringify({ message: "Title is required" })
                )
            }
            if (!description) {
                return res.writeHead(400).end(
                    JSON.stringify({ message: "Description is required" })
                )
            }
            database.insert('tasks', {
                id: randomUUID,
                title,
                description,
                complete_at : null,
                update_at: Date(),
                create_at: Date(),
            })

            return res.writeHead(201).end()
        }
    }
]