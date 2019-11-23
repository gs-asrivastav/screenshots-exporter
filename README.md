# Screenshots API

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

## Sample Task Contract
```
{
    "type": // Task Type,
    "timeout": // Timeout in milliseconds (Optional),
    "arguments": [// Not applicable to all tasks.]
    ... Additional properties might be applicable per task.  
}
```

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
