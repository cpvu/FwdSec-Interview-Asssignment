import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { uploadedFilesSlice } from "./fileUpload/";
import { coverageReportSlice } from "./coverageReport/coverageReportSlice";

export const store = configureStore({
  reducer: {
    coverageReport: coverageReportSlice.reducer,
    uploadedFiles: uploadedFilesSlice.reducer,
  },
});

// Use throughout your app instead of plain `useDispatch` and `useSelector`
