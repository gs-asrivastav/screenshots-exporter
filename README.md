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
    model     : 158
    model name	    : Intel(R) Core(TM) i7-8750H CPU @ 2.20GHz
    stepping  : 10
    cpu MHz   : 2200.000
    cache size: 9216 KB
    physical id     : 0
    siblings  : 1
    core id   : 0
    cpu cores : 1
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

## Generic Task Runner
### Supported Tasks
| Task     | Task Key|
| ------------- |:-------------:|
| Mount external script file| ADD_SCRIPT_FILE |
| Set cookies     | SET_COOKIES|
| Wait for custom/DOM events | EVENT_WAIT|
| Call JS Functions | FUNCTION_CALL|
| Interact with DOM | DOM_INTERACTION|
| Take screenshot of element | ELEMENT_SCREENSHOT|
| Take screenshot of entire viewport | VIEWPORT_SCREENSHOT|
| Export viewport as PDF | VIEWPORT_PDF|
| Navigate to another URL | NAVIGATION|
| Static sleep for n milliseconds | SLEEP|

### Sample Contracts
- Mount external script: 
    ```
    {
          "type": "ADD_SCRIPT_FILE",
          "arguments": [
            "<path-to-js>",
            "<another-path-to-js>"
          ]
        }
    ```
- Set Cookies
    -  Supported properties are derived from SetCookie in Puppeteer: `@types/puppeteer/index.d.ts#SetCookie`
    ```
    {
      "type": "SET_COOKIES",
      "arguments": [
        {
          "name": "cookie-1",
          "value": "<cookie-value>",
          "domain": ".domain.com"
        }
      ]
    }
    ```

- Wait for Custom/DOM Events
    ```
    {
      "url": "<url>",
      "cookies": {},
      "tasks": [
        {
          "type": "EVENT_WAIT",
          "event": "container-ready"
        }
      ]
    }
    ```

- Call JavaScript Functions
    - Refers to a sample function call to `renderHighCharts` in `client/chart.html`
    ```
    {
      "url": "<url>",
      "cookies": {},
      "tasks": [
        {
          "type": "FUNCTION_CALL",
          "event": "container-ready",
          "function": "renderHighChart",
          "arguments": [
            {
              "chart": {
                "type": "bar"
              },
              "title": {
                "text": "Historic World Population by Region"
              },
              "subtitle": {
                "text": "Source: <a href=\"https://en.wikipedia.org/wiki/World_population\">Wikipedia.org</a>"
              },
              "xAxis": {
                "categories": [
                  "Africa",
                  "America",
                  "Asia",
                  "Europe",
                  "Oceania"
                ],
                "title": {
                  "text": null
                }
              },
              "yAxis": {
                "min": 0,
                "title": {
                  "text": "Population (millions)",
                  "align": "high"
                },
                "labels": {
                  "overflow": "justify"
                }
              },
              "tooltip": {
                "valueSuffix": " millions"
              },
              "plotOptions": {
                "bar": {
                  "dataLabels": {
                    "enabled": true
                  }
                }
              },
              "legend": {
                "layout": "vertical",
                "align": "right",
                "verticalAlign": "top",
                "x": -40,
                "y": 80,
                "floating": true,
                "borderWidth": 1,
                "backgroundColor": "#FFFFFF",
                "shadow": true
              },
              "credits": {
                "enabled": false
              },
              "series": []
            }
          ]
        }
      ]
    }
    ```

- Interact with DOM
    - Supported interactions: 
        - click
        - hover
        - select
        - type
        - tap
    ```
    {
      "url": "https://www.google.com",
      "tasks": [
        {
          "type": "DOM_INTERACTION",
          "interaction": "type",
          "selector": "//*[@id=\"tsf\"]/div[2]/div[1]/div[1]/div/div[2]/input",
          "useXPath": true,
          "timeout": 500,
          "arguments": [
            "Uber Stock"
          ]
        },
        {
          "type": "DOM_INTERACTION",
          "interaction": "click",
          "selector": "//*[@value=\"Google Search\"]",
          "useXPath": true,
          "arguments": []
        }
    }
    ```
  
-  Take screenshot of element (Base64)
    - Configurations
        - padding = If you want to add additional padding to your screenshot
    ```
    {
      "url": "https://www.google.com",
      "tasks": [{
          "type": "ELEMENT_SCREENSHOT",
          "selector": "//*[@id=\"rhs\"]/div[1]/div[1]/div[1]",
          "padding": 5,
          "args": [],
          "useXPath": true
        }
      ]
    }
    ```

- Take screenshot of entire viewport (Base64)
    ```
    {
      "url": "https://www.google.com",
      "tasks": [
        {
          "type": "VIEWPORT_SCREENSHOT",
          "padding": 5,
          "args": []
        }
      ]
    }
    ```
  
- Export viewport as PDF (Base64)
    ```
    {
      "url": "https://www.google.com",
      "tasks": [
        {
          "type": "VIEWPORT_PDF",
          "padding": 5,
          "args": []
        }
      ]
    }
    ```
  
- Navigate to another URL
    ```
    {
      "url": "about:blank",
      "tasks": [
        {
          "type": "NAVIGATION",
          "url": "https://github.com/"
        }
      ]
    }
    ```

- Static sleep for n milliseconds
    ```
    {
      "url": "about:blank",
      "tasks": [
        // Sleep for 5000 milliseconds
        {
          "type": "SLEEP",
          "sleep": 5000
        }
      ]
    }
    ```


## Examples
### Get a company's stock information along with 5Y variation
- Explanation
    - Open www.google.com
    - Task 1: Type `Uber Stock` in the Search Bar
    - Task 2: Enter `Google Search` button
    - Task 3: Take a screenshot of the stocks knowledge graph
    - Task 5: Click on `5 Years` variation
    - Task 6: Take a screenshot of the stocks knowledge graph
```
{
  "url": "https://www.google.com",
  "tasks": [
    {
      "type": "DOM_INTERACTION",
      "interaction": "type",
      "selector": "//*[@id=\"tsf\"]/div[2]/div[1]/div[1]/div/div[2]/input",
      "useXPath": true,
      "timeout": 500,
      "arguments": [
        "Uber Stock"
      ]
    },
    {
      "type": "DOM_INTERACTION",
      "interaction": "click",
      "selector": "//*[@value=\"Google Search\"]",
      "useXPath": true,
      "arguments": []
    },
    {
      "type": "ELEMENT_SCREENSHOT",
      "selector": "#knowledge-finance-wholepage__entity-summary",
      "padding": 5,
      "args": []
    },
    {
      "type": "DOM_INTERACTION",
      "interaction": "click",
      "selector": "//*[@data-period=\"5Y\"]",
      "useXPath": true,
      "arguments": []
    },{
      "type": "ELEMENT_SCREENSHOT",
      "selector": "#knowledge-finance-wholepage__entity-summary",
      "padding": 5,
      "args": []
    }
  ]
}
```

#### Get screenshot of comment in GitHub issues
- Explanation
    - Open https://github.com/nestjs/nest/issues/2111
    - Task 1: Type screenshot of the viewport with timeout of 10s
    - Task 2: Take a screenshot of `div.repository-content`
    - Task 3: Take a screenshot of a particular comment block `//*[@data-gid=\"MDEyOklzc3VlQ29tbWVudDQ5OTAwMDgyNw==\"]`
```
{
  "url": "https://github.com/nestjs/nest/issues/2111",
  "tasks": [
    {
      "type": "VIEWPORT_SCREENSHOT",
      "padding": 5,
      "args": [],
      "timeout": 10000
    },{
      "type": "ELEMENT_SCREENSHOT",
      "selector": ".repository-content",
      "padding": 5,
      "args": [],
      "timeout": 10000
    },{
      "type": "ELEMENT_SCREENSHOT",
      "selector": "//*[@data-gid=\"MDEyOklzc3VlQ29tbWVudDQ5OTAwMDgyNw==\"]",
      "padding": 5,
      "args": [],
      "timeout": 10000,
      "useXPath": true
    }
  ]
}
```


## Response Structure
```
{
    "results": [{
        "task-index": // Task Index,
        "duration": // Duration the task took to run,
        // Messages from the browser's console per task
        "console-messages": [{
           "type": // Messsage Type (warning, info, log etc.)
           "text": // Message's text,
           "location": {
               "url": // File from which the error message was propogated
           }
         }],
        // Log messages from the code per task
        "task-logs": [{
              timestamp: // Epoch timestamp of the message,
              level: // Log message level. (INFO, WARN, DEBUG, TRACE, ERROR),
              message: // Log Message
          }],
        "status": "SUCCEEDED" / "FAILED"
    }]
}
```
