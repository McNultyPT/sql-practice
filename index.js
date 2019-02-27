const express = require('express');

const knex = require('knex');
const knexConfig = require('./knexfile.js');
const db = knex(knexConfig.development);

const server = express();
const port = 8500;

server.use(express.json());

server.get('/project/:id', (req, res) => {
    const id = req.params.id;

   db('projects')
     .where({ id })
     .first()
     .then(project => {
        db('actions')
            .where({ 'project_id': id })
            .then(actions => {
                project.actions = actions;
                res.status(200).json(project)
            }) 
     })
     .catch(() => {
         res.status(500).json({ error: 'error'})
     });
});

server.listen(port, () => console.log(`\nAPI running on http://localhost:${port}\n`));
