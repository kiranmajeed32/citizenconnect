

const functions = require('firebase-functions');
var gcs = require('@google-cloud/storage')({keyFilename:'citizenconnect-ed5fa-firebase-adminsdk-op53u-069b5c7148.json'})
const spawn = require('child-process-promise').spawn
var FCM = require('fcm-push');
var fcm = new FCM(serverKey);
const admin = require('firebase-admin')
var dateFormat = require('dateformat');
var now = new Date();

  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: "https://citizenconnect-ed5fa.firebaseio.com"
  });
  var datetime = require('node-datetime');

var databaseRef = admin.database();

exports.generateThumbnail = functions.storage.object()
.onChange(event=>{
    const object = event.data
    const filePath = object.name
    const fileName = filePath.split('/').pop()
    const fileBucket = object.bucket
    const bucket = gcs.bucket(fileBucket)
    const tempFilePath  = `/tmp/${fileName}`
    const ref = admin.database().ref()
    const file = bucket.file(filePath)
    const thumbFilePath = filePath.replace(/(\/)?([^\/]*)$/,
    '$1thumb_$2')
    console.log('File Bucket'+fileBucket)
    console.log('Bucket :'+bucket)
    if(fileName.startsWith('thumb_')){
        console.log('Alerady a Thumbnail')
        return
    }
    if  (!object.contentType.startsWith('image/')){
        console.log('This is not an image:'+object.contentType)
        return
    }
    if  (object.resourceState === 'not_exists'){
        console.log('This is a deletion event')
        return
    }
    return bucket.file(filePath).download({
        destination: tempFilePath
    })
    .then(()=>{
        const thumbFile = bucket.file(thumbFilePath)
        const config = {
            action: 'read',
            expires: '03-09-2491'
        }
        return Promise.all([
            thumbFile.getSignedUrl(config),
            file.getSignedUrl(config)
        ])
    }).then(results => {
        const thumbResult = results[0]
        const originalResult = results [1]
        const thumbFileUrl = thumbResult[0]
        const fileUrl  = originalResult[0]
        console.log('Downloadable link:'+fileUrl)
        //Save Download link to real Time Database
        saveFileURL(fileUrl,fileName)
        sendNotification(fileUrl);
        return;
    })
    return bucket.upload(tempFilePath,{
        destination: thumbFilePath
    })
})

function saveFileURL(fileUrl,fileName) {
    databaseRef.ref('Notifications').push({
        filePath: fileUrl,
        date: dateFormat(now, "dd-mm-yyyy"),
        description: "Notification Description on "+dateFormat(now, "dd-mm-yyyy"),
        tag: "Notification"
    });
  }

function sendNotification(msg){
    var message = {
        to: '/topics/notification',
        priority: "high",
        data: {
            serveMessage: msg
        },
    };

    fcm.send(message, function(err, response){
        if (err) {
            console.log("Error in Sending notification :"+err);
        } else {
            console.log("Successfully sent with response: ", response);
        }
    });
}

