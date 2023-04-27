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
    if (validateJSON(uploadEvent)) {
      console.log(uploadEvent.target.files[0]);
      setSwaggerFileUpload(uploadEvent.target.files[0]);
      return;
    }
    //alert("Please submit a JSON file type!");
    return;
  }

  function validateJSON(uploadEvent) {
    const jsonRegex = ".json$/i;";
    console.log(uploadEvent.target.files[0].name);
    if (new RegExp(jsonRegex).test(uploadEvent.target.files[0].name)) {
      console.log("File is of type JSON");
      return true;
    }
    return false;
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

  return (
    <main>
      <div>
        <Header></Header>
        <br></br>
        <label htmlFor="#upload">Upload your Swagger File:</label>
        <input
          type="file"
          required
          pattern="[*.JSON]"
          title="The file must be JSON"
          onChange={(e) => {
            handleSwaggerUpload(e);
          }}
          className="upload"
        ></input>
        <br></br>
        <label>Upload your burp suite history:</label>
        <input
          onChange={(e) => {
            handleBurpSuiteHistoryUpload(e);
          }}
          className="upload"
          type="file"
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
