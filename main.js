/*
 * 
 */
			
document.write('<h1>Дистилятор v1</h1><hr>');
document.write('<p>Время работы: %02d:%02d:%02d</p><hr>');
document.write('<h1>Температура: <span id="tempVar" >0</span> C</h1>');
document.write('<span id="rezim"></span><hr>');
document.write(' <input type="button" onclick="onClick()" value="Start" id="myButton" ><hr>');
document.write('<p>Мощность:<input type="range" min="0" max="100" step="1" value="0" id="powerSlider" ');
document.write('oninput="powerChange()"> <span id="powerVar" >0 %</span> </p>');
document.write('<hr>Связь <span id="send"></span><hr>');
document.write('<body onload="init()">');

	var url;
	var temp;
	var timerId,timerB; 
	var timerTest; 
	var level = 0;
	var arr = ['','разгон','рабочий режим'];
	var button = document.getElementById('myButton');
	var audio = document.getElementById('audio');
        
        function init() {
        	
        	   url = location.toString();
            if(url.indexOf('file') != -1)// для локального теста с компа
            	url = 'http://esp8266.local/';
        }

        function onClick() {
            play();
            button.style.visibility = 'hidden';
            clearInterval(timerB);
           timerId = setInterval(update, 2000);
            if(level == 0) setLevel(1);
            //timerTest = setTimeout(beep, 1000 * 10);// через 10s запишять
            
        }
        
        function setLevel(l){
            level = l;
            document.getElementById('rezim').innerHTML = 'Сейчас идёт ' + arr[level];
           
        }

        function beep(){
            button.value='Выключить сигнал';
            button.style.visibility = 'visible';
            timerB = setInterval(play , 500);
        }
        
        function update(){
           
           var temp = 0;
            request('getTemp','tempVar');
            temp = document.getElementById('tempVar');
            if(level == 1 && temp > 70)   {   
                setLevel(2);
                beep();
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