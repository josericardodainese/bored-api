const express = require('express');
const os = require('os')
const app = express();
const { translate } = require('bing-translate-api');
const dotenv = require('dotenv');
const axios = require('axios');
const es6Renderer = require('express-es6-template-engine')

dotenv.config();

translate.engine = process.env.GOOGLE_KEY;
translate.key = process.env.TRANSLATE_ENGINE;

async function getBoredApiResult() {
    const boredAPIURL = "https://www.boredapi.com/api/activity"
    const responseApi = await axios.get(boredAPIURL);
    const response  = await translate(responseApi.data.activity, 'en', 'pt', true);
    const english = responseApi.data.activity;
    const pt = response.translation;
    return {english, pt}
}

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
app.engine('html', es6Renderer);
app.set('views', 'views');
app.set('view engine', 'html');

app.get('/', async (_req, res) => {
    const content = await getBoredApiResult();
    res.render('index', {locals: {english: content.english , pt: content.pt }});
});


app.listen(8082, () => {
    console.log("Servidor rodando na porta 8082");
});
