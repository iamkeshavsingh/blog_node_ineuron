const { readFile, writeFile } = require('../helper/file.helper');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const PATH = path.join(__dirname, '..', 'data', 'post.data.json');


exports.getAllPosts = async function () {

    var postsObj = await readFile(PATH);
    var posts = Object.keys(postsObj).map(postKey => {
        return {
            ...postsObj[postKey],
            id: postKey
        };
    });

    return posts;
}


exports.getAllPostsForUser = async function (author) {
    console.log(author);

    var postsObj = await readFile(PATH);
    var posts = Object.keys(postsObj)
        .map(postKey => {
            return {
                ...postsObj[postKey],
                id: postKey
            };
        })
        .filter(post => post.author === author.toLowerCase());

    return posts;
}


exports.createPost = async function (title, description, fileName, author) {

    var data = {
        title,
        description,
        author: author.toLowerCase(),
        imageUrl: `http://localhost:3000/uploads/${fileName}`,
        createdAt: new Date().toISOString()
    };

    var posts = await readFile(PATH);
    var id = uuidv4();
    posts[id] = data;

    await writeFile(PATH, posts);
}