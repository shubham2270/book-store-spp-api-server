const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const saltRounds = 10;

app.use(express.json());

app.get('/', (req, res) => {
    res.send(database.users)
})

const database = {
    users: [
        {
            id: '123',
            name: 'John',
            email: 'john@gmail.com',
            password: 'john',
            joined: new Date()
        },
        {
            id: '124',
            name: 'Sally',
            email: 'Sally@gmail.com',
            password: 'Sally',
            joined: new Date()
        },
    ]
}

app.post('/signin', (req, res) => {

    bcrypt.compare('Ann', '$2b$10$j6xuACF3/yW9En3nRCEI4.GRm7gxCMh0mGCbMsvoBRnECU73vqc4W', function(err, res) {
        console.log('first guess',res)
    });
    bcrypt.compare('ann', '$2b$10$j6xuACF3/yW9En3nRCEI4.GRm7gxCMh0mGCbMsvoBRnECU73vqc4W', function(err, res) {
        console.log('second guess', res)
    });

    if(req.body.email === database.users[0].email &&
       req.body.password === database.users[0].password) {
           res.json('Login Success!')
       } else {
           res.status(400).json('Error logging in')
       }
})

app.post('/register', (req, res) => {
    const { email, name, password } = req.body

    // //Password hashing
    // bcrypt.hash(password, saltRounds, function(err, hash) {
    //     console.log(hash)
    //   });

    database.users.push({
        id: '125',
        name: name,
        email: email,
        password: password,
        joined: new Date()
    })
    res.json(database.users[database.users.length - 1])
})

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    let found = false;
    database.users.forEach(user => {
        if(user.id === id) {
            found = true;
           return res.json(user)
        }
    })
    if(!found) {
        res.status(400).json('not found')
    }
})

app.listen(3000, () => {
    console.log('App is running on port 3000');
})
