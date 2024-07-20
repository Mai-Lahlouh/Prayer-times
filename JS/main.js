const allPrayersBtn = document.getElementById("btn");
const prayerList = document.getElementById("list");
const dateEle = document.getElementById("date");
const country = document.getElementById("country");
const countryBtn = document.getElementById("countryBtn");
const city = document.getElementById("city");
const nextPrayerEle = document.getElementById("prayer");
const nextPrayerTimeEle = document.getElementById("prayer-time");

let countryData = "Jenin";

//The format for current date
const now = new Date();

function formatDate(date) {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed (0-11), so add 1
    const year = String(date.getFullYear()); // Get the last two digits of the year

    return `${day}-${month}-${year}`;
}
let currentDate = formatDate(now);
//Function to get the current time in HH:MM format
function getCurrentTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
}
//Fetch API
function getData(countryName) {
  prayerList.innerHTML = " ";
  nextPrayerTimeEle.innerHTML = "";
  console.log(countryData);
  axios
    .get(
      `https://api.aladhan.com/v1/timingsByCity?city=Palestine&country=${encodeURIComponent(countryName)}&method=4&date=${currentDate}`
    )
    .then((response) => {
      let prayers = response.data.data.timings;
      let date = response.data.data.date.readable;
      const day = now.toLocaleDateString("en-US", { weekday: "long" });
      dateEle.innerHTML = day + " , " + date;
      city.innerHTML = countryData;
      let prayTimes = [];
      for (const prayer in prayers) {
        if (
          prayer === "Firstthird" ||
          prayer === "Sunset" ||
          prayer === "Imsak" ||
          prayer === "Lastthird" ||
          prayer === "Midnight"
        ) continue;
        prayTimes.push({ prayer: prayer, time: prayers[prayer]});
        prayerList.innerHTML += `
                <section class="item">
                <p>${prayer}</p>
                <p>${prayers[prayer]}</p>
                </section>               `;
      }
      findNext(prayTimes);
      console.log(prayTimes)
      console.log(response.data.data.date);
    })
    .catch((error) => console.log(error));
}

//To get the country
countryBtn.addEventListener("click", () => {
    countryData = country.value;
});

//Change the City
countryBtn.addEventListener("click", () => {
  countryData = country.value;
  getData(countryData);
});

//Find Next Prayers
function findNext(prayTimes){
  var fajerTime;
    let nextPrayer = null;
    let nextPrayerTime = null;
    const currentTime= getCurrentTime();
    prayTimes.forEach(prayer =>{
      if(prayer.prayer === "Fajr"){
        fajerTime = prayer.time;
      }
        if(prayer.time > currentTime && (!nextPrayer || prayer.time < nextPrayerTime)){
            nextPrayer = prayer.prayer;
            nextPrayerTime = prayer.time;
        }else if(prayer.prayer === "Isha"){
          nextPrayer = "Fajr";
          nextPrayerTime = fajerTime;
        }
    });
    if(nextPrayer){
        nextPrayerEle.innerHTML = nextPrayer;
        nextPrayerTimeEle.innerHTML =  " at " + nextPrayerTime;
    }
}

//Display the prayers time for Jordan
getData("Jenin");
