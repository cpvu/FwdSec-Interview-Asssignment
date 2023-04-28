import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { uploadedFilesSlice } from "./fileUpload/";

export const store = configureStore({
  reducer: {
    uploadedFiles: uploadedFilesSlice.reducer,
  },
});

// Use throughout your app instead of plain `useDispatch` and `useSelector`
