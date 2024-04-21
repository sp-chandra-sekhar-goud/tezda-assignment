const  AWS = require('aws-sdk');
AWS.config.update({
    region: 'ap-south-1'
})

const dynamodb = new AWS.DynamoDB.DocumentClient();
const userTable = 'tezda-users'

const util = require('../utils/util');
const bcrypt = require('bcryptjs');

async function register(userInfo){
    
    const email = userInfo.email;
    const password = userInfo.password;
    const username = userInfo.username;

    if(!email || !password || !username){
        return util.buildResponse(401, {
            message: 'All fields are required'
        })
    }

    const dynamoUser = await getUser(username);
    if(dynamoUser && dynamoUser.username){
        return util.buildResponse(401, {
            message: 'username already exists'
        })
    }

    const encryptedPassword = bcrypt.hashSync(password.trim(), 10);
    const user = {
        email: email,
        username: username.toLowerCase().trim(),
        password: encryptedPassword
    }

    const savedUserResponse = await saveUser(user);
    if(!savedUserResponse){
        return util.buildResponse(503, {
            message: 'Server Error, Please try again later'
        })
    }

    return util.buildResponse(200, {username: username});
}


async function getUser(username){
    const params = {
        TableName: userTable,
        Key: {
            username: username
        }
    }

    return await dynamodb.get(params).promise().then(response => {
        return response.Item;
    }, error => {
        console.error("There is an error", error);
    })
}


async function saveUser(user){
    const params = {
        TableName: userTable,
        Item: user,
    }

    return await dynamodb.put(params).promise().then(response => {
        return true;
    }, error => {
        console.error("There is an error in saving the user", error);
    })
} 

module.exports.register = register;