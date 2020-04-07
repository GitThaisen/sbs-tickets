import mongoose from 'mongoose';
import {getAgentId} from '../../client/utils'
import mappings from './esMapping.json'
import { elasticIndex, elasticHost, elasticPort, imageStorage } from '../appConfig'

console.log(`Elastic: ${elasticHost}:${elasticPort} ${elasticIndex}`);
console.log('imageStorage', imageStorage);

const client = new elasticsearch.Client({
  host: `${elasticHost}:${elasticPort}`,
  apiVersion: '7.6', // use the same version of your Elasticsearch instance
});


shouldIndex()


function shouldIndex() {
  console.log('check if elastic needs to create index?');
  return new Promise(resolve => {
      exists()
      .then(res => {
        if (res) { 
          // index exists, continue
          resolve(true)
        } else {
createIndex()
.then(indexCreated => {
  if (indexCreated) {resolve(true)} else {resolve(false)}
})
        }
            })
          })
  }

export function exists() {
  return client.indices.exists({ index: elasticIndex });
}

export function createIndex() {
  console.log('Creating new index');
  return client.indices
    .create({
      index: elasticIndex,
      body: {
        mappings: mappings
      },
    })
    .then(() => console.log('Index created'));
}

export function countDocuments (cb) {
  client.count({  
    index: elasticIndex,
  }, function(err,resp,status) {
      return cb(resp);
  });
}

export function addElasticImage (imageData, cb) {
  const filepath=`${imageStorage}/${imageData.filepath}`;
  client.index({  
    index: elasticIndex,
    body: imageData,
  }, function(err,resp,status) {
      return cb(resp);
  });
}

export function getImage(id, cb) {
  client.get({
    index: elasticIndex,
    id: id,
  },function(err,resp,status) {
    return cb(resp._source);
});

}
export function deleteImage(id, cb) {
  client.delete({
    index: elasticIndex,
    id: id,
  },function(err,resp,status) {
    return cb(resp);
});

}

export function addPublication(id, body, cb) {
  client.get({
    index: elasticIndex,
    id: id,
  },function(err,resp,status) {
    console.log('imageId', resp._source);
    //TODO: Check if image exists? and return error
    let pubs = resp._source.publications || [];
    console.log('pubs', pubs);

    const data = {
      publications: pubs.concat(body)
    }

      client.update({
        index: elasticIndex,
        id: id,
        body: {
          doc: data,
        }
      },function(err,resp,status) {
        return cb(resp);
    });
});
}

export function updateImage(id, data, cb) {
  client.update({
    index: elasticIndex,
    id: id,
    body: {
      doc: data,
    }
  },function(err,resp,status) {
    return cb(resp);
});

}

export function getElasticImages(cb) {
  const date = { createdAt: { order: 'desc' } };
  client.search({
    index: elasticIndex,
    size:40,
    from: 0,
    body: {
      "query": {
        "bool": {
          "must": buildQuery({}),
          "filter": buildFilter({}),
        }
      },
      sort: [date],
    }},  (err, result) => {
    return cb(parseResults(result));
})
}

function buildQuery(params) {

/*   {
    "match": {
      "title": "teser"
    }
  } */
  return []
}

function parseResults(results) {
  if (results && results.hits && results.hits.hits) {
        return results.hits.hits.map( d => {
          let data=d._source;
          data.id= d._id;
          return data;
        })
  }
}

function buildFilter(filterdata) {

let filters=[];

if (filterdata.domColor) {
  let colorCode = parseInt(filterdata.domColor);
  const offset = 25;
  const maximum = 360;
  
  let maxColor = colorCode + offset;
  let minColor = colorCode - offset;
  
  if (maxColor > maximum) { maxColor = maxColor - maximum};
  if (minColor < 0) { minColor = minColor + maximum};

  filters.push( {"range": {"colorDominantHLS.h": { "gte": minColor, "lte": maxColor } } }); 
}

if (filterdata.assignmentId) {
  filters.push( {"match": {"assignmentId": filterdata.assignmentId  } });
}


if (filterdata.rating) {
  filters.push( {"range": {"rating": { "gte": filterdata.rating } } }); 
}
if (filterdata.rights) {
  filters.push( {"match": {"rights.rights": filterdata.rights  } });
}
if (filterdata.time) {
  let datefrom = new Date();
  datefrom.setHours(datefrom.getHours() - filterdata.time);
  filters.push( {"range": {"createdAt": { "gt": datefrom } } });
}
if (filterdata.categories) {
  filterdata.categories.forEach(cat => {
    filters.push( {"match": {"categories.id": cat.id  } });
  })
}
if (filterdata.live) {
  filters.push( {"match": {"live": filterdata.live  } });
}

if (filterdata.contributors) {
  filterdata.contributors.forEach(cont => {
    filters.push( {"match": {"contributors.uri": getAgentId(cont.uri)  } }); // elastic hits everything when I include the whole uri: http://authority.nrk.no/agent/c4218a23-c9ed-44e1-a1d8-0fbe4e189320
  })
}

return filters;

}

export function findImages (query,cb) {
  // calback API
  client.search({
        index: elasticIndex,
        body: {
              "query": {
                "function_score": {
                  "query": {
                    "multi_match": {
                      "query": query.q,
                      "type": "best_fields",
                      "fields": [
                        "title",
                        "description",
                        "keywords",
                        "byline",
                        "category",
                        "contributors.name",
                        "categories.title",
                        "photographer.name",
                      ],
                      "fuzziness": "AUTO",
                      "prefix_length": 2
                    }
                  }
                }
              }
            }
      },  (err, result) => {
        return cb(parseResults(result));
  })  
  };

export function similarColors (query, cb) {
  const {h,s,v} = query;
  return cb(h);
}

export function filterImages (filters, cb) {
  const date = { createdAt: { order: 'desc' } };
  
  client.search({
    index: elasticIndex,
    size:40,
    from: 0,
    body: {
      "query": {
        "bool": {
          "must": buildQuery(),
          "filter": buildFilter(filters),
        }
      },
      sort: [date],
    }},  (err, result) => {
    return cb(parseResults(result));
})
};
