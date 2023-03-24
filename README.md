# Node Rest API for Small Blog App

A Simple Rest API using Node, express, and postgres, which i made for a small react blog. The API provide authentication, google oauth, and ability for users to create posts, comments and manipulate them. Each user having a simple profile.

## Table of Contents

- [Technologies](#technologies)
- [Installation](#installation)
- [Folder Structure](#folder-structure)
- [Data](#data)
- [Usage](#usage)
- [Testing](#testing)
- [Feedback](#feedback)

## Technologies

- [Postgres](https://www.postgresql.org/) - Powerful, open source object-relational database.
- [Node](https://nodejs.org) - Javascript Runtime
- [Express](https://expressjs.com/) - Javascript API Framework
- [TypeScript](https://www.typescriptlang.org/) - Superset of Javascript

## Installation

Install the API with npm

```bash
  npm install my-project
  cd my-project
```

## Folder Structure

```bash
├── README.md - This file.
├── package.json                          # npm package manager file. It's unlikely that you'll need to modify this.
├── swagger.json                          # Swagger file for API documentation
├── tsconfig.json                         # Typescript configuration
├── database.json                         # Database config (required for migrations)
├── .eslintrc.js                          # linting config
├── .nycrc                                # Config file for test coverage (nyc)
├── .env                                  # Environment variables file
├── .circleci                             # CI/CD folder (not implemented yet)
├── uploads
│   └── .                                 # where all posts images are saved
├── migrations
│   ├── ./                                # config for executing the migrations files
│   └── sqls                              # migrations commands for both up (create tables) and down (to remove them)
│
└── src
│   ├── server.ts                         # Node server file.
│   ├── util                              # utilities folder
│   │   ├── upload.ts                     # multer file upload configuration  
│   │   ├── upload_clouds.ts              # multer upload using cloudinary (not used)
│   │   ├── signToken.ts                  # utility func for generating jwt token
│   │   ├── mailing.ts                    # nodemailer configuration for mails (email confirmation - password reset)
│   │   ├── date.ts                       # func to return formatted current date
│   │   ├── validators
│   │   │   ├── commentValidators.ts      # validators for comment cruds
│   │   │   ├── postValidators.ts         # validators for post cruds
│   │   │   └── userValidators.ts         # validators for user cruds
│   │   └── mail-templates
│   │        └── mail.ts                  # contains 2 html templates for mails (confirm - reset)
│   │
│   ├── test                              # mocha tests folder (not implemented yet)
│   │
│   ├── services
│   │   ├── audit.service.ts              # service for generating audits record in the app
│   │   └── logger.service.ts             # logging service using winston
│   │
│   ├── model                             # each file contains interface and methods
│   │   ├── audit.ts                      
│   │   ├── comment.ts                    
│   │   ├── post.ts                      
│   │   ├── token.ts                      
│   │   └── user.ts 
│   │
│   ├── middleware
│   │   ├── optimizeImage.ts              # used for resizing post image and passing path into req.body
│   │   ├── validation.ts                 # extract express-validator results
│   │   └── verifyToken.ts                # verify jwt token and pass user into res.locals
│   │
│   ├── interface
│   │   └── payload.ts                    # simple interface for jwt payload in verify middleware
│   │
│   ├── handler
│   │   ├──
│   │   ├──
│   └── index.js # You should not need to modify this file. It is used for DOM rendering only.
│
└─ dist             # build output folder
```

## Data

## Usage

## Testing

## Feedback

If you have any feedback, please reach out to me at baselsalah2053@gmail.com
