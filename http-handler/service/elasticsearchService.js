const elasticsearch = require('elasticsearch');
const client = new elasticsearch.Client({
    apiVersion: '7.2',
    host: 'https://search-elasticsearch2-vqy7iilfktbpwrk7l3xdzc6crq.us-east-1.es.amazonaws.com',
});

const search = async query => {
    return await client.search({
        index: 'imagens',
        q: 'tags:' + query
    })
}

module.exports = {
    search: search
}