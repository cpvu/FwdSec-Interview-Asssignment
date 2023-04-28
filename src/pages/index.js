import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { useRouter } from "next/router";

export default function Home() {
  const [swaggerFileUpload, setSwaggerFileUpload] = useState(null);
  const [burpSuiteHistoryFileUpload, setBurpSuiteFileUpload] = useState(null);
  const [loading, setLoading] = useState(false);
  const [coverageReport, setCoverageReport] = useState(null);
  const router = useRouter();

  function handleSwaggerUpload(uploadEvent) {
    setSwaggerFileUpload(uploadEvent.target.files[0]);
    return;
  }

  function handleBurpSuiteHistoryUpload(uploadEvent) {
    setBurpSuiteFileUpload(uploadEvent.target.files[0]);
  }

  useEffect(() => {
    if (swaggerFileUpload || burpSuiteHistoryFileUpload) {
      console.log(swaggerFileUpload);
    }
  }, [swaggerFileUpload, burpSuiteHistoryFileUpload]);

  useEffect(() => {
    console.log(coverageReport);
  }, [coverageReport]);

  async function uploadFiles() {
    console.log("Uploading files..");

    if (!validateFiles()) return;

    let formData = new FormData();

    formData.append("burpSuiteHistoryFile", burpSuiteHistoryFileUpload);
    formData.append("swaggerFile", swaggerFileUpload);

    const options = {
      method: "POST",
      body: formData,
    };

    try {
      const response = await fetch("http://localhost:3000/api/upload", options);
      const data = await response.json();
      setCoverageReport(data);

      Object.keys(coverageReport).forEach((key) => {
        console.log(key);
      });
      //router.push("coverageReport");
    } catch (e) {
      console.log(e);
    }
    return;
  }

  function validateFiles() {
    const FILE_SIZE_LIMIT = 1000000;
    const FILE_NAME_LIMIT = 50;

    if (burpSuiteHistoryFileUpload && swaggerFileUpload) {
      if (
        burpSuiteHistoryFileUpload.size > FILE_SIZE_LIMIT ||
        swaggerFileUpload > FILE_SIZE_LIMIT
      ) {
        alert("File size limit exceed, upload file's less than 1MB");
        return false;
      }
      console.log(burpSuiteHistoryFileUpload.name.split(".xml")[0].length);
      if (
        burpSuiteHistoryFileUpload.name.split(".xml")[0].length >
          FILE_NAME_LIMIT ||
        swaggerFileUpload.name.split(".xml")[0].length > FILE_NAME_LIMIT
      ) {
        alert("File name length is more than 50 characters");
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
