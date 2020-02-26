This app shows an installation and meeting launch of the [Zoom Web SDK](https://marketplace.zoom.us/docs/sdk/native-sdks/web).

React app was initialized using creat-react-app:
```
npx create-react-app .
```

Zoom WebSDK was installed locally: 
```
npm i @zoomus/websdk
```

Stylesheets were added to `public/index.html`
```html
<head>
    <link type="text/css" rel="stylesheet" href="https://source.zoom.us/1.7.0/css/bootstrap.css" />
    <link type="text/css" rel="stylesheet" href="https://source.zoom.us/1.7.0/css/react-select.css" />
</head>
```

A jquery dependency was added to `public/index.html` using the CDN to [resolve this jquery error](https://devforum.zoom.us/t/when-i-install-zoomus-jssdk-for-my-react-app-it-gets-an-jquery-error/5224): 
```html
<body>
    <script src="https://source.zoom.us/1.7.0/lib/vendor/jquery.min.js"></script>
</body>
```

Zoom.js is imported into `src/App.js` as ZoomComponent to separate the file:
```js
import ZoomComponent from './Zoom'

function App() {
  return <><ZoomComponent /></>;
}
```

In `Zoom.js`, three functions are run as the component mounts: 

1. [Default library is set](https://zoom.github.io/sample-app-web/ZoomMtg.html#setZoomJSLib)
2. [WebAssembly file is loaded](https://zoom.github.io/sample-app-web/ZoomMtg.html#preLoadWasm)
3. [Required JS is loaded](https://zoom.github.io/sample-app-web/ZoomMtg.html#prepareJssdk)

`src/Zoom.js`:
```js
componentDidMount() {
    ZoomMtg.setZoomJSLib("https://source.zoom.us/1.7.0/lib", "/av");
    ZoomMtg.preLoadWasm();
    ZoomMtg.prepareJssdk();
}
```

A button is used to launch the `launchMeeting` function. This changes the state of the component to `meetingLaunched: true` and hides the button. 

```jsx
render() {
    const { meetingLaunched} = this.state;
    // Displays a button to launch the meeting when the meetingLaunched state is false
    return (
        <>
            {!meetingLaunched ? 
                <button className="launchButton" onClick={this.launchMeeting}>Launch Meeting</button> 
            : 
                <></>
            }
        </>
    )
}
```

This function then uses the development-only `generateSignature()` method which then launches the `init()` and `join()` methods.
```js
launchMeeting = () => {
        
        // change state of meeting
        this.setState({ meetingLaunched: !this.state.meetingLaunched })

        // generateSignature should only be used in development
        ZoomMtg.generateSignature({
            meetingNumber: meetConfig.meetingNumber,
            apiKey: meetConfig.apiKey,
            apiSecret: meetConfig.apiSecret,
            role: meetConfig.role,
            success(res) {
                console.log('signature', res.result);
                ZoomMtg.init({
                    leaveUrl: 'http://www.zoom.us',
                    success() {
                        ZoomMtg.join(
                            {
                                meetingNumber: meetConfig.meetingNumber,
                                userName: meetConfig.userName,
                                signature: res.result,
                                apiKey: meetConfig.apiKey,
                                userEmail: 'email@gmail.com',
                                passWord: meetConfig.passWord,
                                success() {
                                    console.log('join meeting success');
                                },
                                error(res) {
                                    console.log(res);
                                }
                            }
                        );
                    },
                    error(res) {
                        console.log(res);
                    }
                });
            }
        });
    }
```