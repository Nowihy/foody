const express = require('express');
const cron = require('node-cron');
const mongoose = require('mongoose');
const User = require('./../models/userModel');
const NotificationService = require('../utils/notifications')
const catchAsync = require('./../utils/catchAsync')

// Set up Express app and middleware

// Connect to the database using mongoose

// Schedule the task to run every week (e.g., every Sunday at 9:00 AM)

    cron.schedule('* * * * Sunday,Wednesday', exports.pushNotification= catchAsync(async(req,res,next) => {
    
    // Generate random notifications
    const notifications = generateRandomNotifications();
    console.log(notifications)
    // Retrieve user data from the database
    const users = await User.find({});
    // console.log(users)
    // Send notifications to users
    for (const user of users) {
    await NotificationService.sendNotification(user, notifications);
    }
    console.log('Random notifications sent successfully!');
    // res.status(200).json({
    //     statue:'success',
    //     data: notifications
    // })
}));

// Function to generate random notifications
function generateRandomNotifications() {
  // Implement your logic to generate random notifications here
  // You can return an array of notification objects with desired attributes
  // Example:
return [
    { title: 'Notification 1', message: 'This is a random notification.' },
    { title: 'Notification 2', message: 'Another random notification.' },
    // Add more notifications as needed
];
}
