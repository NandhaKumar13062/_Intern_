let lists=[];
async function fetchWeather() {  
  const city=document.getElementById("get").value.trim();
  if(!city){
    window.alert("Please Enter a city name !!!");
    return ;
  }
  else{
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=86c84403fa5b6402929f3f41f226559e&units=metric`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    if(data.cod=="404"){
      window.alert(data.message);
      return false;
    }
    else{
    const js=JSON.stringify(data, null, 4);
    const temperature=JSON.parse(js);
    lists=temperature.list;
    const body=document.getElementById('vis');
      const input=document.getElementById("get");
      const mid=document.getElementById('middle');
      body.style.visibility="visible" ;
      mid.style.borderTop="none";
      mid.style.borderBottom="none";
      mid.style.top="0px";
      mid.style.left="0px";
      mid.style.width="60%";
      mid.style.height="140px";
      input.style.height="30px"
      input.style.width="250px"
      mid.style.boxShadow="none"
    dailyweather();
    }
    
  }
  
}
        let l1=[];
        let l3=[];
        dateArray=[];
        cur_index=0;
        let weatherdata={};
        let myChart=null;
        let timeObj={};
        let img={};
       
    let dates=new Set();
  function dailyweather(){
    weatherdata={};
    timeObj={};
      lists.forEach(element => {
            if(element){
              let d=(element.dt_txt).slice(0,10);
              let t=(element.dt_txt).slice(11,19);
              dates.add(d)
              
              if (!weatherdata[d]) {
                weatherdata[d] = [];             
                 
            }

            weatherdata[d].push(element);
            if(!timeObj[d]){
              timeObj[d]=[];
            }
            timeObj[d].push(t);
            }
            
        });
        dateArray = [...dates];
        displayWeather(cur_index);
      }
  function displayWeather(index){
    let i=1;
    let date=dateArray[index];
    let data=weatherdata[date];
    l1=[];
    l3=[];
    data.forEach(element=>{
      if(element){
         let ele=element.main;
         l1.push(ele.temp);
         l3.push(i);
         i+=1;
      }
    });
      let canvas = document.getElementById("myChart");
    let ctx = canvas.getContext("2d");
    if (myChart !== null) {
        myChart.destroy();
    }

    const parent = canvas.parentElement;
    function resizeCanvas() {
      canvas.width = parent.clientWidth;  
      canvas.height = parent.clientHeight; 
  }
  
  resizeCanvas(); 
  window.addEventListener("resize", resizeCanvas);
 
        myChart=new Chart(ctx, {
            type:"line",
            data: {
              labels: l3,
              datasets: [{
                backgroundColor:"rgb(224, 239, 10,0.5)",
                borderColor: "rgba(196, 228, 17, 1)",
                data: l1,
                fill:true,
                pointBackgroundColor:"red",
                pointBorderColor:"Orange"
              }]
            },
            options: {
              responsive: true, 
              maintainAspectRatio: false,
              scales: {
                  x: {
                    display: false,
                      grid: {
                          
                          drawBorder: false, 
                          display: false   
                      }
                  },
                  y: {
                    display: false,
                      grid: {
                          drawBorder: false, 
                          display: false   
                      }
                }
              },
              plugins: {
                title: {
                  display: true,
                  text: 'Temperature Chart',
                  font: {
                      size: 10
                  }
              },
                legend: { display: false },
                tooltip: {
                enabled: true,
                callbacks: {
                    label: function (tooltipItem) {
                        return tooltipItem.raw + "°C"; // Show value on hover
                    }
                }
            }
               }
          },
          }); 
          cloud(index);  
}
  
function cloud(index){

    const date=dateArray[index];
    const data=weatherdata[date];
  let timeArray=[];  
  let images=[];
  let desc=[];
  data.forEach(element => {
    if (element) {
      let rain = element.weather[0]; 
      let temper=element.main;
      desc.push(temper.temp);
      timeArray.push((element.dt_txt).slice(11,13));
        let iconCode = rain.icon; 
        let iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`; 
        images.push(iconUrl);
    }
  });
  for(let j=0;j<timeArray.length;j++){
    if(timeArray[j]>"12")
      timeArray[j]= (timeArray[j]-"12")+" PM";
    else if(timeArray[j]=="12")
      timeArray[j]=timeArray[j]+" PM";
    else if(timeArray[j]=="00")
      timeArray[j]="12 AM";
    else
        timeArray[j]=timeArray[j]+" AM"
      
    }
  
  const container = document.querySelector('.cloud');
    container.innerHTML = ''; 
    let i=0;
    images.forEach(url => {
      const btn=document.createElement("div");
      btn.className="timeslot";
      // btn.onclick=()=>{updateWeather(date,time)};
      const p=document.createElement('p');  
      const p2=document.createElement('p');
      const img = document.createElement('img');
      let p2t=document.createTextNode(timeArray[i]);
      let t=document.createTextNode(desc[i]+"°C");
        btn.appendChild(p2); 
        img.src = url;
        img.alt = "Weather Icon";
        btn.appendChild(img);
        let p3t=document.createTextNode(date);
        btn.appendChild(p3t);
       
        
        i+=1;
        p2.appendChild(p2t);
        p.appendChild(t);
       
        btn.appendChild(p);
        container.appendChild(btn);
    });
      document.querySelectorAll(".cloud div").forEach((div,index)=>{
      div.addEventListener("click",()=>{
        img=div.querySelector("img");
        updateWeather(date,timeObj[date][index],img.src);

      });

  });

  updateWeather(date,timeObj[date][0],images[0]);
    // container.style.display="flex";
    // container.style.justifyContent="space-between";

}
function changedate(direction){
  if(direction=="next" && cur_index<dateArray.length-1){
   
    cur_index++;
  }
  else if(direction=="prev" && cur_index >0){
    cur_index--;
  }
  displayWeather(cur_index);
  
}
const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW", "N"];
function updateWeather(date,time,image){
   let dt_t=date+" "+time;
   lists.forEach((element)=>{
        if(element.dt_txt == dt_t){
          let ele=element.main;
          let dat=new Date(date);
          const options = { weekday: 'long' };
          document.getElementById("speed").textContent=(element.wind).speed+" m/s";
          document.getElementById("hum").textContent=ele.humidity+"%";
          document.getElementById("press").textContent=ele.pressure+" hPa";
          document.getElementById("head-img").src=image;
          document.getElementById("temp").textContent=ele.temp + "°C";
          document.getElementById("day").textContent=Intl.DateTimeFormat('en-us',options).format(dat);
          document.getElementById("date").textContent=date;
          document.getElementById("time").textContent=time=="00:00:00" ? "12:00:00":time;
          document.getElementById("des").textContent=(element.weather[0]).description;
          document.getElementById("faren").textContent=(((ele.temp)*9/5)+32).toFixed(2)+"°F";
          document.getElementById("ground").textContent=ele.grnd_level;
          document.getElementById("sea").textContent=ele.sea_level;
          document.getElementById("gust").textContent=(element.wind).gust +" m/s";
          document.getElementById("deg").textContent=(element.wind).deg+ "°" +directions[Math.round((element.wind).deg/45)];
        }
   })

       
}
