const express = require('express');
const mysql = require('mysql');
const MongoClient = require('mongodb').MongoClient;
const app = express();
const cors = require('cors');

const PORT = process.env.PORT || 80; // use default 5000 unless specified otherwise

//Make connection to MySQL and MongoDB on EC2
// You want to use createPool instead of createConnection because createConnection
// automatically disconnects after idle time
// https://stackoverflow.com/questions/55560039/how-is-the-correct-way-to-handle-mysql-connections-in-node-js
const mysql_db = mysql.createPool({
    host: process.env.MySQL_HOST,
    port: 3306,
    user: process.env.MySQL_USER,
    password: process.env.MySQL_PASSWORD,
    database: process.env.MySQL_DB,
    multipleStatements: true
});
// mysql_db.connect(); you only need this if you are using createConnection

app.use(cors());  // allow cors s.t front end can access this backend
app.options('*', cors());

const cleanMysql = (mysql_result_pre, mysql_result) => {
    /* This function computes the actual daily confirmed, recovered and death cases
    from the accumulated results mysql_result (which represent the accumulated result at
    user input's data) and mysql_result_pre (which is the accumulated result at day before)*/
    var pre_json = mysql_result_pre.map(v => Object.assign({}, v));
    var cur_json = mysql_result.map(v => Object.assign({}, v));
    var cleansed = [];
    for (i = 0; i < cur_json.length; i++) {
        var matched = false;
        for (j = 0; j < pre_json.length; j++) {
            if (cur_json[i].country == pre_json[j].country) {
                if (cur_json[i].confirmed - pre_json[j].confirmed !== 0) {
                    // If there are zero confirmed cases, no need to display it so skip in that case
                    var cur_obj = {"country": cur_json[i].country, "datecase": cur_json[i].datecase, "latitude":cur_json[i].latitude, "longitude":cur_json[i].longitude, 
                               "confirmed": cur_json[i].confirmed - pre_json[j].confirmed, "deaths": cur_json[i].deaths - pre_json[j].deaths, 
                               "recovered": cur_json[i].recovered - pre_json[j].recovered};
                    cleansed.push(cur_obj);
                }
                matched = true;
            }
        }
        if (matched == false) {
            // In case there isn't a match from previous day, use current day's data as the daily data
            cleansed.push(cur_json[i]);
        }
    }
    return cleansed;
}

app.get('/getdata/:date', (req, res) => {
    const cur_date = req.params.date; // in format 2020-01-22
    const split_date = cur_date.split('-');
    // rearrange date into a format that matches MongoDB's date field
    const cur_date_recompile = split_date[1] + '/' + split_date[2] + '/' + split_date[0]; // in format 01/22/2020

    // Since the data stored in Mysql are cumulated data, to get daily numbers, I have to query data corresponding to user input
    // and data from the day before and subtract numbers to get the correct value
    const country_list = ["'China'", "'South Korea'", "'India'", "'France'", "'Italy'", "'United States'", "'Brazil'"]
    const sql = "SELECT D.*, C.latitude, C.longitude FROM Country as C, DailyCase as D where C.name = D.country and D.datecase = '" + cur_date + "'";
    const sql_pre = 'SELECT D.*, C.latitude, C.longitude FROM Country as C, DailyCase as D where C.name = D.country and D.datecase = date_sub("' + cur_date + '", interval 1 day)';

    const sql_template = 'SELECT * FROM DailyCase where datecase <= "' + cur_date + '" and country = ';
    var combined_sql = sql_pre + ";" + sql + ";";
    for (var i = 0; i < country_list.length; i++) {
        combined_sql += sql_template + country_list[i] + ";";
    }

    mysql_db.query(combined_sql, (err, mysql_results) => {
        if (err) throw err;
                
        // For mongoDB, it sounds like pooling is already automatically handled with recent updates.
        MongoClient.connect(`mongodb://${process.env.Mongo_USER}:${process.env.Mongo_PASSWORD}@${process.env.Mongo_HOST}:27017/`, (err, db) => {
            if (err) throw err;

            var cur_result = {} // results from MongoDB and MySQL will be compiled here
            var mongo_db = db.db("project"); // database to connect to

            //Compile results and return. This all has to be done inside here to account for async nature of these calls
            const acc_query = {date: cur_date_recompile};
            mongo_db.collection('covidDate').findOne(acc_query, (err, acc_result) => {
                if (err) throw err;
                
                var cleansed = cleanMysql(mysql_results[0], mysql_results[1]);
                cur_result['mysql_result_pre'] = cleansed;
                cur_result['mysql_result'] = mysql_results;
                cur_result['acc_result'] = acc_result;
                db.close();
                res.json(cur_result);
            })
        })
    })
});

app.listen(PORT, () => console.log("connected to port number: ", PORT));