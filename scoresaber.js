/* CONFIG
var display# = [data, dataType, displayID];  

When setting these values, DO NOT CHANGE displayID.
While good practive to set a value for data, it can be left blank if using a custom type other than 0.
*/
var display0 = [0,0,0];
var display1 = [0,0,1];
var display2 = [0,0,2];
//END CONFIG

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
}, 300000);

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
  displaySSData[0] = Number(ss.substring(ss.indexOf("\"pp\": ") + 6, ss.indexOf(",", ss.indexOf("\"pp\": "))));
  //display 0: pp

  displaySSData[1] = Number(ss.substring(ss.indexOf("\"rank\": ") + 8, ss.indexOf(",", ss.indexOf("\"rank\": "))));
  //display 1: rank

  displaySSData[2] = Number(ss.substring(ss.indexOf("\"countryRank\": ") + 15, ss.indexOf(",", ss.indexOf("\"countryRank\": "))));
  //display 2: countryRank

  displaySSData[3] = Number(ss.substring(ss.indexOf("\"totalPlayCount\": ") + 18, ss.indexOf(",", ss.indexOf("\"totalPlayCount\": "))));
  //display 3: totalPlayCount

  displaySSData[4] = Number(ss.substring(ss.indexOf("\"rankedPlayCount\": ") + 19, ss.indexOf("}", ss.indexOf("\"rankedPlayCount\": ") - 3)));
  //display 4: rankedPlayCount

  displaySSData[5] = Number(ss.substring(ss.indexOf("\"averageRankedAccuracy\": ") + 25, ss.indexOf(",", ss.indexOf("\"averageRankedAccuracy\": "))));
  //display 5: averageRankedAcc
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
    lcd.showNumber(0,displaySSData[3],0,1,true);
    lcd.showNumber(0,displaySSData[4],0,1,false);
    break;
  case 4: // 4 digits each for played, ranked / total
    lcd.showNumber(0,displaySSData[4],0,1,true,7);
    lcd.showNumber(0,displaySSData[3],0,1,false);
    break;
  case 5: // totalPlays
    lcd.showNumber(0,displaySSData[3],0,1,false);
    break;   
  case 6: // rankedPlays
    lcd.showNumber(0,displaySSData[4],0,1,false);
    break;   
  case 7: // rank
    lcd.showNumber(0,displaySSData[1]);
    break;
  case 8: // countryRank
    lcd.showNumber(0,displaySSData[2]);
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