import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { resetCoverageReport } from "@/states/coverageReport/coverageReportSlice";
import { resetFiles } from "@/states/fileUpload/uploadedFilesSlice";

export default function coverageReport() {
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(resetCoverageReport());
      dispatch(resetFiles());
    };
  }, []);

  let coverageReport = useSelector(
    (state) => state.coverageReport.coverageReport
  );

  return (
    <div>
      <header>Result:</header>
      {coverageReport ? (
        <div>
          <p>Total Endpoints: {coverageReport.totalEndpoints}</p>
          <p>Coverage: {coverageReport.coverage}%</p>
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
                    {coverageReport.untestedEndpoints[`${endpoint}`].toString()}
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
        </div>
      ) : (
        <label onLoad={returnHome}>Returning home..</label>
      )}
      <br></br>
      <button className="submitUpload" onClick={() => router.push("/")}>
        Return home
      </button>
    </div>
  );
}
