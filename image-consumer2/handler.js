'use strict';

const elasticSearchService = require('./service/elasticsearchService')
const dynamodbService = require('./service/dynamodbService')

module.exports.consumer2 = async (event) => {
  for (const record of event.Records) {
    const item = JSON.parse(record.body)
    console.log('vai pegar item no dynamo...', item.key)
    const dbItem = await dynamodbService.getItem(item.key)
    console.log('switch ', item.eventType)
    switch (item.eventType) {
      case 'TAG_EVENT':
        console.log('tag-event -- vai chamar elastic...', item.labels)
        await elasticSearchService.index({
          id: item.key,
          tags: item.labels
        });
        dbItem.labels = item.labels
        break;
      case 'FILTER_EVENT':
        console.log('filter-event -- vai chamar elastic...', item.labels)
        dbItem.blackWhiteFilter = {
          bucket: item.bucket,
          key: item.key
        }
        break;
      case 'THUMBNAIL_EVENT':
        console.log('thumbnail-event -- vai chamar elastic...', item.labels)
        dbItem.thumbnail = {
          bucket: item.bucket,
          key: item.key
        }
        break;
    }
    console.log('vai gravar no dynamo...', dbitem)
    await dynamodbService.putItem(dbItem)
  }
  return { message: 'Mensagens consumidas com sucesso!', event };
};