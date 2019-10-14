const express   = require('express');
const utils     = require('../utils');
const config    = require('../config.json');
const base64url = require('base64url');
const router    = express.Router();
const database  = require('./db');

/* ---------- ROUTES START ---------- */
router.post('/register', (request, response) => {
    if(!request.body || !request.body.username || !request.body.name) {
        response.json({
            'status': 'failed',
            'message': 'Request missing name or username field!'
        })
        return
    }
    let username = request.body.username;
    let name = request.body.name;

    if(database[username] && database[username].registered) {
        response.json({
            'status': 'failed',
            'message': `Username ${username} already exists`
        })
        return
    }
    database[username] = { 
        'name': name,
        'registered': false,
        'id': utils.randomBase64URLBuffer(),
        'authenticators': []
    }

    let challengeMakeCred = utils.generateServerMakeCredRequest(username, name, 
                                                                database[username].id)
    challengeMakeCred.status = 'ok'
    request.session.challenge = challengeMakeCred.challenge;
    request.session.username = username;
    response.json(challengeMakeCred)
})




/* ---------- ROUTES END ---------- */

module.exports = router;
