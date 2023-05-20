const express=require('express')
const app=express()
const jwt=require('jsonwebtoken')
require('dotenv').config()

app.use(express.urlencoded({extended: false}))
app.use(express.json())

app.get('/', (req,res)=>{
    res.send('Hola Mundo');
})

//?accesstoken=

app.get('/api', validateToken,(req,res)=>{
    res.json({
        prueba:[
            {
                id:0,
                text:'Texto de prueba 1'
            }
        ]
    })
})

app.get('/login', (req,res)=>{
    res.send(
        `<html>
            <head>
                    <title>Login</title>
            </head>
            <body>
                <form method="POST" action="/auth">
                    Nombre de usuario: <input type="text" name="text"><br/>
                    Contraseña: <input type="password" name="password"><br/>
                    <input type="submit" value="Iniciar sesion"/>
                </form>
            </body>
        </html>`
    )
})

app.post('/auth',(req,res)=>{
    const {username,password}=req.body
    
    //Validar que existan username y password en la BD
    const user={username: username}

    //Generar el token
    const accessToken=generateAccessToken(user);

    res.header('authorization', accessToken).json({
        message:'Se autentico con exito el usuario',
        token: accessToken
    })
})

function generateAccessToken(user){
    //Pide la informacion que se va a encriptar
    //Despues pide una clave secreta para desencriptar
    return jwt.sign(user, process.env.SECRET, {expiresIn: '5m'})
}

function validateToken(req, res, next){
    const accessToken=req.headers['authorization']|| req.query.accessToken;
    if(!accessToken)res.send('Access denied');

    jwt.verify(accessToken,process.env.SECRET,(error,user)=>{
        //Validar que no halla error
        if(error){
            res.send('Access denied, token expired or incorrect')
        }else{
            next();
        }
    });
}

app.listen(3000, ()=>{
    console.log('servidor iniciando... ')
})