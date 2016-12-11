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
document.write('<p>Мощность:<input type="range" min="0" max="100" step="1" value="0" id="powerSlider" ');
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
	var arr = ['','разгон','рабочий режим'];
	var buttonStart = document.getElementById('buttonStart');
	var buttonStop = document.getElementById('buttonStop');
	//var audio = document.getElementById('audio');
        
        function init() {
        	
        	   url = location.toString();
            if(url.indexOf('file') != -1)// для локального теста с компа
            	url = 'http://esp8266.local/';
            	timerId = setInterval(update, 2000);
            	
            	// загружаю данные с сервера если они были сохранены
            	request('getDateStart','timeStart');
            	var date = document.getElementById('timeStart').innerHTML;
            	if(date.length > 1){
            	dateStart = new Date(document.getElementById('timeStart').innerHTML);
            	document.getElementById('timeStart').innerHTML = dateStart.getHours()+':'+dateStart.getMinutes()+':'+dateStart.getSeconds();
            	request('getPower','powerVar'); 
            	request('getState','stateVar');
            	setLevel(document.getElementById('state').innerHTML)
            	
            	if(level > 1)
            		{
            			document.getElementById("buttonStart").disabled = true;
							document.getElementById("buttonStop").disabled = false;
            		}
            	
            	}


            	
        }

        function onStart() {
            play();
            document.getElementById("buttonStart").disabled = true;
				document.getElementById("buttonStop").disabled = false;

            setLevel(1);
            dateStart = new Date();
        		document.getElementById('timeStart').innerHTML = dateStart.getHours()+':'+dateStart.getMinutes()+':'+dateStart.getSeconds();
        		request('setDateStart?dateVar='+dateStart.toString(),'send');
        		timerWorking = setInterval(function(){
        		document.getElementById('timeWorking').innerHTML = diff_date(new Date(dateStart.toString()));
        		}, 1000);
            //timerTest = setTimeout(beepStart, 1000 * 10);// через 10s запишять
            
        }
        
        function onStop() {
       	
				document.getElementById("buttonStart").disabled = false;
				document.getElementById("buttonStop").disabled = true;
         
            clearInterval(timerWorking);        
            setLevel(0);
            timeStart = new Date();

            
        }
        
        function setLevel(l){
            level = l;
            request('setState?stateVar='+level,'state');
            document.getElementById('stateVar').innerHTML = 'Сейчас идёт ' + arr[level];
           
        }

        function beepStart(){
            button.value='Выключить сигнал';
            button.style.visibility = 'visible';
            timerB = setInterval(play , 500);
            clearInterval(timerB);
        }
        
        function update(){
           
           var temp = 0;
            request('getTemp','tempVar');
            temp = document.getElementById('tempVar');
            if(level == 1 && temp > 70)   {   
                setLevel(2);
                beepStart();
            }
            
        }
        
        function request(action,Id){
            var xmlhttp = new XMLHttpRequest();
            
            xmlhttp.open('GET', url + action, true);
            xmlhttp.send();
            xmlhttp.onreadystatechange = function() {
              if (xmlhttp.readyState == 4) {
                 if(xmlhttp.status == 200) {
                  document.getElementById(Id).innerHTML = xmlhttp.responseText;
                     }
              }
            };

                   
        }
        
        
        function powerChange() {
            power = document.getElementById("powerSlider").value;          
            request('setPower?powerVar='+ power,'send');           
            document.getElementById('powerVar').innerHTML = power + ' %';
            
           }
        
        function play() {
 			 (new Audio(
  				"data:audio/mpeg;base64,SUQzAwAAAAACI1RBTEIAAAABAAAAVENPTgAAAAEAAABUSVQyAAAAAQAAAFRQRTEAAAABAAAAVFJDSwAAAAEAAABUWUVSAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/7kMQAAAAAAAAAAAAAAAAAAAAAAFhpbmcAAAAPAAAAAwAABtMAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyM3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc////////////////////////////////////////////AAAAHkxBTUUzLjk5cgScAAAAAC6qAAA1ICQE8CEAAa4AAAbT21UmIwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/7wMQAAAYAA320AAAjI6YwPzOgSeyiACgIAADwwEAQnwQBAEAGD4Pn8Tg+H5QEHfKBj+CYPn/ygY/8EAxB8/4nP/+oEMyhAGq4+WNOvc7ipHQaCAC0RpvAIA0mS3wgDpUNkMjiLRBA6SFLAWUBjohBL0LuRWM4pDMJa0tcuZOUxQiA4kMnYy1s0KAKlCUqg2ZYGKMDIgDCAQ4CIa4wYMQ9MKmlTWigDEbs61IOV01ijWyDCjnv5LZdaXkxjWOpl2lI9p93WYrr+tXxmajmdltDOLbY0pXJIxYn3xU+VhaWvhZuuVH+U0x+PMZE5+fMO2bVV33O7WxuwTKIR+Hf/L9R21Ce//N6/kll8JqOiN2wAGVriQIIqAk09ZXi2ADTCFMqWYzENDC0zMhBUxagB0xB4wMLl032bzHBENWLYDP0WDRlcEIkmYBGXSLdOT9O+7PLjHSj98GoRm7HgX3NzDDiBxVZXxeUyVc//N7J2vvUwTNvBKZbDyPhZCNcD26wt9R1SMfDajzZ3YdHVkewq//5YQytD+cnZUMLpNbZKpMiSrWFDH0bkkKf09KeBj2Ia+AOrDkmgxFgQWgCFKWUzUGtfHswHRb6uq0r/9bQJekHP/4RLn4AwScDMkVpCJpxK02HGijdHj/yVqf5wwZ6NGAg2f/8AJIckDtmVIIKKd2LGcNqB9+4AAthmsMCxGuVpzcZjwAHiJIBDAbyaohuQz74uSAikykvXepV7WXMn52jpGIHNT0fJYpvFRihrtZkMdcZvGgY55q8fl/s9tgfrun3GPIbO9Q6cKBqbHnPeOMfauw8glV5B2t8gKl1vHtdx5X+WHYwzSMU93uO5Vfub1/yac/X5/Ukkrj8t7l+X1pVa/HLny6x////9qOutB2XP5nrurscs36WrjVG1aBwOBAKBQIAgAAAAAAAMJEcDJwF8DXNEA0rCPA1CHwMpAfwBBIgzwMAnAIGg4J+//uQxOaAHtE/W/nNgAKap3E/M4BJBhRwAowLlhwv88MkAgSAgKHM/8tkCJkMJB6Q0//yqTKBDTFAvf/5NJnMxMUE///0lkcTRuhF1UxBTUUzLjk5LjVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//tAxN2ADKkJVblaEAAAADSDgAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUQUcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/w=="
			)).play();					
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
			