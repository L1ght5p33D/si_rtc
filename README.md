
## SI RTC Web Peer Client 

### Dependencies 

#### assuming you have pipenv

#### create python3 virtual env
python3 -m venv envpy_si_rtc

#### you can avoid installing global dependencies without activating venv by adding full python3 path to your venv bin~ 
 /path/to/venv/bin/python3 -m pip [freeze | install | etc]

#### upgrade v env pip
 ./python3 -m pip install -U pip

#### install django 2.2.1, latest not working
  ./python3 -m pip install Django==2.2.1 
		

#### install channels 2.2.0
  ./python3 -m pip install channels==2.2.0
	
		
#### from manage.py directory.. run
../envpy_si_rtc/bin/python ./manage.py runserver 3008

#### Server should be running on  127.0.0.1:3008
####  open 127.0.0.1:3008/si_rtc_local and 127.0.0.1:3008/si_rtc_remote in chrome/firefox to run rtc client connection


