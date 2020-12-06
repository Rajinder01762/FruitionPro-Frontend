# Fruition-Pro App

## File Structure

```
fruitionpro/
  |--src/
  |  |--api/
  |  |  |--index.js        //-- credentials
  |  |--asset/             //-- icons and css files
  |  |  |--images/         //-- icons
  |  |  |--style/          //-- css files
  |  |  |--*.js            //-- js files
  |  |--shared/
  |  |  |--components/     //-- All application components
  |  |  |  |--login/       //-- login components
  |  |  |  |--dashboard/   //-- dashboard components
  |  |  |--icons/          //-- icons
  |  |  |--store/          //-- redux folders
  |  |  |--util/           //-- server related files
  |  |--App.js             //-- routes
  |  |--index.js           //-- Main JS
  |--public/               //-- icons
  |--package.json          //-- dependencies/installed packages
```

## Steps to clone and start app

1. Clone with url:
   \$ git clone https://fruitionpro@bitbucket.org/fruitionpro/fruitionpro-frontend.git

## Install application dependencies

```
$ cd Project Folder/
```

```
$ npm install
```

## Build

Run the App server.

```
$ npm start

```

## Development Pipeline

For each feature/task, create a new branch as follows:

1. Sync from `master` branch.
2. Create a new branch from `master` with the pattern: `year/userName/milestone-no`
   For example: `2020/Chavi/milestone-1`
3. Make changes (**Please commit frequently whenever a change has been made. do not commit everything at once!**)
4. Commit frequently to `year/userName/milestone-no`.
5. When a new task is completed or a significant milestone is reached, create a Pull Request (PR) to `master`.
6. Reviewers will review your Pull Request and accept or reject with feedback.
7. If rejected, review and fix and create another Pull Request.
8. If accepted, your changes will be merged into the `master` branch.

## Assistance and questions

If you have any questions or need any assistance with anything, please ask on the slack channel or sent us an email.
Email[here](contact@innow8apps.com)
Please do not waste many hours stuck on a single problem. If you are stuck, please ask others for help.
