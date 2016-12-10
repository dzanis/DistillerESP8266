/*
 * 
 */
			document.write('<h1>Дистилятор v1</h1><hr>');
		 	document.write('<p>Время работы: %02d:%02d:%02d</p><hr>');
			document.write('<h1><span id="tempVar" style="color: #f00;" >0 С</span></h1>');
			document.write('<span id="rezim"></span><hr>');
			document.write(' <input type="button" onclick="onClick()" value="Start" id="myButton" ><hr>');
			document.write('<p>Мощность:<input type="range" min="0" max="100" step="1" value="0" id="powerSlider" ');
		  	document.write('oninput="powerChange()"> <span id="powerVar" >0 %</span> </p>');
		

        var temp;
        var timerId,timerB; 
        var timerTest; 
        var level = 0;
        var arr = ['','разгон','рабочий режим'];
        var button = document.getElementById('myButton');
        var audio = document.getElementById('audio');
        

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
            //timerB = setInterval(play, 500);
            timerB = setInterval(play , 500);
        }
        
        function update(){
           
            temp = request('getTemp');
            document.getElementById('tempVar').innerHTML = temp + ' C';
            if(level == 1 && temp > 70)   {   
                setLevel(2);
                beep();
            }
            
        }
        
        function request(action){
            var xmlhttp = new XMLHttpRequest()
            xmlhttp.open('GET', 'http://esp8266.local/' + action, true);
            xmlhttp.onreadystatechange = function() {
              if (xmlhttp.readyState == 4) {
                 if(xmlhttp.status == 200) {
                  return xmlhttp.responseText;
                     }
              }
            };
            xmlhttp.send();
             return "";                     
        }
        
        
        function powerChange() {
            power = document.getElementById("powerSlider").value;
            document.getElementById('powerVar').innerHTML = power + ' %';
            //document.forms['powerchange'].submit();
            
            request('setPower?powerVar='+ power);
            
           }
        
        function play() {
 			 (new Audio(
  				"data:audio/wav;base64,UklGRugDAABXQVZFZm10IBAAAAABAAEAIlYAACJWAAABAAgAZGF0YSgDAACAgICAAAAAAAAA//////////////////8AAAAAAAAAAAAAAAAAAP//////////////////AAAAAAAAAAAAAAAAAID/////////////////gAAAAAAAAAAAAAAAAAD//////////////////wAAAAAAAAAAAAAAAAAA//////////////////8AAAAAAAAAAAAAAAAAgP////////////////8AAAAAAAAAAAAAAAAAAP//////////////////AAAAAAAAAAAAAAAAAAD//////////////////wAAAAAAAAAAAAAAAACA/////////////////4AAAAAAAAAAAAAAAAAA//////////////////8AAAAAAAAAAAAAAAAAAP//////////////////AAAAAAAAAAAAAAAAAAD//////////////////wAAAAAAAAAAAAAAAAAA//////////////////8AAAAAAAAAAAAAAAAAAP//////////////////AAAAAAAAAAAAAAAAAAD//////////////////wAAAAAAAAAAAAAAAAAA//////////////////8AAAAAAAAAAAAAAAAAAP//////////////////AAAAAAAAAAAAAAAAAAD//////////////////wAAAAAAAAAAAAAAAAAA//////////////////8AAAAAAAAAAAAAAAAAAP//////////////////AAAAAAAAAAAAAAAAAAD//////////////////wAAAAAAAAAAAAAAAAAA//////////////////8AAAAAAAAAAAAAAAAAAID/////////////////gAAAAAAAAAAAAAAAAAAA//////////////////8AAAAAAAAAAAAAAAAAAP//////////////////AAAAAAAAAAAAAAAAAAD//////////////////4AAAAAAAAAAAAAAAAAAAP//////////////////AAAAAAAAAAAAAAAAAAD//////////////////wAAAAAAAAAAAAAAAAAAgP////////////////+AY3VlIBwAAAABAAAAAAAAAAAAAABkYXRhAAAAAAAAAAAAAAAATElTVBoAAABhZHRsbGFibA4AAAAAAAAATWFya2VyIDEAAGZhY3QEAAAARAYAAExJU1RCAAAASU5GT0lDUkQLAAAAMTk5OS0wMi0wOAAASUVORwkAAABEZWVwejBuZQAASVNGVBAAAABTb3VuZCBGb3JnZSA0LjUA"
			)).play();
}