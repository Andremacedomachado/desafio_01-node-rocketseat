import { buildRoutePath } from "./utils/build-route-path.js"

export const routes = [
    {
        method: "PUT",
        path: buildRoutePath("/communication_test/:id"),
        handler: (req, res) => {
            const { body, url, query,params } = req
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
    }
]