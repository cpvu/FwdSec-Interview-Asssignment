import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { useEffect, useState } from "react";
import { Header } from "@/components/Header";

export default function Home() {
  const [swaggerFileUpload, setSwaggerFileUpload] = useState(null);
  const [burpSuiteHistoryFileUpload, setBurpSuiteFileUpload] = useState(null);
  const [loading, setLoading] = useState(false);

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

  return (
    <main>
      <div>
        <Header></Header>
        <br></br>
        <label htmlFor="#upload">Upload your Swagger File:</label>
        <input
          onChange={(e) => {
            handleSwaggerUpload(e);
          }}
          className="upload"
          type="file"
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
        <button type="submit">Upload</button>
      </div>
    </main>
  );
}
