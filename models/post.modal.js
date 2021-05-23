const { readFile, writeFile } = require('../helper/file.helper');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const _ = require('lodash');

const PATH = path.join(__dirname, '..', 'data', 'post.data.json');

// This function will return me all posts irrespective of user
exports.findAll = async function () {

    var postsObj = await readFile(PATH);
    var posts = Object.keys(postsObj).map(postKey => {
        return {
            ...postsObj[postKey],
            id: postKey
        };
    });

    return posts;
}

// This function will return me all posts for a particular user
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

// This function will return me the post based on the id passed
exports.findById = async function (id) {
    var posts = await readFile(PATH);
    return { ...posts[id], id: id };
}


// This function will create a new Post
exports.create = async function (title, description, fileName, author) {

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

// This function will update the post based on the id passed
exports.update = async function (id, title, description) {
    var posts = await readFile(PATH);
    posts[id] = { ...posts[id], title, description };
    await writeFile(PATH, posts);
}


// This function will delete the post based on the id passed
exports.delete = async function (id) {
    var posts = await readFile(PATH);
    var newPosts = _.omit(posts, id);
    await writeFile(PATH, newPosts);
}