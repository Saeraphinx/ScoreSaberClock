/* CONFIG
var display# = [data, dataType, displayID];  

When setting these values, DO NOT CHANGE displayID.
While good practive to set a value for data, it can be left blank if using a custom type other than 0.
*/
var display0 = [0,2,0];
var display1 = [0,3,1];
var display2 = [0,7,2];
//END CONFIG

// ignore this stuff unless things do really wrong, then contact me on discord (TM0D#4533)
var LedControl = require("rpi-led-control");
var lc = new LedControl(14,18,15);
var ld = new LedControl(13,26,19);
var le = new LedControl(23,25,24);

var ss = "";
var displaySSData = [0,0,0,0,0,0];

callAPI();

setInterval(function(){
callAPI();
console.log("\n\n\n" + Date.now() + ": Calling ScoreSaber API (setInterval 30s)");
}, 600000);

function callAPI(){
  console.log(Date.now() + ": Calling ScoreSaber API (callAPI())");
const http = require("https")
http.request(
    {
      hostname: "new.scoresaber.com",
      path: "/api/player/76561198323656813/full",
    },
    res => {
      let data = ""

      res.on("data", d => {
        data += d
      })
      res.on("end", () => {
       console.log(ss = data)
       console.log(Date.now() + ": Completed API Call, Status: " + res.statusCode);
       if (res.statusCode = 200) {
       prepData();
      } else {
        console.log("No Response, holding data and waiting.")
      }
      })
    })
  .end()
}

function prepData() {

  let ssData = JSON.parse(ss);
  let ssRankedAcc = ssData.scoreStats.averageRankedAccuracy;
  // ssRankedAcc = ssRankedAcc * 1000;
  // ssRankedAcc = (parseInt(ssRankedAcc)) / 1000;

  displaySSData[0] = ssData.pp;
  displaySSData[1] = ssData.rank;
  displaySSData[2] = ssData.contryRank;
  displaySSData[3] = ssData.scoreStats.totalPlayCount;
  displaySSData[4] = ssData.scoreStats.rankedPlayCount;
  displaySSData[5] = ssRankedAcc

  /* TODO:
      write math and code for history of rank & rank change,
      would be a nice display to have
  */

  console.log(Date.now() + ": Completed Data Processing (" + displaySSData + ")");


  displayInfo(display0,lc);
  displayInfo(display1,ld);
  displayInfo(display2,le);
  console.log(Date.now() + ": Completed Display Building ("+display0[1]+","+display1[1]+","+display2[1]+")");
}

function displayInfo(display, lcd) {
let type = display[1];

// showNumber(deviceNumber, num, [decimalplaces], [minimumdigits], [leftjustified], [pos], [dontclear])
switch (type) {
  // SPECIAL CASES
  case 2: // pp
    lcd.showNumber(0,displaySSData[0],1);
    lcd.setChar(0, 7, "P", true);
    lcd.setChar(0, 6, "P", true);
    break;
  case 3: // 4 digits each for played, total / ranked
    lcd.showNumber(0,displaySSData[3],0,1,true,void 0,false);
    lcd.showNumber(0,displaySSData[4],0,1,false,void 0,true);
    break;
  case 4: // 4 digits each for played, ranked / total
    lcd.showNumber(0,displaySSData[4],0,1,true,void 0,false);
    lcd.showNumber(0,displaySSData[3],0,1,false,void 0,true);
    break;
  case 5: // totalPlays
    lcd.showNumber(0,displaySSData[3],0,1,false,void 0,true);
    break;   
  case 6: // rankedPlays
    lcd.showNumber(0,displaySSData[4],0,1,false,void 0,true);
    break;   
  case 7: // rank
    lcd.showNumber(0,displaySSData[1],0,1,false,void 0,true);
    break;
  case 8: // countryRank
    lcd.showNumber(0,displaySSData[2],0,1,false,void 0,true);
    break;
  case 9: // 4 digits each for rank, rank / country
    lcd.showNumber(0,displaySSData[1],0,1,true,void 0,false);
    lcd.showNumber(0,displaySSData[2],0,1,false,void 0,true);
    break;
  case 10: // 4 digits each for rank, country / rank
    lcd.showNumber(0,displaySSData[2],0,1,true,void 0,false);
    lcd.showNumber(0,displaySSData[1],0,1,false,void 0,true);
    break;

  //DEFAULT CASES
  case 1: // Double, rounded to hundreths 
    lcd.showNumber(0,display[0],2,3);
    break;
  case 0: // Integer, no formatting
  default:
    lcd.showNumber(0,display[0])  
    break;
}
console.log("Display" + display[2] + " with type " + type);
}