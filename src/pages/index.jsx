import "@/styles/Home.module.css";
import { Header } from "@/components/Header.jsx";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { FILE_SIZE_LIMIT, FILE_NAME_LIMIT } from "@/constants/constants";
import { createCoverageReport } from "@/states/coverageReport/coverageReportSlice";
import {
  convertFileToString,
  convertXMLFileToJson,
  getFileInformation,
} from "@/utils/fileUtils";
import {
  uploadBurSuiteXMLFile,
  uploadSwaggerJSONFile,
} from "@/states/fileUpload/uploadedFilesSlice";
import Error from "./_error";

export default function Home() {
  const router = useRouter();
  const dispatch = useDispatch();

  //Objects containing updated file data
  let swaggerJSON = useSelector((state) => state.uploadedFiles.swaggerJSONFile);
  let burpSuiteXML = useSelector(
    (state) => state.uploadedFiles.burpSuiteXMLFile
  );

  //Handle Swagger endpoint JSON file upload
  async function handleSwaggerUpload(uploadEvent) {
    const file = uploadEvent.target.files[0];
    if (!file) return;

    const fileInformation = getFileInformation(file);
    const jsonSwaggerFile = {
      ...fileInformation,
      fileData: JSON.parse(await convertFileToString(file)),
    };

    dispatch(uploadSwaggerJSONFile(jsonSwaggerFile));
    return;
  }

  //Handle Burp Suite XML file upload
  async function handleBurpSuiteHistoryUpload(uploadEvent) {
    const file = uploadEvent.target.files[0];
    if (!file) return;

    const fileInformation = getFileInformation(file);
    const jsonBurpSuiteHistoryFile = {
      ...fileInformation,
      fileData: await convertXMLFileToJson(file),
    };
    dispatch(uploadBurSuiteXMLFile(jsonBurpSuiteHistoryFile));

    return;
  }

  //Initiate file upload API call via dispatch API thunk
  async function uploadFiles() {
    console.log("Uploading files..");

    if (!validateFiles()) return;

    let requestData = {
      swaggerJSON: swaggerJSON,
      burpJSON: burpSuiteXML,
    };

    dispatch(createCoverageReport(requestData))
      .unwrap()
      .then((data) => {
        router.push("/CoverageReport");
      })
      .catch((error) => {
        // Handle error
        router.push('/_error')
      });
      router.push("/CoverageReport");
      
    return;
  }

  //Validate uploaded files on the client side
  function validateFiles() {
    if (
      !Object.keys(burpSuiteXML).length == 0 &&
      Object.keys(swaggerJSON).length
    ) {
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
      <div>
        <Header title="Forward Security Interview Assignment"></Header>
        <p>
          Upload a Swagger Endpoint JSON file and Burp Suite history file to get started!
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
        <label className="fileLabel">Upload your Burp Suite history:</label>
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
      </div>

  );
}
