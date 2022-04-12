const readLine = require('readline');
const f = require('fs');
const { Food } = require('./models');

const file = './foodlist.txt';

const rl = readLine.createInterface({
    input : f.createReadStream(file),
    output : process.stdout,
    terminal: false
});

// 메뉴를 한 줄씩 출력
rl.on('line', function (text) {
 console.log(text);
});

// Food.create({
//     name: foodlist.
// })