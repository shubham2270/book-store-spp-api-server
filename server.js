const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const cors = require('cors');
const knex = require('knex');
// const saltRounds = 10;

const db = knex({
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        user: 'root',
        password: 'dummypassword',
        database: 'book_store'
    }
});

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send(database.users)
})


app.post('/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json('incorrect form submission');
    }

    db.select('email', 'hash').from('login')
    .where('email', '=', email)
    .then(data => {
       const isValid = bcrypt.compareSync(password, data[0].hash);
       if (isValid) {
          return db.select('*').from('users')
           .where('email', '=', email)
           .then(user => {
            res.json('Login Success')
           })
          .catch(err => res.status(400).json('unable to get user'))
       } else {
           res.status(400).json('wrong credentials')
       }
    })
    .catch(err => res.status(400).json('Wrong credentials'))
})

app.post('/register', (req, res) => {
    const { email, name, password } = req.body;
    if (!email || !name || !password) {
        return res.status(400).json('incorrect form submission');
    }
    const hash = bcrypt.hashSync(password, 10);
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
            .into('login')
            .then(loginEmail => {
                return trx('users')
                    // .returning('*')
                    .insert([{
                        email: email,
                        name: name,
                        joined: new Date()
                    }])
                    .then(response => {
                        res.json(response)
                        console.log(response)
                    })
            })
            .then(trx.commit)
            .catch(trx.rollback)
    })
        .catch(err => res.status(400).json('unable to register'))

})

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    db.select('*').from('users').where({ id })
        .then(user => {
            if (user.length) {
                res.json(user[0])
            } else {
                res.status(400).json('Not found')
            }
        })
        .catch(err => res.status(400).json('error getting user'))
})

app.listen(4000, () => {
    console.log('App is running on port 4000');
})
