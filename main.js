/*
 * 
 */
			
document.write('<h1>Дистилятор v1</h1><hr>');
document.write('Время старта: <span id="timeStart" >0</span>');
document.write(' Время работы: <span id="timeWorking">0</span><hr>');
document.write('<h1>Температура: <span id="tempVar" >0</span> C</h1>');
document.write('<span id="stateVar"></span><hr>');
document.write(' <input type="button" onclick="onStart()" value="Start" id="buttonStart" >');
document.write(' <input type="button" onclick="onStop()" value="Stop" id="buttonStop" ><hr>');
document.write('<p>Мощность:<input type="range" min="0" max="100" step="5" value="0" id="powerSlider" ');
document.write('oninput="powerChange()"> <span id="powerVar" >0 %</span> </p>');
document.write('<hr>Связь <span id="send"></span><hr>');
document.write('<body onload="init()">');

	var url;
	var temp;
	var timerId,timerB; 
	var timerTest; 
	var timerWorking;
	var level = 0;
	var dateStart;
	var arr = ['Тен не включен','Разгон','Рабочий режим'];
	var buttonStart = document.getElementById('buttonStart');
	var buttonStop = document.getElementById('buttonStop');
	//var audio = document.getElementById('audio');
        
        function init() {
        	
        	   url = location.toString();
            if(url.indexOf('file') != -1)// для локального теста с компа
            	url = 'http://esp8266.local/';
            	timerId = setInterval(updateTemperature, 2000);
            	           	
            	// загружаю данные с сервера если они были сохранены
            	getPower();
            	getState();
            	
            	
     	
        }
        
        
        function getState() {
        	
        	 var xmlhttp =  get('getState'); 
            	 xmlhttp.onreadystatechange = function() {
              if (xmlhttp.readyState == 4) {
                 if(xmlhttp.status == 200) {
                  level = xmlhttp.responseText;
            	if(level >= 1)  // если был рабчий режим        		
            			getDateStart();  // загружаю время старта          			

            		
                     }
              }
            };
        }
        
        
        function getDateStart() {
        	
        	 var xmlhttp =  get('getDateStart');            
            xmlhttp.onreadystatechange = function() {
              if (xmlhttp.readyState == 4) {
                 if(xmlhttp.status == 200) {
                  var dateString = xmlhttp.responseText;
                  dateStart = date_from_string(dateString);
            	document.getElementById('timeStart').innerHTML = dateString;      			
            			onStart();//  продолжаем
                     }
              }
            };
        }
        
        function getPower() {
        	
        	  var xmlhttp =  get('getPower'); 
            	 xmlhttp.onreadystatechange = function() {
              if (xmlhttp.readyState == 4) {
                 if(xmlhttp.status == 200) {
                  power = xmlhttp.responseText;
                document.getElementById('powerSlider').value = power;  
            	document.getElementById('powerVar').innerHTML = power;
						        			           		
                     }
              }
            };
        }
        
         
        
        
        function onStart() {
       
            play();
            document.getElementById("buttonStart").disabled = true;
				document.getElementById("buttonStop").disabled = false;

            if(level == 0){
            dateStart = new Date();
        		document.getElementById('timeStart').innerHTML = date_to_string(dateStart);
        		post('setDateStart?dateVar='+ date_to_string(dateStart));
        		}
        		
        		timerWorking = setInterval(function(){
        		document.getElementById('timeWorking').innerHTML = diff_date(date_to_string(dateStart));
        		}, 1000);
            //timerTest = setTimeout(beepStart, 1000 * 10);// через 10s запишять
            setLevel(1);
        }
        
        function onStop() {
       	  
       	   clearInterval(timerWorking);  
				document.getElementById("buttonStart").disabled = false;
				document.getElementById("buttonStop").disabled = true;				
				document.getElementById('timeStart').innerHTML = '0';
         	document.getElementById('timeWorking').innerHTML = '0';

				setLevel(0);	
    
            
        }
        
        function setLevel(l){
            level = l;
            post('setState?stateVar='+level);  
            document.getElementById('stateVar').innerHTML = arr[level];
           
        }

        function beepStart(){
            button.value='Выключить сигнал';
            button.style.visibility = 'visible';
            timerB = setInterval(play , 500);
            clearInterval(timerB);
        }
        
        function updateTemperature(){
           
           var temp = 0;
     
            var xmlhttp =  get('getTemp');            
            xmlhttp.onreadystatechange = function() {
              if (xmlhttp.readyState == 4) {
                 if(xmlhttp.status == 200) {
                  temp = xmlhttp.responseText;
                  document.getElementById('tempVar').innerHTML = temp;
                     }
              }
            };

            if(level == 1 && temp > 70)   {   
                setLevel(2);
                beepStart();
            }
            
        }
        
        function request(action,Id){
             
                               
        }
        
        
        function get(params){
        	
        var xmlhttp	 = getXmlHttp();
        xmlhttp.open('GET', url + params, true);
        xmlhttp.send(null);

         return xmlhttp;                   
        }
        
        function post(params){
        	
        var xmlhttp	 = getXmlHttp();
        xmlhttp.open('POST', url + params , true);
        xmlhttp.send(null);
         return xmlhttp; 
                           
        }
        
        
        function getXmlHttp(){//Кроссбраузерная функция создания XMLHttpRequest
		  var xmlhttp;
		  try {
		    xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
		  } catch (e) {
		    try {
		      xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		    } catch (E) {
		      xmlhttp = false;
		    }
		  }
		  if (!xmlhttp && typeof XMLHttpRequest!='undefined') {
		    xmlhttp = new XMLHttpRequest();
		  }
		  
	  
		  return xmlhttp;
		}
        
        
  
        
        
        function powerChange() {
            power = document.getElementById("powerSlider").value;          
  
            var xmlhttp =  post('setPower?powerVar='+ power);            
            xmlhttp.onreadystatechange = function() {
              if (xmlhttp.readyState == 4) {
                 if(xmlhttp.status == 200) {
                  document.getElementById('powerVar').innerHTML = power + ' %';
                     }
              }
            };
            
           }
        
        function play() {
 			 (new Audio(
  				"data:audio/mpeg;base64,SUQzAwAAAAACI1RBTEIAAAABAAAAVENPTgAAAAEAAABUSVQyAAAAAQAAAFRQRTEAAAABAAAAVFJDSwAAAAEAAABUWUVSAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/7kMQAAAAAAAAAAAAAAAAAAAAAAFhpbmcAAAAPAAAAAwAABtMAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyM3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc////////////////////////////////////////////AAAAHkxBTUUzLjk5cgScAAAAAC6qAAA1ICQE8CEAAa4AAAbT21UmIwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/7wMQAAAYAA320AAAjI6YwPzOgSeyiACgIAADwwEAQnwQBAEAGD4Pn8Tg+H5QEHfKBj+CYPn/ygY/8EAxB8/4nP/+oEMyhAGq4+WNOvc7ipHQaCAC0RpvAIA0mS3wgDpUNkMjiLRBA6SFLAWUBjohBL0LuRWM4pDMJa0tcuZOUxQiA4kMnYy1s0KAKlCUqg2ZYGKMDIgDCAQ4CIa4wYMQ9MKmlTWigDEbs61IOV01ijWyDCjnv5LZdaXkxjWOpl2lI9p93WYrr+tXxmajmdltDOLbY0pXJIxYn3xU+VhaWvhZuuVH+U0x+PMZE5+fMO2bVV33O7WxuwTKIR+Hf/L9R21Ce//N6/kll8JqOiN2wAGVriQIIqAk09ZXi2ADTCFMqWYzENDC0zMhBUxagB0xB4wMLl032bzHBENWLYDP0WDRlcEIkmYBGXSLdOT9O+7PLjHSj98GoRm7HgX3NzDDiBxVZXxeUyVc//N7J2vvUwTNvBKZbDyPhZCNcD26wt9R1SMfDajzZ3YdHVkewq//5YQytD+cnZUMLpNbZKpMiSrWFDH0bkkKf09KeBj2Ia+AOrDkmgxFgQWgCFKWUzUGtfHswHRb6uq0r/9bQJekHP/4RLn4AwScDMkVpCJpxK02HGijdHj/yVqf5wwZ6NGAg2f/8AJIckDtmVIIKKd2LGcNqB9+4AAthmsMCxGuVpzcZjwAHiJIBDAbyaohuQz74uSAikykvXepV7WXMn52jpGIHNT0fJYpvFRihrtZkMdcZvGgY55q8fl/s9tgfrun3GPIbO9Q6cKBqbHnPeOMfauw8glV5B2t8gKl1vHtdx5X+WHYwzSMU93uO5Vfub1/yac/X5/Ukkrj8t7l+X1pVa/HLny6x////9qOutB2XP5nrurscs36WrjVG1aBwOBAKBQIAgAAAAAAAMJEcDJwF8DXNEA0rCPA1CHwMpAfwBBIgzwMAnAIGg4J+//uQxOaAHtE/W/nNgAKap3E/M4BJBhRwAowLlhwv88MkAgSAgKHM/8tkCJkMJB6Q0//yqTKBDTFAvf/5NJnMxMUE///0lkcTRuhF1UxBTUUzLjk5LjVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//tAxN2ADKkJVblaEAAAADSDgAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUQUcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/w=="
			)).play();						
	
			}
	
	function date_to_string(date){ // возврашяет дату в виде такой строки '2011-11-30 15:40:50'
		return date.getFullYear() +'-' + date.getMonth() + '-' + date.getDate() +' ' + date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();	
	}
	
	// http://www.py-my.ru/post/4ed5a7931d41c80309000000		
	function date_from_string(dt){
	// 2011-11-30 15:40:50
	var df = dt.split(' ');
	var d = df[0].split('-');
	var t = df[1].split(':');
	return d1 = new Date(d[0],d[1]-1,d[2],t[0],t[1],t[2]);
}

	
			
	function diff_date(d1){
	var r = (new Date() - d1)/1000;

	var tt = {
			sec: ['{} секунд','{} секунда','{} секунды'],
			min: ['{} минут','{} минута','{} минуты'],
			hour: ['{} часов','{} час','{} часа'],
			day: ['{} дней','{} день','{} дня']
	}
	function sec(x,dtt){
		var r;
		x = x.toFixed(0);
		if(x>=11 && x<=14) r = null
		else {
			var s = '' + x;
			if(s.length>1) s = s.substring(1);
			r = { '1':dtt[1], '2':dtt[2], '3':dtt[2], '4':dtt[2] }[s];
		}
		if(!r) r = dtt[0];
		return r.replace('{}',x)
	}

	if(r<60) return sec(r, tt.sec) + ' назад';
	r = r / 60;
	if(r<60) return sec(r, tt.min) + ' назад';
	r = r / 60;
	if(r<24) return sec(r, tt.hour) + ' назад';
	r = r / 24;
	if(r<1) return 'сегодня';
	if(r<2) return 'вчера';
	return sec(r, tt.day) + ' назад';
}
			