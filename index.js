const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');
const FileStore = require('session-file-store')(session);

const publicRoutes = require('./routes/public.routes');
const postRoutes = require('./routes/post.routes')

app.set('view engine', 'ejs');


app.use('/static', express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(session({
    secret: 'secret@1234',
    resave: false,
    saveUninitialized: false,
    store: new FileStore({
        retries: 0
    })
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use('/posts', postRoutes);
app.use('/', publicRoutes);

app.listen(3000, () => {
    console.log('Server is Started');
});