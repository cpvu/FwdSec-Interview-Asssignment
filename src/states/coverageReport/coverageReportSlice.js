import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  coverageReport: null,
};

export const createCoverageReport = createAsyncThunk(
  "user/createCoverageReport",
  async (requestPayload, thunkAPI) => {
    const options = {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(requestPayload),
    };

    const response = await fetch("http://localhost:3000/api/upload", options);
    console.log(response);
    return response.json();
  }
);

export const coverageReportSlice = createSlice({
  name: "coverageReport",
  initialState,
  reducers: {
    setCoverageReport: (state, action) => {
      createCoverageReport(action.payload);
    },
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(createCoverageReport.fulfilled, (state, action) => {
      state.coverageReport = action.payload;
    });
  },
});

export default coverageReportSlice.reducer;
export const { setCoverageReport } = coverageReportSlice.actions;
