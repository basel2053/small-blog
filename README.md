# Node Rest API for Small Blog App :rocket:

A Simple Rest API using Node, express, and postgres, which i made for a small react blog. The API provide authentication, google oauth, and ability for users to create posts, comments and manipulate them. Each user having a simple profile.

## Table of Contents

- [Technologies](#technologies)
- [Folder Structure](#folder-structure)
- [Data Shape](#data-shape)
- [Installation](#installation)
- [Usage](#usage)
- [Testing](#testing)
- [Feedback](#feedback)

## Technologies

- [Postgres](https://www.postgresql.org/) - Powerful, open source object-relational database.
- [Node](https://nodejs.org) - Javascript Runtime
- [Express](https://expressjs.com/) - Javascript API Framework
- [TypeScript](https://www.typescriptlang.org/) - Superset of Javascript

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
│   │   ├── comment.ts                    # handles (create - edit -delete) comment requests
│   │   ├── oauth2.ts                     # handles oauth2 google authentication
│   │   ├── post.ts                       # handles posts (filteration + pagiantion - CRUDS)
│   │   ├── refreshToken.ts               # handles refreshing jwt tokens, loggingout
│   │   └── user.ts                       # handles signup, login, user profile ( contains some dev methods too)
│   │
│   ├── Error                             # some files with simple classes to create customized error
│   │
│   ├── database                          
│   │   └── client.ts                     # creating pg Pool, to use it with models for querying postgres 
│   │
│   └── audit                             # saving file for auditing actions
│
└─ dist                                   # build output folder
```

## Data Shape
<img src="https://user-images.githubusercontent.com/77590428/227645717-8e091c64-939f-464f-8226-91713281f7ec.png" width="700px" alt="diagram"/>


## Installation

Install the API with npm

``` 
//on local
git clone https://github.com/basel2053/small-blog
cd small-blog
npm install
npm run start:tsdev
```
## Usage

## Testing

### Unit Tests:

Unit tests are using the mocha Framework, with chai as assertion library , and nyc for tests coverage.

> Note: `still under progress`.

```bash
  npm run test
```

## Feedback

If you have any feedback, please reach out to me at baselsalah2053@gmail.com
