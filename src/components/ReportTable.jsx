export const ReportTable = (props) => {
  return (
    <table className="coverageTable">
    <tbody>
      <tr>
        <th>UntestedEndPoints</th>
        <th>Methods</th>
      </tr>
      {Object.keys(props.endpoints).map((endpoint, index) => {
        return (
          <tr key={index}>
            <td key={endpoint}>{endpoint}</td>
            <td key={props.endpoints[`${endpoint}`]}>
              {props.endpoints[
                `${endpoint}`
              ].toString()}
            </td>
          </tr>
        );
      })}
    </tbody>
  </table>
  );
};
