import csvParser from "csv-parser";
import fs from "node:fs";

const filePath = new URL('demo_insert.csv', import.meta.url)

async function executeMultipleRequests() {
    const readableStreamFile = fs.createReadStream(filePath, { encoding: "utf8" })
    const parser = csvParser({
        delimiter: ',',
        skipEmptyLines: true,
        fromLine: 2
    })
    const fileCsvTransformToObject = readableStreamFile.pipe(parser)
    let count = 0
    for await (const line of fileCsvTransformToObject) {
        process.stdout.write(`${count++} ${JSON.stringify(line)}\n`);
        const { title, description } = line
        fetch('http://localhost:3333/tasks', {
            method: 'POST',
            body: JSON.stringify({
                title,
                description
            }),
            headers: {
                'Content-Type': 'application/json'
            },
            duplex: 'half'
        })
    }

}

executeMultipleRequests()
