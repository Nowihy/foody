<h1 align="center">Foody</h1>
<p align="center">
  <img src="https://img.shields.io/badge/Node.js-000000?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js badge">
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB badge">
  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express badge">
</p>
Foody is a backend service that powers the Foody food delivery application. Foody allows users to browse restaurants, view menu items, place orders, and track deliveries. The API is built using Node.js, Express.js, and MongoDB. The app also implements authentication, authorization, security, payments and email features.

## :rocket: Getting Started

To run this project locally, you need to have Node.js and MongoDB installed on your machine.

### Prerequisites

- Node.js
- MongoDB
- NPM or Yarn
- JavaScript

### Installation

1. Clone this repo to your local machine using `git clone https://github.com/<your-username>/foody.git`.
2. Go to the project directory using `cd foody`.
3. Install the dependencies using `npm install` or `yarn install`.
4. Create a `.env` file in the root folder and add the following environment variables:

`
NODE_ENV=development
PORT=3000
DATABASE=<your-mongodb-connection-string>
DATABASE_PASSWORD=<your-mongodb-password>
JWT_SECRET=<your-jwt-secret>
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=100
STRIPE_SECRET_KEY=<your-stripe-secret-key>`

Run the app using npm start or yarn start.<br> Open your browser and go to http://localhost:3000.<br> 

### :sparkles: Features
User registration and login with JWT authentication<br> Password reset with email verification<br>
User roles and permissions<br> User restaurant search refinement through cuisine-oriented filtering options <br> Restaurants suggested to users based on their present location <br> Restaurnt creation, update and deletion<br> Menu items can be created, updated or deleted by restaurant owners or admins <br> Placing orders for items from different restaurants, with the ability to track order details and status <br> New orders can only be assigned to available delivery personnel <br> Administrative access to viewing all placed orders <br> User image upload and processing<br> Restaurant ratings and reviews <br> notification system to send push notifications to users randomly every week<br> payment with Stripe integration<br> Error handling and logging<br>
### :hammer_and_wrench: Technologies
Node.js<br> Express<br> MongoDB<br> Mongoose<br> Bcrypt<br> Jsonwebtoken<br> Validator<br> Stripe<br> Node cron<br>  Multer<br> Sharp<br> Morgan<br> Helmet<br> Xss<br>

## :bust_in_silhouette: Author
- Nowihy- Initial development
