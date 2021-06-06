import * as fs from "fs";
import * as path from "path";

export async function getFilesFromDir(dir, fileTypes): Promise<string[]> {
    let filesToReturn = []
    async function walkDir(currentPath) {
        const files = await fs.promises.readdir(currentPath)
        for (let i in files) {
            let curFile = path.join(currentPath, files[i])
            if ((await fs.promises.stat(curFile)).isFile() && fileTypes.indexOf(path.extname(curFile).toLowerCase()) != -1) {
                // filesToReturn.push(curFile.replace(dir, ''))
                filesToReturn.push(curFile)
            } else if ((await fs.promises.stat(curFile)).isDirectory()) {
                await walkDir(curFile)
            }
        }
    }
    await walkDir(dir)
    return filesToReturn
}
