var ss = "";
var display = [0,0,0,0,0,0];

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
       prepData();}
      })
    })
  .end()
}

function prepData() {
  display[0] = Number(ss.substring(ss.indexOf("\"pp\": ") + 6, ss.indexOf(",", ss.indexOf("\"pp\": "))));
  //display 0: pp

  display[1] = Number(ss.substring(ss.indexOf("\"rank\": ") + 8, ss.indexOf(",", ss.indexOf("\"rank\": "))));
  //display 1: rank

  display[2] = Number(ss.substring(ss.indexOf("\"countryRank\": ") + 15, ss.indexOf(",", ss.indexOf("\"countryRank\": "))));
  //display 2: countryRank

  display[3] = Number(ss.substring(ss.indexOf("\"totalPlayCount\": ") + 18, ss.indexOf(",", ss.indexOf("\"totalPlayCount\": "))));
  //display 3: totalPlayCount

  display[4] = Number(ss.substring(ss.indexOf("\"rankedPlayCount\": ") + 19, ss.indexOf("}", ss.indexOf("\"rankedPlayCount\": ") - 3)));
  //display 4: rankedPlayCount

  display[5] = Number(ss.substring(ss.indexOf("\"averageRankedAccuracy\": ") + 25, ss.indexOf(",", ss.indexOf("\"averageRankedAccuracy\": "))));
  //display 4: averagePlayCount
  console.log(Date.now() + ": Completed Data Processing (" + display + ")");
  
}

