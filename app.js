const express = require('express');
require('dotenv').config();

const API_KEY = process.env.API_KEY;


const app = express();
app.use(express.static(__dirname + '/public'));

console.log('listening on 8888');
app.listen(8888);