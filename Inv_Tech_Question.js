//I used two API's: "OpenWeatherMap" and "Dark Sky Weather API".
//OpenWeatherMap API website: "https://openweathermap.org"
//Dark Sky Weather API webstie: "https://darksky.net/dev/docs".
//
//
//INSTRUCTIONS:
//FIRST, change the PATH of the "latinmapfile" const on line 14 to the path where you have latinmap.js stored on your computer.
//
//To run program on the command line: $ node Inv_Tech_Question.js -c 1
//If you want to run the program with a different test array, change the last number above. I have 5 test arrays. 
//
//To run the program with your own test array, create an array of postal codes and city names. Then, run the function, array_of_citys_or_post//alcodes(array), and put your array in the argument.

const latinmapfile = require("/Users/LiamOBrien/Desktop/invisible/Invisible_Technical_Question/latinmap.js");//include map that changes undifined letters like 'ã' to readable letters like 'a'.
const request = require('request');
const DSrequest = require('request');
const zipcodes = require('zipcodes');

//Function take a single input(either city or postal code) and returns time and weather.
function time_and_weather(cityorzip){
  let output = ``;
  let apiKey = 'c52d902070cf78c08d87733170517dca'; //open weather map api key.
  let darkskyapikey = '7a664d504e7b11c2da6e8fb7dd9081c5';//dark ski api key.
  let country = 0;
  let iszip = 0;//bool
  let cleancityorzip = cityorzip.latinise(); //clean the input to make sure it doesn't use any undefined symbols.
  let url = '';
  //check if input is postal code or city name. 
  if(isNaN(cityorzip)) { //Use openweathermap api to access latitude and longitude of inputed location.
    iszip = 0;
    try {
      url = `http://api.openweathermap.org/data/2.5/weather?q=${cleancityorzip}&units=imperial&appid=${apiKey}`;//given city name
    }
    catch(err) {
      console.log(`ERROR: The city, ${cityorzip}, doesn't exist`);// if city doesn't exist
      return;
    }
  } 
  else {
    iszip = 1;
    try {
      country = zipcodes.lookup(cleancityorzip).country;
      url = `http://api.openweathermap.org/data/2.5/weather?zip=${cleancityorzip},${country}&units=imperial&appid=${apiKey}`;//given zipcode
    }
    catch(err) {
      console.log(`ERROR: Postal code, ${cityorzip}, doesn't exist`);// if postal code doesn't exist
      return;
    }
  }
  //access open weather map api using request functionality. 
  request(url, function (err, response, body) {
    if(err) {
      console.log('error:', err);
    }
    else {
      let weather = JSON.parse(body);//parse open weathermap api. Use this data to get latitude and longitude. 
      let DS_url = ``;
      try {      
        DS_url = `https://api.darksky.net/forecast/${darkskyapikey}/${weather.coord.lat},${weather.coord.lon}`;//use Dark sky api to get             weather and time data.
      }
      catch(err){
        console.log(`ERROR: Dark sky api key has expired or the city/postal code, ${cityorzip}, doesn't exist`);
        return;
      }
      //access open Dark Sky Weather api using request functionality.
      DSrequest(DS_url, function (DSerr, DSresponse, DSbody) {
        if(DSerr){
          console.log('error:', DSerr);
        } 
        else { 
          let DSdata = JSON.parse(DSbody);//parse dark sky api data.
          let TimeZone = DSdata.timezone;                             ///////////////
          var options = {                                             //  
            timeZone: `${TimeZone}`,                                  // Here I get the timezone from the dark sky api and I use the function
            hour: 'numeric', minute: 'numeric', second: 'numeric',    // "Intl.DateTimeFormat" to access the current time from the timezone 
          },                                                          // input.
          formatter = new Intl.DateTimeFormat([], options);           //
          let formattedTime = formatter.format(new Date());           ///////////////
          //Ahead, log the time and weather to the console. If inputted data is bad (i.e. postal code or city doesn't exist), code will print           error message and then continue reading next input. 
          try {
            if(iszip == 1){
              output = `At the ${cityorzip} postal code, the time is ${formattedTime} and the weather is ${DSdata.currently.temperature} degrees fahrenheit.`;
            } else {
              output = `In ${cityorzip}, the time is ${formattedTime} and the weather is ${DSdata.currently.temperature} degrees fahrenheit.`;
            }
            console.log(output);
          }
          catch(err){
            console.log(`ERROR: ${cityorzip} is an undfefined input.`);// error message if city or postal code doesn't exist.
            return;
          }
        }
      });
    }
  });
}

//This function takes an array of inputs and calls the time_and_weather function for each input. 
function array_of_citys_or_postalcodes(array){
  let i = 0;
  for(i = 0; i < array.length; ++i){
    time_and_weather(array[i]);
  }
}
/////////////////////Finished with code, below is test cases//////////////////////////

//This fucntion runs 5 different test cases depending on what you input on the command line. 
function test_func(){
  const argv = require('yargs').argv;
  let test1 = ['New York', '10005', 'Tokyo','São Paulo', 'Pluto'];
  let test2 = ['dsdssddsa', '1000545', 'France','Sao Paulo', 'moon'];
  let test3 = ['New York', '10005', 'Tokyo','São Paulo', 'Pluto', '56788', '92008', 'hello', 'oceanside','San Francisco'];
  let test4 = ['4', '10005', '345','São Paulo', '56532', 'Mars'];
  let test5 = ['New York', '92008','10005','London','France','Reykjavík', 'Tokyo', 'Beijing', 'Moscow', 'São Paulo', 'Pluto'];
  let testnum = argv.c;
  if(testnum == 1){
    array_of_citys_or_postalcodes(test1);
  }
  else if(testnum == 2){
    array_of_citys_or_postalcodes(test2);
  }
  else if(testnum == 3){
    array_of_citys_or_postalcodes(test3);
  }
  else if(testnum == 4){
    array_of_citys_or_postalcodes(test4);
  }
  else if(testnum == 5){
    array_of_citys_or_postalcodes(test5);
  }
  else {
    console.log("default to test 1:");
    array_of_citys_or_postalcodes(test1);
  }
}

test_func();




