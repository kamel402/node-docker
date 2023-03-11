const express = require('express')
const mongoose = require('mongoose');
const { MONGO_USER, MONGO_PASSWORD, MONGO_PORT, MONGO_IP, REDIS_URL, REDIS_PORT, SESSION_SECRET } = require('./config/config');
const postRouter = require('./routes/post.route')
const userRouter = require('./routes/user.route')
const session = require('express-session')
let RedisStore = require('connect-redis')(session)
const { createClient } = require("redis")
let redisClient = createClient({ 
    host: REDIS_URL,
    port: REDIS_PORT, 
})
const cors = require('cors')


const app = express();

mongoose.set('strictQuery', true);
const mongoUrl = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;
const connectWithRetry = () => {
    mongoose
    .connect(mongoUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('Connected to Database'))
    .catch((e) => {
        console.log(e);
        setTimeout(connectWithRetry, 5000);
    });
}
connectWithRetry();

app.enable("trust proxy");
app.use(cors({}))

app.use(session({
    store: new RedisStore({client: redisClient}),
    secret: SESSION_SECRET,
    cookie: {
        secure: false,
        resave: false,
        saveUninitialized: false,
        httpOnly: true,
        maxAge: 30000
    }
}))

app.use(express.json());

app.get('/api/v1', (req, res) => {
    res.send('<H2> Hi there, new changes added </H2>')
    console.log('Hey its ran')
})

app.use("/api/v1/posts", postRouter)
app.use("/api/v1/users", userRouter)

const port = process.env.port || 3000;

app.listen(port, () => console.log(`listening on port ${port}`))