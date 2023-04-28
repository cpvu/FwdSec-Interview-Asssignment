import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import {
  uploadBurSuiteXMLFile,
  uploadSwaggerJSONFile,
} from "@/states/fileUpload/uploadedFilesSlice";

import xml2js from "xml2js";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [coverageReport, setCoverageReport] = useState(null);

  const router = useRouter();
  const dispatch = useDispatch();
  let swaggerJSON = useSelector((state) => state.uploadedFiles.swaggerJSONFile);
  let burpSuiteXML = useSelector(
    (state) => state.uploadedFiles.burpSuiteXMLFile
  );

  useEffect(() => {
    console.log(swaggerJSON);
    console.log(burpSuiteXML);
  }, [uploadFiles]);

  function convertFileToString(uploadFile) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsText(uploadFile);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });
  }

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

  function getFileInformation(dataFile) {
    let fileData = {
      fileName: dataFile.name,
      fileSize: dataFile.size,
      fileType: dataFile.type,
    };
    return fileData;
  }

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

  useEffect(() => {
    console.log(coverageReport);
  }, [coverageReport]);

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
        <br></br>
        <label htmlFor="#upload">Upload your Swagger File:</label>
        <input
          className="upload"
          type="file"
          accept=".json"
          onChange={(e) => {
            handleSwaggerUpload(e);
          }}
        ></input>
        <br></br>
        <label>Upload your burp suite history:</label>
        <input
          className="upload"
          type="file"
          accept=".xml"
          onChange={(e) => {
            handleBurpSuiteHistoryUpload(e);
          }}
        ></input>
        <br></br>
        <a href="./coverage/result">Click</a>
        <button
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
            <table>
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

            <table>
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
          <p>Upload files to get started</p>
        )}
      </div>
    </main>
  );
}
