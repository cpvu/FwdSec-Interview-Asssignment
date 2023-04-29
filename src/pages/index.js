import "@/styles/Home.module.css";
import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import xml2js from "xml2js";
import {
  uploadBurSuiteXMLFile,
  uploadSwaggerJSONFile,
} from "@/states/fileUpload/uploadedFilesSlice";

export default function Home() {
  const [coverageReport, setCoverageReport] = useState(null);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    console.log(coverageReport);
  }, [coverageReport]);

  //Objects containing updated file data
  let swaggerJSON = useSelector((state) => state.uploadedFiles.swaggerJSONFile);
  let burpSuiteXML = useSelector(
    (state) => state.uploadedFiles.burpSuiteXMLFile
  );

  //Refresh component once files have been set to states
  useEffect(() => {
    console.log(swaggerJSON);
    console.log(burpSuiteXML);
  }, [uploadFiles]);

  //Convert the file contents to string for request body
  function convertFileToString(uploadFile) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsText(uploadFile);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });
  }

  //Convert XML file string to JSON
  async function convertXMLFileToJson(xmlFile) {
    const parser = new xml2js.Parser();
    const fileString = await convertFileToString(xmlFile);

    let xmlJSON = new Promise((resolve, reject) => {
      parser.parseString(fileString, (err, result) => {
        if (err) {
          console.error(err);
          reject(err);
        }
        // Convert the JavaScript object to a JSON string
        resolve(JSON.parse(JSON.stringify(result)));
      });
    });

    return xmlJSON;
  }

  //Create new object containing information regarding the file for validation
  function getFileInformation(dataFile) {
    let fileData = {
      fileName: dataFile.name,
      fileSize: dataFile.size,
      fileType: dataFile.type,
    };
    return fileData;
  }

  //Handle Swagger endpoint JSON file upload
  async function handleSwaggerUpload(uploadEvent) {
    const file = uploadEvent.target.files[0];
    const fileInformation = getFileInformation(file);

    const jsonSwaggerFile = {
      ...fileInformation,
      fileData: JSON.parse(await convertFileToString(file)),
    };

    console.log(jsonSwaggerFile);

    dispatch(uploadSwaggerJSONFile(jsonSwaggerFile));
    return;
  }

  //Handle Burp Suite XML file upload
  async function handleBurpSuiteHistoryUpload(uploadEvent) {
    const file = uploadEvent.target.files[0];
    const fileInformation = getFileInformation(file);

    const jsonBurpSuiteHistoryFile = {
      ...fileInformation,
      fileData: await convertXMLFileToJson(file),
    };
    dispatch(uploadBurSuiteXMLFile(jsonBurpSuiteHistoryFile));

    return;
  }

  //Initiate file upload payload and API call
  async function uploadFiles() {
    console.log("Uploading files..");

    if (!validateFiles()) return;

    //let formData = new FormData();

    //formData.append("burpSuiteHistoryFile", burpSuiteXML);
    //formData.append("swaggerFile", swaggerJSON);

    let requestData = {
      swaggerJSON: swaggerJSON,
      burpJSON: burpSuiteXML,
    };

    console.log(requestData);

    const options = {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(requestData),
    };

    try {
      const response = await fetch("http://localhost:3000/api/upload", options);
      const data = await response.json();
      setCoverageReport(data);

      //router.push("coverageReport");
    } catch (e) {
      console.log(e);
    }
    return;
  }

  //Validate uploaded files on the client side
  function validateFiles() {
    const FILE_SIZE_LIMIT = 1000000;
    const FILE_NAME_LIMIT = 50;

    if (burpSuiteXML && swaggerJSON) {
      if (
        burpSuiteXML.fileSize > FILE_SIZE_LIMIT ||
        swaggerJSON.fileSize > FILE_SIZE_LIMIT
      ) {
        alert("File size limit exceed, upload file's less than 100KB");
        return false;
      }

      if (
        burpSuiteXML.fileName.split(".xml")[0].length > FILE_NAME_LIMIT ||
        swaggerJSON.fileName.split(".xml")[0].length > FILE_NAME_LIMIT
      ) {
        alert(`File name length is more than ${FILE_NAME_LIMIT} characters`);
        return false;
      }
      return true;
    }
    alert("Upload all required files.");
  }

  return (
    <main>
      <div>
        <Header></Header>
        <p>
          Upload your SwaggerJSON and Burp suite history file to get started!
        </p>
        <label className="fileLabel" htmlFor="#upload">
          Upload your Swagger File:
        </label>
        <input
          className="upload"
          type="file"
          accept=".json"
          onChange={(e) => {
            handleSwaggerUpload(e);
          }}
        ></input>
        <label className="fileLabel">Upload your burp suite history:</label>
        <input
          className="upload"
          type="file"
          accept=".xml"
          onChange={(e) => {
            handleBurpSuiteHistoryUpload(e);
          }}
        ></input>
        <button
          className="submitUpload"
          onClick={() => {
            uploadFiles();
          }}
          type="submit"
        >
          Upload
        </button>
        <br></br>
        <p1>Result:</p1>
        {coverageReport ? (
          <div>
            <table className="coverageTable">
              <tr>
                <th>UntestedEndPoints</th>
                <th>Methods</th>
              </tr>
              {Object.keys(coverageReport.untestedEndpoints).map((endpoint) => {
                return (
                  <tr>
                    <td key={endpoint}>{endpoint}</td>
                    <td key={coverageReport.untestedEndpoints[`${endpoint}`]}>
                      {coverageReport.untestedEndpoints[
                        `${endpoint}`
                      ].toString()}
                    </td>
                  </tr>
                );
              })}
            </table>

            <table className="coverageTable">
              <tr>
                <th>TestedEndpoints</th>
                <th>Methods</th>
              </tr>
              {Object.keys(coverageReport.testedEndpoints).map((endpoint) => {
                return (
                  <tr>
                    <td>{endpoint}</td>
                    <td>
                      {coverageReport.testedEndpoints[`${endpoint}`].toString()}
                    </td>
                  </tr>
                );
              })}
            </table>

            <p>Total Endpoints: {coverageReport.totalEndpoints}</p>
            <p>Coverage: {coverageReport.coverage}%</p>
          </div>
        ) : (
          <p></p>
        )}
      </div>
    </main>
  );
}
