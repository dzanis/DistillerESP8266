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
document.write('<body onload="init()">\n');


	var url;
	var temp;
	var timerId,timerB; 
	var timerTest; 
	var timerWorking;
	var level = 0;
	var power = 0;
	var dateStart = new Date();
	var arr = ['Выключено','Разгон','Рабочий режим'];
	var buttonStart = document.getElementById('buttonStart');
	var buttonStop = document.getElementById('buttonStop');
	//var audio = document.getElementById('audio');
        
        function init() {
   	
        		
        	   url = location.toString();
            if(url.indexOf('file') != -1 || url.indexOf('localhost') != -1)// для локального теста с компа
            	url = 'http://esp8266.local/';


            	           	
            	// загружаю данные с сервера если они были сохранены
            	getSettings()

            timerId = setInterval(updateTemperature, 2000);
            
            
        }
        
        
        function getSettings() {
        	
        	var xmlhttp =  get('getSettings'); 
            	 xmlhttp.onreadystatechange = function() {
              if (xmlhttp.readyState == 4) {
                 if(xmlhttp.status == 200) {
                  text = xmlhttp.responseText;
            		
						var dateString = getVarsFromText(text)["dateVar"];
						dateStart = new Date(dateString);
						document.getElementById('timeStart').innerHTML = toTimeString(dateStart);
						
						power = getVarsFromText(text)["powerVar"];
						document.getElementById('powerSlider').value = power;  
            		document.getElementById('powerVar').innerHTML = power;
            		
            		level = getVarsFromText(text)["stateVar"];
						if(level >= 1)  // если был рабчий режим        		
            			onStart();  // //  продолжаем
            		
                     }
              }
              
            };
        	
        }
        
        function saveSettings() {
        		
        		var params = 'saveSettings?' +
        		'stateVar=' + level +
        		'&dateVar=' + dateStart.toUTCString() +
        		'&powerVar='+ power;
        		
        		
        		var xmlhttp =  post(params);            
            xmlhttp.onreadystatechange = function() {
              if (xmlhttp.readyState == 4) {
                 if(xmlhttp.status == 200) {
                  document.getElementById('powerVar').innerHTML = power + ' %';
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
        		document.getElementById('timeStart').innerHTML = toTimeString(dateStart);
        		saveSettings();
        		}
        		
        		timerWorking = setInterval(function(){
                    var t = getTimeRemaining(dateStart);
        		document.getElementById('timeWorking').innerHTML =
                    ('0' + t.hours).slice(-2) + ':' +
                    ('0' + t.minutes).slice(-2) + ':' +
                    ('0' + t.seconds).slice(-2);
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
            saveSettings(); 
            document.getElementById('stateVar').innerHTML = arr[level];
           
        }
        
         function powerChange() {
            power = document.getElementById("powerSlider").value;          
             saveSettings();            
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
        

        
        
        function get(params){
        	
        var xmlhttp	 = getXmlHttp();
        xmlhttp.open('GET', url + params, true);
        xmlhttp.onerror = function() {
        	//alert('error connection');
        };
        xmlhttp.send(null);

         return xmlhttp;                   
        }


    function getFromServer(params,object){// ответ передаётся в object

        var xmlhttp	 = getXmlHttp();
        xmlhttp.open('GET', url + params, true);
        xmlhttp.send(null);

        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4) {
                if(xmlhttp.status == 200) {
                    window[object] = xmlhttp.responseText;


                }
            }
        };

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
        
        
  
        
        
       
        
        function play() {
 			 (new Audio(
  				"data:audio/mpeg;base64,SUQzAwAAAAACI1RBTEIAAAABAAAAVENPTgAAAAEAAABUSVQyAAAAAQAAAFRQRTEAAAABAAAAVFJDSwAAAAEAAABUWUVSAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/7kMQAAAAAAAAAAAAAAAAAAAAAAFhpbmcAAAAPAAAAAwAABtMAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyM3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc////////////////////////////////////////////AAAAHkxBTUUzLjk5cgScAAAAAC6qAAA1ICQE8CEAAa4AAAbT21UmIwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/7wMQAAAYAA320AAAjI6YwPzOgSeyiACgIAADwwEAQnwQBAEAGD4Pn8Tg+H5QEHfKBj+CYPn/ygY/8EAxB8/4nP/+oEMyhAGq4+WNOvc7ipHQaCAC0RpvAIA0mS3wgDpUNkMjiLRBA6SFLAWUBjohBL0LuRWM4pDMJa0tcuZOUxQiA4kMnYy1s0KAKlCUqg2ZYGKMDIgDCAQ4CIa4wYMQ9MKmlTWigDEbs61IOV01ijWyDCjnv5LZdaXkxjWOpl2lI9p93WYrr+tXxmajmdltDOLbY0pXJIxYn3xU+VhaWvhZuuVH+U0x+PMZE5+fMO2bVV33O7WxuwTKIR+Hf/L9R21Ce//N6/kll8JqOiN2wAGVriQIIqAk09ZXi2ADTCFMqWYzENDC0zMhBUxagB0xB4wMLl032bzHBENWLYDP0WDRlcEIkmYBGXSLdOT9O+7PLjHSj98GoRm7HgX3NzDDiBxVZXxeUyVc//N7J2vvUwTNvBKZbDyPhZCNcD26wt9R1SMfDajzZ3YdHVkewq//5YQytD+cnZUMLpNbZKpMiSrWFDH0bkkKf09KeBj2Ia+AOrDkmgxFgQWgCFKWUzUGtfHswHRb6uq0r/9bQJekHP/4RLn4AwScDMkVpCJpxK02HGijdHj/yVqf5wwZ6NGAg2f/8AJIckDtmVIIKKd2LGcNqB9+4AAthmsMCxGuVpzcZjwAHiJIBDAbyaohuQz74uSAikykvXepV7WXMn52jpGIHNT0fJYpvFRihrtZkMdcZvGgY55q8fl/s9tgfrun3GPIbO9Q6cKBqbHnPeOMfauw8glV5B2t8gKl1vHtdx5X+WHYwzSMU93uO5Vfub1/yac/X5/Ukkrj8t7l+X1pVa/HLny6x////9qOutB2XP5nrurscs36WrjVG1aBwOBAKBQIAgAAAAAAAMJEcDJwF8DXNEA0rCPA1CHwMpAfwBBIgzwMAnAIGg4J+//uQxOaAHtE/W/nNgAKap3E/M4BJBhRwAowLlhwv88MkAgSAgKHM/8tkCJkMJB6Q0//yqTKBDTFAvf/5NJnMxMUE///0lkcTRuhF1UxBTUUzLjk5LjVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//tAxN2ADKkJVblaEAAAADSDgAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUQUcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/w=="
			)).play();						
	
			}
			
			function getVarsFromText(text) {
			    var vars = {};
			   var parts = text.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
			        vars[key] = value;
			    });
			    return vars;
			}
			
			function getUrlVars() {//http://ruseller.com/lessons.php?rub=29&id=1030
			    var vars = {};
			    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
			        vars[key] = value;
			    });
			    return vars;
			}
	
	function toTimeString(date){ // возврашяет время из даты в виде такой строки '15:40:50'

		return  ('0' + date.getHours()).slice(-2) + ':' +
                ('0' + date.getMinutes()).slice(-2) + ':' +
                ('0' + date.getSeconds()).slice(-2);
	}
	



    function getTimeRemaining(endtime){// https://myrusakov.ru/js-countdown-timer.html
        //var t = Date.parse(endtime) - Date.parse(new Date());
        var t = Date.parse(new Date()) - Date.parse(endtime);
        var seconds = Math.floor( (t/1000) % 60 );
        var minutes = Math.floor( (t/1000/60) % 60 );
        var hours = Math.floor( (t/(1000*60*60)) % 24 );
        var days = Math.floor( t/(1000*60*60*24) );
        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }