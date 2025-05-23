import fs from 'node:fs/promises'

const databasePath = new URL('../db.json', import.meta.url)

export class Database {
    #database = {}

    constructor() {
        this.#database = fs.readFile(databasePath, 'utf8').then(data => {
            this.#database = JSON.parse(data)
        })
            .catch(() => {
                this.#persist()
            })
    }

    #persist() {
        fs.writeFile(databasePath, JSON.stringify(this.#database))
    }

    insert(table, data) {
        if (Array.isArray(this.#database[table])) {
            this.#database[table].push(data)
        }
        else {
            this.#database[table] = [data]
        }

        this.#persist()
    }

    select(table, search) {
        let records = this.#database[table] ?? []
        if (search) {
            records = records.filter((row) => {
                return Object.entries(search).some(([key, value]) => {
                    if (!value) return true

                    return row[key].includes(value)
                })
            })
        }
        return records
    }

    delete(table, id) {
        const rowIndex = this.#database[table].findIndex(row => row.id == id)
        if (rowIndex > -1) {
            this.#database[table].splice(rowIndex, 1)
            this.#persist()
        }
    }

    update(table, id, data) {
        const rowIndex = this.#database[table].findIndex(row => row.id == id)
        if (rowIndex > -1) {
            const record = this.#database[table][rowIndex]
            this.#database[table][rowIndex] = {
                id,
                ...record,
                ...data
            }
            this.#persist()
        }
    }

    complete_task(table, id) {
        const rowIndex = this.#database[table].findIndex(row => row.id == id)
        if (rowIndex > -1) {
            const record = this.#database[table][rowIndex]
            this.#database[table][rowIndex] = {
                id,
                ...record,
                complete_at: Date()
            }
            this.#persist()
        }
    }
}