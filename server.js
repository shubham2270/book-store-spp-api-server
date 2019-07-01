const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const cors = require('cors');
const knex = require('knex');
// const saltRounds = 10;

const db = knex({
    client: 'mysql',
    connection: {
      host : '127.0.0.1',
      user : 'root',
      password : 'dummypassword',
      database : 'book_store'
}
});

db.select('*').from('users').then(data => {
    console.log(data)
});

app.use(express.json());
app.use(cors());

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

app.post('/login', (req, res) => {

    bcrypt.compare('Ann', '$2b$10$j6xuACF3/yW9En3nRCEI4.GRm7gxCMh0mGCbMsvoBRnECU73vqc4W', function(err, res) {
        console.log('first guess',res)
    });
    bcrypt.compare('ann', '$2b$10$j6xuACF3/yW9En3nRCEI4.GRm7gxCMh0mGCbMsvoBRnECU73vqc4W', function(err, res) {
        console.log('second guess', res)
    });

    if(req.body.email === database.users[0].email &&
       req.body.password === database.users[0].password) {
           res.json('Login Success')
       } else {
           res.status(400).json('Error logging in')
       }
})

app.post('/register', (req, res) => {
    const { email, name, password } = req.body
    db('users')
    .insert([{
        email: email,
        name: name,
        joined: new Date()
    }]).then(response => {
        res.json(response)
    })
    .catch(err => res.status(400).json('unable to register'))
  
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

app.listen(4000, () => {
    console.log('App is running on port 4000');
})
 