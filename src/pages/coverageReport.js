import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { resetCoverageReport } from "@/states/coverageReport/coverageReportSlice";
import { resetFiles } from "@/states/fileUpload/uploadedFilesSlice";
import { Header } from "@/components/Header";

export default function coverageReport() {
  const router = useRouter();
  const dispatch = useDispatch();

  // Reset states if the page is navigated back to home, so that previous files do not persist
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
      <Header title="Coverage Report"></Header>
      {coverageReport ? (
        <div>
          <p>Total Endpoints: {coverageReport.totalEndpoints}</p>
          <p>Coverage: {coverageReport.coverage}%</p>
          <table className="coverageTable">
            <tbody>
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
            </tbody>
          </table>

          <table className="coverageTable">
            <tbody>
              <tr>
                <th>TestedEndpoints</th>
                <th>Methods</th>
              </tr>
              {Object.keys(coverageReport.testedEndpoints).map((endpoint) => {
                return (
                  <tr>
                    <td key={endpoint}>{endpoint}</td>
                    <td key={coverageReport.untestedEndpoints[`${endpoint}`]}>
                      {coverageReport.testedEndpoints[`${endpoint}`].toString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p></p>
      )}
      <br></br>
      <button className="submitUpload" onClick={() => router.push("/")}>
        Return home
      </button>
    </div>
  );
}
