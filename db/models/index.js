const users = require('./users');
const albums = require('./albums');
const contacts = require('./contacts');
const likes = require('./likes');
const visites = require('./visits');
const photos = require('./photos');
const comments = require('./comments');

module.exports =  async (client) => {
    try {
        await client.query(users.CREATE_TABLE);
        await client.query(albums.CREATE_TABLE);
        await client.query(photos.CREATE_TABLE);
        await client.query(contacts.CREATE_TABLE);
        await client.query(likes.CREATE_TABLE);
        await client.query(visites.CREATE_TABLE);
        await client.query(comments.CREATE_TABLE);
        console.log('Initialized models');
    } catch (err) {
        console.log('Error occured while initializing models')
        console.log(err);
    }
}