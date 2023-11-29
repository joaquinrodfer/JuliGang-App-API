require('dotenv').config();

require('./mongo');
const User = require('./models/User');

const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header("Access-Control-Allow-Headers", "x-access-token, Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/users', async (req, res) => {
    User.find({}).then(users => {
        res.json(users)
    })
})

app.get('/user/:username', async (req, res) => {
    const username = req.params.username
    User.find({username: username}).then(user => {
        if(user.length > 0) {
            res.json(user)
        } else {
            res.status(404).end()
        }
    })
})

app.post('/login', async (req, res) => {
    console.log("Login Try")
    
    const user = req.body
    
    if(!user || !user.email || !user.password ) {
        return res.status(400).json({
            error: user
        })
    }

    try {
        const newLogin = new User({
            email: user.email,
            password: user.password
        })
    
        User.findOne({email: newLogin.email, password: newLogin.password}).then(user => {
            if(user) {
                res.status(200).json({
                    message: "Inicio de sesión exitoso",
                    status: "SUCCESS",
                    user: user
                })
            } else {
                res.status(404).json({
                    message: "Inicio de sesión fallido",
                    status: "FAILED"
                }).end()
            }
        })
    } catch (err) {
        return res.status(500).json({
            error: "Internal server error"
        });
    }

    
})

app.post('/signup', async (req, res) => {
    const user = req.body;

    if (!user || !user.fullname || !user.username || !user.email || !user.dob || !user.password) {
        return res.status(400).json({
            message: "Complete todos los campos",
            status: "FAILED"
        });
    }

    try {
        const existingUsername = await User.findOne({ username: user.username });
        if (existingUsername) {
            return res.status(400).json({
                message: "El nombre de usuario ya está en uso",
                status: "FAILED"
            });
        }

        const existingEmail = await User.findOne({ email: user.email });
        if (existingEmail) {
            return res.status(400).json({
                message: "El correo ya está en uso",
                status: "FAILED"
            });
        }

        const newUser = new User({
            fullname: user.fullname,
            username: user.username,
            email: user.email,
            dob: new Date(user.dob),
            password: user.password,
            created: new Date(),
            role: user.role ? user.role : 'user'
        });

        const userSaved = await newUser.save();
        res.status(200).json({
            message: "Usuario creado exitosamente",
            status: "SUCCESS",
            user: userSaved
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Internal server error"
        });
    }
});


app.delete('/user/:username', async (req, res) => {
    const username = req.params.username

    if(!username) {
        return res.status(400).json({
            error: "Username is missing"
        })
    }

    try {
        const result = await User.deleteOne({ username: username });
        
        if (result.deletedCount > 0) {
            return res.status(204).end();
        } else {
            return res.status(404).json({
                error: "User not found"
            });
        }
    } catch (err) {
        return res.status(500).json({
            error: "Internal server error"
        });
    }
})

const PORT = 3000
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`)
})