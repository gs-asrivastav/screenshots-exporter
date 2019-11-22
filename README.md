# Highcharts Export

## Stats
### Environment
```
ProductName:	Mac OS X
ProductVersion:	10.15.1
BuildVersion:	19B88


Hardware:
    Hardware Overview:
      Model Name: MacBook Pro
      Model Identifier: MacBookPro15,1
      Processor Name: 6-Core Intel Core i7
      Processor Speed: 2.2 GHz
      Number of Processors: 1
      Total Number of Cores: 6
      L2 Cache (per Core): 256 KB
      L3 Cache: 9 MB
      Hyper-Threading Technology: Enabled
      Memory: 16 GB

Docker Container Stats:
    processors	    : 6
    vendor_id	    : GenuineIntel
    cpu family	    : 6
    model           : 158
    model name	    : Intel(R) Core(TM) i7-8750H CPU @ 2.20GHz
    stepping        : 10
    cpu MHz         : 2200.000
    cache size      : 9216 KB
    physical id     : 0
    siblings        : 1
    core id         : 0
    cpu cores       : 1
```

- 5 Concurrent Requests:
```
Top 3 Timings (millis): [1200, 1194, 1192]
Successful Requests: 5
Failed Requests: 0
```

- 10 Concurrent Requests:
```
Top 3 Timings (millis): [2436, 2436, 2435]
Successful Requests: 10
Failed Requests: 0
```

- 25 Concurrent Requests:
```
Top 3 Timings (millis): [5927, 5927, 5924]
Successful Requests: 25
Failed Requests: 0
```

- 50 Concurrent Requests:
```
Top 3 Timings (millis): [12303, 12303, 12302]
Successful Requests: 50
Failed Requests: 0
```

- 100 Concurrent Requests:
```
Top 3 Timings (millis): [26757, 26756, 26756]
Successful Requests: 100
Failed Requests: 0
```


## Sample Requests
- First Run `docker-compose up`
- Try the following curl request
```
curl --request POST \
  --url http://localhost:5000/highcharts/screenshot \
  --header 'Accept: */*' \
  --header 'Accept-Encoding: gzip, deflate' \
  --header 'Cache-Control: no-cache' \
  --header 'Connection: keep-alive' \
  --header 'Content-Length: 870' \
  --header 'Content-Type: application/json' \
  --header 'Host: localhost:5000' \
  --header 'Postman-Token: 461fbbc0-08b7-4d5b-a236-563dc46ffec9,0d73c3f9-8697-47e3-9b0a-92164ec42219' \
  --header 'User-Agent: PostmanRuntime/7.20.1' \
  --header 'cache-control: no-cache' \
  --data '{"chart":{"type":"bar"},"title":{"text":"Historic World Population by Region"},"subtitle":{"text":"Source: <a href=\"https://en.wikipedia.org/wiki/World_population\">Wikipedia.org</a>"},"xAxis":{"categories":["Africa","America","Asia","Europe","Oceania"],"title":{"text":null}},"yAxis":{"min":0,"title":{"text":"Population (millions)","align":"high"},"labels":{"overflow":"justify"}},"tooltip":{"valueSuffix":" millions"},"plotOptions":{"bar":{"dataLabels":{"enabled":true}}},"legend":{"layout":"vertical","align":"right","verticalAlign":"top","x":-40,"y":80,"floating":true,"borderWidth":1,"backgroundColor":"#FFFFFF","shadow":true},"credits":{"enabled":false},"series":[{"name":"Year 1800","data":[107,31,635,203,2]},{"name":"Year 1900","data":[133,156,947,408,6]},{"name":"Year 2000","data":[814,841,3714,727,31]},{"name":"Year 2016","data":[1216,1001,4436,738,40]}]}'
```
