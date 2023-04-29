# Swagger Coverage Report
This NextJS application is designed to generate a coverage report for a Swagger file and Burp Suite history file. The report will show the percentage of endpoints covered in the Swagger file based on the requests in the Burp Suite history.

# Getting Started

1. Clone this github repository.

2. Install package dependencies
    ```
    npm install
    ```
3. Run the development server 
    ```
    npm run dev
    ```
4. Run the production build
    ```
    npm run build && npm run start
    ```
5. Open http://localhost:3000 with your browser to see the result.

# Uploading Files

A swagger JSON file is required. Select your swagger file under the swagger file upload.

A burp suite history XML file is required. Select your burp suite history file under the burp suite history upload.

## File Restrictions:
    - Less than 500kb
    - Respective file types must be application/json and text/xml
    - File name less than 50 characters

# Viewing the Report
Once files are uploaded, click on the upload button.

A report will be generated showing two tables; untested endpoints and tested endpoints. There are two columns, routes for the endpoint route and method for the request method.

<b>Untested endpoints:</b> includes end points that have not been tested.
<b>Tested endpoints:</b> includes endpoints that have been tested.

The coverage is calculated using these two tables, providing a percentage of coverage of the swagger endpoints that the burp suite history file has tested.

# Technologies Used
This application built using NextJS and React Redux. As a smaller scale application, it utilizes NextJS's server-side processing and file handling via its API routes features.

React Redux allows for ease of managing application states of the files that are uploaded.

##Contributors
This app was created by Calvin Vu for Forward Security.