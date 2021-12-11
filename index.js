var express = require('express');
var mysql = require('mysql');
var cors = require('cors');
var bodyparser = require('body-parser');
const e = require('express');
var app = express();

app.use(cors());
app.use(bodyparser.json());
app.listen('5000', () => {
    console.log('server running at port 5000');
});

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

var db = mysql.createConnection({
    host: "database-1.cxaqyyfsqya9.ap-south-1.rds.amazonaws.com",
    user: "admin",
    password: "admin1234",
    database: "RING"
});

db.connect((err) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log("database conected");
    }
})

// api
app.get('/api/get/groups/:id' , (req,res) => {
    let sql = ` select GROUP_TABLE.G_ID,GROUP_TABLE.NAME,GROUP_TABLE.ADMIN_ID,ACCOUNT_TABLE.NAME AS ADMIN_NAME,GROUP_TABLE.PREFERENCE
                FROM GROUP_TABLE,GROUP_MEMBER_TABLE,ACCOUNT_TABLE
                WHERE GROUP_TABLE.G_ID = GROUP_MEMBER_TABLE.G_ID 
                AND GROUP_TABLE.ADMIN_ID = ACCOUNT_TABLE.ID
                AND GROUP_MEMBER_TABLE.M_ID = ${req.params.id}
                ;`

    db.query(sql,(err,result) => {
        if(err) {
            console.log(err);
        }else{
            res.send(result);
        }
    })
})

app.get('/api/get/loginDetails/:phone', (req, res) => {
    console.log(req.params.phone);

    let sql = ` select ID,NAME,EMAIL FROM ACCOUNT_TABLE
                WHERE PHONE = '${req.params.phone}';`

    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            
            var exists = JSON.stringify(result);
            // console.log(parseInt(exists.EXIST) == 0);

            console.log(exists);

            if (result.length == 0) {
                var JSON_Result = [
                    {
                        "ID": 0,
                        "NAME": "unknown",
                        "EMAIL": "unknown"
                    }
                ]

                res.send(JSON_Result);
            } else{
                res.send(result);
            }
        }
    })
})

// POST API

app.post('/api/post/requests',(req,res) => {
    console.log("request to" , req.body.phone);

    let sql = ` INSERT INTO REQUESTS_TABLE 
                VALUES (${req.body.id},'${req.body.phone}','${req.body.date}','${req.body.time}','${req.body.timezone}');
                ;`

    db.query(sql,(err,result) => {
        if(err){
            console.log(err);

            res.send({
                "result" : 0,
                "message" : "not requested"
            });

        }else{
            res.send({
                "result" : 1,
                "message" : "requested"
            });
        }
    })
})

app.get('/api/get/GetRequest/:phone',(req,res) => {

    console.log(req.params.phone);
    
    let sql = ` SELECT GROUP_TABLE.NAME,REQUESTS_TABLE.TIME,REQUESTS_TABLE.DATE,REQUESTS_TABLE.TIMEZONE
                FROM REQUESTS_TABLE,GROUP_TABLE
                WHERE REQUESTS_TABLE.USER_PHONE = '${req.params.phone}'
                AND REQUESTS_TABLE.G_ID = GROUP_TABLE.G_ID;
                ;`

    db.query(sql,(err,result) => {
        if(err){
            console.log(err);
        }else{
            console.log(result);
            res.send(result);
        }
    })

})

app.post('/api/post/LoginDetails',(req,res) => {
    
    console.log("post");

    console.log(req.body.phone);

    let sql = ` INSERT INTO ACCOUNT_TABLE 
                VALUES(NULL,'${req.body.phone}','${req.body.name}','${req.body.email}');`

    db.query(sql, (err,result) => {
        if (err) {
            console.log(err);
        } else {
            console.log(result.insertId);

            var JSON_Result = 
                {
                    "ID": result.insertId,
                }

            res.send(JSON_Result);
        }
    })
})