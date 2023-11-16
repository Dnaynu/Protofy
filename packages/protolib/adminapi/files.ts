
import { promises as fs } from 'fs';
import { constants } from 'fs';
import path from 'path';
import { app } from 'protolib/api';
import {getServiceToken} from 'protolib/api/lib/serviceToken'
import multer from 'multer';
import fsExtra from 'fs-extra';
import syncFs from 'fs'
import { v4 as uuidv4 } from 'uuid';
import {generateEvent} from 'app/bundles/library'
import { handler } from '../api';

const PROJECT_WORKSPACE_DIR = process.env.FILES_ROOT ?? "../../"; // Define where the workspace root dir is

const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        const destPath = path.join(process.cwd()+ '/' +PROJECT_WORKSPACE_DIR, req.params.path);
        await fsExtra.ensureDir(destPath);
        cb(null, destPath);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

async function fileExists(filePath) {
    try {
        await fs.access(filePath, constants.F_OK);
        return true;
    } catch (error) {
        return false;
    }
}

// Handler function to avoid repeating the same code for both routes
const handleFilesRequest = async (req, res) => {
    const name = req.params.path || '';
    const isDownload = req.query.download

    const filepath = path.join(PROJECT_WORKSPACE_DIR, name);

    if (! await fileExists(filepath)) {
        res.status(404).send('No such file or directory: ' + filepath)
        return
    }
    if (((await fs.stat(filepath)).isDirectory())) {
        try {
            const fileList = await fs.readdir(filepath);

            res.send(await Promise.all(fileList.map(async (f) => {
                const filePath = path.join(filepath, f);
                const stats = await fs.stat(filePath);

                return {
                    id: uuidv4(),
                    path: `${name}/${f}`,
                    isHidden: f.startsWith('.'),
                    name: f,
                    size: stats.size,
                    modDate: stats.mtime,
                    isDir: stats.isDirectory()
                };
            })));
        } catch (e) {
            res.status(501).send(`The path '${name}' is not a directory`);
        }
    } else {
        // Serving the file:
        try {
            // // Using 'mime' package to determine content type based on file extension
            // const contentType = mime.lookup(filepath)
            // if (contentType) {
            //     res.setHeader('Content-Type', contentType);
            // }
            //console.log('send file: ', filepath, path.resolve(filepath))
            if (isDownload) {
                // Establece el encabezado para forzar la descarga
                res.setHeader('Content-Disposition', 'attachment; filename='+name);
            }
            res.status(200).sendFile(path.resolve(filepath), { dotfiles: 'allow' }, (err) => {
                if (err) {
                    console.error('Error al enviar el archivo:', err);
                    res.status(err.status || 500).send('Error al enviar el archivo');
                }
            });
        } catch (e) {
            console.error('Error reading file: ', e)
            res.status(500).send(`Failed to serve the file at path '${name}'`);
        }
    }
};

const handleFilesDeleteRequest = (req, res) => {
    const name = req.params.path || '';
    const filesToDelete = req.body;
    const filepath = path.join(PROJECT_WORKSPACE_DIR, name);
    if(!filesToDelete || !filesToDelete.length) return res.status(500).send('error')
    const fullPathFilesToDelete = filesToDelete.map(f => path.join(filepath,f))
    console.log('** DELETING FILES: ', fullPathFilesToDelete)
    fullPathFilesToDelete.forEach(f => syncFs.unlinkSync(f))
    generateEvent({
        path: 'files/delete/file', //event type: / separated event category: files/create/file, files/create/dir, devices/device/online
        from: 'api', // system entity where the event was generated (next, api, cmd...)
        user: '-', // the original user that generates the action, 'system' if the event originated in the system itself
        payload: {'path': name} // event payload, event-specific data
    }, getServiceToken())
    res.send({result: 'deleted'})
}

//received post requests and creates directories or write files, dependeing on query string param
//the content of the file is readed from req.body
//the path to the file to write/directory to create, is extracted from req.params[0]
//if path is /a/b/c, a and b should exist to create c
const handleFilesWriteRequest = async (req, res) => {
    const name = req.params.path || '';
    const filepath = path.join(PROJECT_WORKSPACE_DIR, name);
    if (req.body.content) {
        await fs.writeFile(filepath, req.body.content)
    }

    generateEvent({
        path: 'files/write/file', //event type: / separated event category: files/create/file, files/create/dir, devices/device/online
        from: 'api', // system entity where the event was generated (next, api, cmd...)
        user: '-', // the original user that generates the action, 'system' if the event originated in the system itself
        payload: {'path': name} // event payload, event-specific data
    }, getServiceToken())
    res.status(200).send({result: "uploaded"});
};

const requireAdmin = () => handler(async (req, res, session, next) => {
    if(!session || !session.user.admin) {
        res.status(401).send({error: "Unauthorized"})
        return
    }
    next()
})

// Route to write files or create directories directly in /adminapi/v1/files
app.post('/adminapi/v1/files', requireAdmin(), upload.single('file'), handleFilesWriteRequest);
// Route to write files or create directories in /adminapi/v1/files/*
app.post('/adminapi/v1/files/:path(*)', requireAdmin(), upload.single('file'), handleFilesWriteRequest);
// Route for /adminapi/v1/files
app.get('/adminapi/v1/files', requireAdmin(), handleFilesRequest);
// Route for /adminapi/v1/files/*
app.get('/adminapi/v1/files/:path(*)', requireAdmin(), handleFilesRequest);

app.post('/adminapi/v1/deleteFiles/:path(*)', requireAdmin(), handleFilesDeleteRequest);

