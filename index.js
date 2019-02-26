const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const projectDb = require('./data/helpers/projectDb');
const actionDb = require('./data/helpers/actionDb');

const server = express();
const port = 8500;

server.use(cors());
server.use(helmet());
server.use(express.json());

const db = require('./data/dbConfig.js');

server.post('/projects', (req, res) => {
    const project = req.body;
    projectDb.insert(project)
        .then(projectId => {
            console.log(projectId);
            res.status(201).json(projectId);
        })
        .catch(() => res.status(500).json({error: 'Error adding project'}));
})

server.post('/actions', (req, res) => {
    const action = req.body;
    actionDb.insert(action)
        .then(actionId => {
            res.status(201).json(actionId);
        })
        .catch(() => res.status(500).json({error: 'Error adding action'}));
})

server.get('/project/:id', (req, res) => {
    const id = req.params.id;
    
    db('projects')
        .first()
        .where({ id })
        .then(project => {
            return db('actions')
                // .select('actions.id', 'actions.description', 'actions.notes', 'actions.completed')
                .where({ 'project_id': id })
                .then(actions => {
                    project.actions = actions;
                    res.status(200).json(project)
                }).catch(err => console.log(err))
        }).catch(err => console.log(err))

    // projectDb.getProjectActions(id)
    //     .then(projectActions => {
    //         console.log(projectActions);
    //         res.status(200).json(projectActions);
    //     })
    //     .catch(foo => {
    //         console.log(foo);
    //         res.status(500).json({error: 'Error getting project and actions'});
    //     })
});

server.listen(port, () => console.log(`\nAPI running on http://localhost:${port}\n`));