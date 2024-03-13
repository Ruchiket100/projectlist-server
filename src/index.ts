import { initServer } from "./app/index";

async function init() {
    const app = await initServer()
    app.listen(8000, () => console.log(`Server started at localhost:8000 🚀`))
}

init()