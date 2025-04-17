### Project Requirements
    node: v18.19.1
    npm: v8.1.3
    ionic: v8.0.0
    cordova: 10.1.2
    jdk: 11.0.2
### Build Apk
    Debug: `ionic cordova run android --prod` OR `ionic cordova build android --prod`
    Release: `ionic cordova build android --prod --release --buildConfig=build.json` OR `ionic cordova build android --prod --release --buildConfig=build.json -- -- --packageType=bundle`
    