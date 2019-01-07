# Office echo
This is a web application of information display system for buisiness.

## Getting started
### Installation
First, fetch all npm modules.
``` sh
$ npm install
```
### Applying settings
First, Make file of application settings.  
Please see the config details section below if you want to use some features.
``` sh
$ cp ./config/_default.json ./config/default.json
```
Second, [Getting client_secrets.json](https://cloud.google.com/genomics/downloading-credentials-for-api-access) from Google Developer Console, move to *./storage/auth/* and rename it to credentials.json.  
Then you should run init.js and enter the code that is displayed after logging in to Google.
``` sh
$ move client_secrets.json ./storage/auth/credentials.json
$ node init.js
Authorize this app by visiting this url: https://accounts.google.com/o/oauth2/v2/auth........
Enter the code from that page here:
```
## Running
Running the command below, you can access on [http://localhost:8000](http://localhost:8000).
``` sh
$ node ./bin/www
```

## Config details
### Add Resources
You should add the resource information on *config/default.json*.

| Key | Description |
|-----|-------------|
| id | Resource identifier. If you want to access the primary calendar of the currently logged in user, use the "primary" keyword. |
| summary | Display name of the resource |
| priority | Display order in the resource list on client |

``` javascript
"room": {
    "resources": [
        {
            "id": "resource1@hogehoge.com",
            "summary": "リソース1",
            "priority": 0
        },
        {
            "id": "resource2@hogehoge.com",
            "summary": "リソース2",
            "priority": 1
        }
    ]
}
```
### Get weather forecast
You should enter the [DarkSky API Key](https://darksky.net/dev/docs) on *config/default.json*.  
Change the values of latitude and longitude If you want to change the location from the default location (Tokyo) to another one.

| Key | Description |
|-----|-------------|
| apiKey | Your own API Key of [DarkSky](https://darksky.net/dev/docs) |
| latitude | the latitude of location you want to get forecast |
| longitude | the longitude of location you want to get forecast |

``` javascript
"weather": {
    "darkskyApi": {
        "apiKey": "",
        "latitude": 35.4122,
        "longitude": 139.4130
    }
}
```
### Display the Delays of the trains
You should add the line name into list on *config/default.json*.

| Key | Description |
|-----|-------------|
| allowList | Lists of allowing to display |
| allowList.*(key)*: *(value)* | *(key)* is the line name*, *(value)* is the file name of the line symbol svg |

\* The line name should be same name as [ the line name in the table API having](https://rti-giken.jp/fhc/api/train_tetsudo/).  
Put the SVG of the line symbol to *public/svg/line-symbol* if you want to add new other lines.
``` javascript
"trainDelays": {
    "autoUpdate": true,
    "updateIntervalSeconds": 10800,
    "allowList": {
        "山手線": "JR_JY",
        "日比谷線": "H",
    }
}
```