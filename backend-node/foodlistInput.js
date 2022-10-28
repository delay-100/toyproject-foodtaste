const readLine = require('readline');
const f = require('fs');
const { Food } = require('./models');

const file = './foodlist.txt';

const rl = readLine.createInterface({
    input : f.createReadStream(file),
    output : process.stdout,
    terminal: false
});

// db 추가
rl.on('line', async function (text) {
    text = text.split(', ');

    
    Food.create({
        name: text[0],
        categorynumber: Number(text[1]),
        categoryname: text[2],
    });
    
});
