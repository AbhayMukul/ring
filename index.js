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
                res.send("empty");
            } else{
                res.send(result);
            }
        }
    })
})
