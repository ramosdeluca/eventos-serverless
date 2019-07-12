'use strict';

const elasticSearchService = require('./service/elasticsearchService')
const dynamodbService = require('./service/dynamodbService')

module.exports.consumer3 = async (event) => {
  for (const record of event.Records) {
    const item = JSON.parse(record.body)
    console.log('vai pegar item no dynamo....', item.key)
    const dbItem = await dynamodbService.getItem(item.key)
    console.log('switch ', item.eventType)
    switch (item.eventType) {
      case 'TAG_EVENT':
        await elasticSearchService.index({
          id: item.key,
          tags: item.labels
        });
        dbItem.labels = item.labels
        break;
      case 'FILTER_EVENT':
        dbItem.blackWhiteFilter = {
          bucket: item.bucket,
          key: item.key
        }
        break;
      case 'THUMBNAIL_EVENT':
        dbItem.thumbnail = {
          bucket: item.bucket,
          key: item.key
        }
        break;
    }
    console.log('vai gravar no dynamo...', dbItem)
    await dynamodbService.putItem(dbItem)
  }
  return { message: 'Mensagens consumidas com sucesso!', event };
};