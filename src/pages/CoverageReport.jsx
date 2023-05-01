import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { resetCoverageReport } from "@/states/coverageReport/coverageReportSlice";
import { resetFiles } from "@/states/fileUpload/uploadedFilesSlice";
import { Header } from "@/components/Header.jsx";
import { ReportTable } from "@/components/ReportTable";

export default function CoverageReport() {
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
          <ReportTable name="untestedEndpoints" endpoints={coverageReport.untestedEndpoints}></ReportTable>
          <ReportTable name="testedEndpoints" endpoints={coverageReport.testedEndpoints}></ReportTable>
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
