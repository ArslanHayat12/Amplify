/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/



const AWS = require('aws-sdk')
var awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
var bodyParser = require('body-parser')
var express = require('express')
var cors = require('cors')

AWS.config.update({ region: process.env.TABLE_REGION });

const dynamodb = new AWS.DynamoDB.DocumentClient();

let tableName = "userInfoDb";
if (process.env.ENV && process.env.ENV !== "NONE") {
  tableName = tableName + '-' + process.env.ENV;
}

const userIdPresent = false; // TODO: update in case is required to use that definition
const partitionKeyName = "email";
const partitionKeyType = "S";
const sortKeyName = "";
const sortKeyType = "";
const hasSortKey = sortKeyName !== "";
const path = "/addUser";
const UNAUTH = 'UNAUTH';
const hashKeyPath = '/:' + partitionKeyName;
const sortKeyPath = hasSortKey ? '/:' + sortKeyName : '';
// declare a new express app
var app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "*")
  next()
});


const corsOptions = {
  origin: '*',
  methods: ['POST', 'GET', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}
app.use(cors(corsOptions));
// convert url string param to expected Type
const convertUrlType = (param, type) => {
  switch (type) {
    case "N":
      return Number.parseInt(param);
    default:
      return param;
  }
}

/********************************
 * HTTP Get method for list objects *
 ********************************/

app.get(path + '/clinikoUsers', function (req, res) {
  const getPractitioners = async () => {
    try {
      const practionerData = await require("@pipedreamhq/platform").axios(this, {
        url: `https://api.au1.cliniko.com/v1/practitioners  `,
        headers: {
          "User-Agent": `Pipedream (support@pipedream.com)`,
          "Accept": `application/json`,
        },
        auth: {
          username: `MS0yOTgyNC1HeUlOTlRlbEdNRjlhbHY5dGRZeU8zTFdHN09rT2hscg-au1`,
          password: ``,
        },
      })

      const practitioners = practionerData.practitioners.map(async (practitioner) => {

        const user = await require("@pipedreamhq/platform").axios(this, {
          url: `${practitioner.user.links.self}`,
          headers: {
            "User-Agent": `Pipedream (support@pipedream.com)`,
            "Accept": `application/json`,
          },
          auth: {
            username: `MS0yOTgyNC1HeUlOTlRlbEdNRjlhbHY5dGRZeU8zTFdHN09rT2hscg-au1`,
            password: ``,
          },
        })
        return ({
          ...practitioner,
          practitionerId: practitioner.id,
          ...user
        })
      })
      const practionerList = await Promise.all(practitioners)
      const practionerMappedList = practionerList.map((user => ({
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        full_name: user.first_name + ' ' + user.last_name,
        email: user.email,
        role: user.role,
        practitionerId: user.practitionerId
      })))
      res.json({ practitioners: practionerMappedList });
    } catch (err) {
      res.statusCode = 500;
      res.json({ error: 'Error ' + err });
    }


  }
  getPractitioners()
})



/********************************
 * HTTP Get method for list objects *
 ********************************/

app.get(path + '/clinikoBusinesses', function (req, res) {
  const getBusinesses = async () => {
    try {
      const businessesData = await require("@pipedreamhq/platform").axios(this, {
        url: `https://api.au1.cliniko.com/v1/businesses  `,
        headers: {
          "User-Agent": `Pipedream (support@pipedream.com)`,
          "Accept": `application/json`,
        },
        auth: {
          username: `MS0yOTgyNC1HeUlOTlRlbEdNRjlhbHY5dGRZeU8zTFdHN09rT2hscg-au1`,
          password: ``,
        },
      })
      const businesses = businessesData.businesses.map((business => ({
        id: business.id,
        business: business.business_name,
        email: business.email_reply_to
      })))
      res.json({ businesses });
    } catch (err) {
      res.statusCode = 500;
      res.json({ error: 'Error ' + err });
    }
  }
  getBusinesses()

})


/********************************
 * HTTP Get method for list objects *
 ********************************/

app.get(path + hashKeyPath, function (req, res) {
  var condition = {}
  condition[partitionKeyName] = {
    ComparisonOperator: 'EQ'
  }

  if (userIdPresent && req.apiGateway) {
    condition[partitionKeyName]['AttributeValueList'] = [req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH];
  } else {
    try {
      condition[partitionKeyName]['AttributeValueList'] = [convertUrlType(req.params[partitionKeyName], partitionKeyType)];
    } catch (err) {
      res.statusCode = 500;
      res.json({ error: 'Wrong column type ' + err });
    }
  }

  let queryParams = {
    TableName: tableName,
    KeyConditions: condition
  }

  dynamodb.query(queryParams, (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.json({ error: 'Could not load items: ' + err });
    } else {
      res.json(data.Items);
    }
  });
});

/*****************************************
 * HTTP Get method for get single object *
 *****************************************/

app.get(path + '/object' + hashKeyPath + sortKeyPath, function (req, res) {
  var params = {};
  if (userIdPresent && req.apiGateway) {
    params[partitionKeyName] = req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
  } else {
    params[partitionKeyName] = req.params[partitionKeyName];
    try {
      params[partitionKeyName] = convertUrlType(req.params[partitionKeyName], partitionKeyType);
    } catch (err) {
      res.statusCode = 500;
      res.json({ error: 'Wrong column type ' + err });
    }
  }
  if (hasSortKey) {
    try {
      params[sortKeyName] = convertUrlType(req.params[sortKeyName], sortKeyType);
    } catch (err) {
      res.statusCode = 500;
      res.json({ error: 'Wrong column type ' + err });
    }
  }

  let getItemParams = {
    TableName: tableName,
    Key: params
  }

  dynamodb.get(getItemParams, (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.json({ error: 'Could not load items: ' + err.message });
    } else {
      if (data.Item) {
        res.json(data.Item);
      } else {
        res.json(data);
      }
    }
  });
});


/************************************
* HTTP put method for insert object *
*************************************/

// app.put(path, function(req, res) {

//   if (userIdPresent) {
//     req.body['userId'] = req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
//   }

//   let putItemParams = {
//     TableName: tableName,
//     Item: req.body
//   }
//   dynamodb.put(putItemParams, (err, data) => {
//     if(err) {
//       res.statusCode = 500;
//       res.json({error: err, url: req.url, body: req.body});
//     } else{
//       res.json({success: 'put call succeed!', url: req.url, data: data})
//     }
//   });
// });

/************************************
* HTTP post method for insert object *
*************************************/

app.put(path, function (req, res) {

  if (userIdPresent) {
    req.body['userId'] = req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
  }

  let putItemParams = {
    TableName: tableName,
    Item: req.body
  }
  const COGNITO_CLIENT = new AWS.CognitoIdentityServiceProvider({
    apiVersion: "2016-04-19",
    region: "us-east-1"
  });

  const randPassword = Array(10).fill("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz@$^&").map(function (x) { return x[Math.floor(Math.random() * x.length)] }).join('');
  var poolData = {
    UserPoolId: "us-east-1_8nDtIfnOw",
    Username: req.body?.email,

    DesiredDeliveryMediums: ["EMAIL"],
    TemporaryPassword: randPassword,
    UserAttributes: [
      {
        Name: "email",
        Value: req.body?.email
      },
      {
        Name: "email_verified",
        Value: "true"
      },
      {
        Name: 'custom:role',
        Value: req.body?.role,
      },
      {
        Name: "custom:parentId",
        Value: req.body?.parentId
      },
      {
        Name: "custom:businessId",
        Value: req.body?.businessId
      },
      {
        Name: "custom:clinikoUserId",
        Value: req.body?.clinikoUserId
      },
      {
        Name: "custom:practitionerId",
        Value: req.body?.practitionerId
      },
      {
        Name: "custom:organizations",
        Value: req.body?.organizations
      },
      {
        Name: "custom:mentorIds",
        Value: req.body?.mentorIds
      }
    ]
  };

  // COGNITO_CLIENT.updateUserAttributes()

  COGNITO_CLIENT.adminCreateUser(poolData, (error, data) => {
    console.log(error);
    console.log(data);
    if (error) {
      res.statusCode = 500;
      res.json({ error: error, url: req.url, body: req.body });
    } else {
      dynamodb.put(putItemParams, (err, data) => {
        if (err) {
          res.statusCode = 500;
          res.json({ error: err, url: req.url, body: req.body });
        } else {
          res.json({ success: 'post call succeed!', url: req.url, data: data })
        }
      });
      // res.json({ success: 'post call succeed!', url: req.url, data: data })
    }

  });
});



/************************************
* HTTP post method for insert object *
*************************************/

app.put(path + "/update", function (req, res) {

  if (userIdPresent) {
    req.body['userId'] = req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
  }

  let putItemParams = {
    TableName: tableName,
    Item: req.body
  }
  const COGNITO_CLIENT = new AWS.CognitoIdentityServiceProvider({
    apiVersion: "2016-04-19",
    region: "us-east-1"
  });


  var poolData = {
    UserPoolId: "us-east-1_8nDtIfnOw",
    Username: req.body?.email,
    UserAttributes: [
      {
        Name: "email",
        Value: req.body?.email
      },
      {
        Name: 'custom:role',
        Value: req.body?.role,
      },
      {
        Name: "custom:businessId",
        Value: req.body?.businessId
      },
      {
        Name: "custom:clinikoUserId",
        Value: req.body?.clinikoUserId
      },
      {
        Name: "custom:practitionerId",
        Value: req.body?.practitionerId
      },
      {
        Name: "custom:organizations",
        Value: req.body?.organizations
      },
      {
        Name: "custom:mentorIds",
        Value: req.body?.mentorIds
      }
    ]
  };


  COGNITO_CLIENT.adminUpdateUserAttributes(poolData, (error, data) => {
    if (error) {
      res.statusCode = 500;
      res.json({ error: error, url: req.url, body: req.body });
    } else {
      dynamodb.put(putItemParams, (err, data) => {
        if (err) {
          res.statusCode = 500;
          res.json({ error: err, url: req.url, body: req.body });
        } else {
          res.json({ success: 'update call succeed!', url: req.url, data: data })
        }
      });
      // res.json({ success: 'post call succeed!', url: req.url, data: data })
    }

  });
});


/************************************
* HTTP Get method for insert object *
*************************************/

app.get(path, function (req, res) {

  const COGNITO_CLIENT = new AWS.CognitoIdentityServiceProvider({
    apiVersion: "2016-04-19",
    region: "us-east-1"
  });


  var poolData = {
    UserPoolId: "us-east-1_8nDtIfnOw",
  };

  COGNITO_CLIENT.listUsers(poolData, (error, data) => {
    console.log(error);
    console.log(data);
    if (error) {
      res.statusCode = 500;
      res.json({ error: error, url: req.url, body: req.body });
    } else {

      res.json({ success: 'get call succeed!', url: req.url, data: data })
    }

  });
});
/**************************************
* HTTP remove method to delete object *
***************************************/

app.delete(path + hashKeyPath, function (req, res) {

  const COGNITO_CLIENT = new AWS.CognitoIdentityServiceProvider({
    apiVersion: "2016-04-19",
    region: "us-east-1"
  });

  var params = {};

  if (userIdPresent && req.apiGateway) {
    params[partitionKeyName] = req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
  } else {
    params[partitionKeyName] = req.params[partitionKeyName];
    try {
      params[partitionKeyName] = convertUrlType(req.params[partitionKeyName], partitionKeyType);
    } catch (err) {
      res.statusCode = 500;
      res.json({ error: 'Wrong column type ' + err });
    }
  }
  var poolData = {
    UserPoolId: "us-east-1_8nDtIfnOw",
    Username: params[partitionKeyName],
  };

  COGNITO_CLIENT.adminDeleteUser(poolData, (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.json({ error: err, url: req.url });
    } else {
      res.json({ url: req.url, data: data });
    }
  });
});
app.listen(3000, function () {
  console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
