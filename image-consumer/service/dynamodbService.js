const AWS = require('aws-sdk')

AWS.config.update({
  region: 'us-east-1'
})

const dynamo = new AWS.DynamoDB.DocumentClient();

const TABLE = 'Images'

const putItem = item => {
    return new Promise((res, rej) => {
        dynamo.put({
            TableName: TABLE,
            Item: item
        }, (err, data) => {
            if (err) {
                return rej(err);
            }
            return (res(data))
        })
    });
}

const getItem = id => {
    return new Promise((res, rej) => {
        console.log('vai fazer o get...', id)
        dynamo.get({
          TableName: TABLE,
          Key: {
            id: id
          },
          ConsistentRead: true
        }, (err, data) => {
            if (err) {
                console.log('err', err)
                return rej(err)
            }
            console.log('trouxe data', data.Item)
          return res(data.Item)
        })
      })
}

module.exports = {
    putItem: putItem,
    getItem: getItem
}