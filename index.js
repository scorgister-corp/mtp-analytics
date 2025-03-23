const USERS = require("./users.json");
const fs = require("fs");

const EXPORT_USERS_PATH = "./users/";
const GLOBAL_FILE = "./global.json"

if(!fs.existsSync(EXPORT_USERS_PATH))
    fs.mkdirSync(EXPORT_USERS_PATH);


let analyticsDate = new Date();
analyticsDate.setHours(-23);

let date = analyticsDate.getDate();
if(date.toString().length < 2)
    date = "0" + date;


let month = analyticsDate.getMonth();
if(month.toString().length < 2)
    month = "0" + month;

let year = analyticsDate.getFullYear();

let global = {};

let countOS = {};
let countBrowser = {};
let nbUser = 0;

if(fs.existsSync(GLOBAL_FILE)) {
    global = JSON.parse(fs.readFileSync(GLOBAL_FILE));
    countOS = global.os;
    countBrowser = global.browser;
    nbUser = global.nb_user;
}

for(let user in USERS) {
    let userData = {};
    if(fs.existsSync(EXPORT_USERS_PATH + user + ".json")) {
        userData = JSON.parse(fs.readFileSync(EXPORT_USERS_PATH + user + ".json"));
    }else {
        if(countOS[USERS[user].os.name] == undefined) {
            countOS[USERS[user].os.name] = 1;
        }else
            countOS[USERS[user].os.name] += 1;
    
        if(countBrowser[USERS[user].browser.name] == undefined)
            countBrowser[USERS[user].browser.name] = 1;
        else
            countBrowser[USERS[user].browser.name] += 1;

        nbUser++;

    }

    userData[year + month + date] = USERS[user];
    fs.writeFileSync(EXPORT_USERS_PATH + user + ".json", JSON.stringify(userData));

}

global["os"] = countOS;
global["browser"] = countBrowser;
global["nb_user"] = nbUser;

fs.writeFileSync(GLOBAL_FILE, JSON.stringify(global));
