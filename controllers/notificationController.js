const cron = require('node-cron');
const User = require('./../models/userModel');
const NotificationService = require('../utils/notifications')
const catchAsync = require('./../utils/catchAsync')


    cron.schedule('* * * * Sunday,Wednesday', exports.pushNotification= catchAsync(async(req,res,next) => {
    
    // Generate random notifications
    const notifications = generateRandomNotifications();
    // console.log(notifications)
    const users = await User.find({});
    // Send notifications to users
    for (const user of users) {
    await NotificationService.sendNotification(user, notifications);
    }
    // console.log('Random notifications sent successfully!');
    // res.status(200).json({
    //     statue:'success',
    //     data: notifications
    // })
}));

// Function to generate random notifications
function generateRandomNotifications() {
return [
    { title: 'Notification', message: 'there are new offers' },
    // { title: 'Notification 2', message: 'Another random notification.' },
];
}
