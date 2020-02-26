import React, { Component } from 'react'

import { ZoomMtg } from "@zoomus/websdk";

// Add this, never use it client side in production
const API_KEY = '';
// Add this, never use it client side in production
const API_SECRET = '';
// This can be your Personal Meeting ID
const MEETING_NUMBER = 1234567890;

const meetConfig = {
    apiKey: API_KEY,
    apiSecret: API_SECRET,
    meetingNumber: MEETING_NUMBER,
    userName: 'test user',
    passWord: '',
    leaveUrl: 'https://zoom.us',
    role: 0
};

export default class Zoom extends Component {
    state = {
        meetingLaunched: false,
    }

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
    
    componentDidMount() {
        ZoomMtg.setZoomJSLib("https://source.zoom.us/1.7.0/lib", "/av");
        ZoomMtg.preLoadWasm();
        ZoomMtg.prepareJssdk();
    }

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
}