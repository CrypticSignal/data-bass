import { useEffect, useState } from "react";
import { Dropdown, Container } from "semantic-ui-react";
import Papa from "papaparse";
import Plot from "react-plotly.js";

let subs = [];
const dropdownOptions = [];
const frequencies = ["10", "12.5", "16", "20", "25", "31.5", "40", "50", "63", "80", "100", "125"];

const MovieData = () => {
  const [selectedSubs, setSelectedSubs] = useState([]);
  const [plotData, setPlotData] = useState([]);
  const [data, setData] = useState({});
  const [timesDataSet, setTimesDataSet] = useState(0);

  useEffect(() => {
    Papa.parse(
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vS9JcTRFq0ha9P-abs1Yh1eF3I236kKWS-cD2h3x2K3M_ytkFY5qUHZYHnkkoynVGrS4ShPBry80rx0/pub?gid=732039419&single=true&output=csv",
      {
        download: true,
        complete: (results) => {
          const result = {};

          for (let i = 0; i < results.data.length; i++) {
            const [key, ...values] = results.data[i];
            result[key] = values;
          }

          setData(result);
          setTimesDataSet((val) => val + 1);
          const keys = Object.keys(result);
          keys.shift();
          subs = keys;
        },
      }
    );
  }, []);

  useEffect(() => {
    if (timesDataSet === 2) {
      subs.forEach((sub, i) => {
        dropdownOptions.push({ key: sub, value: sub, text: sub });
      });
    }
  }, [timesDataSet]);

  useEffect(() => {
    if (!selectedSubs.length) setPlotData([]);

    const traces = [];

    selectedSubs.forEach((sub) => {
      const trace = {
        x: frequencies,
        y: data[sub].slice(1, -1),
        name: sub,
      };
      traces.push(trace);
      setPlotData(traces);
    });
  }, [selectedSubs]);

  const handleSubsSelected = (_, { value }) => {
    setSelectedSubs(value);
  };

  return (
    <Container textAlign="center">
      {timesDataSet === 2 ? (
        <div>
          <Dropdown
            placeholder="Select Movie"
            onChange={handleSubsSelected}
            fluid
            multiple
            search
            selection
            options={dropdownOptions}
          />
          <Plot
            data={plotData}
            layout={{
              autosize: true,
              xaxis: {
                title: "Frequency (Hz)",
                tickMode: "linear",
              },
              yaxis: {
                title: "dB",
              },
            }}
            style={{ width: "100%", height: "100%" }}
            useResizeHandler={true}
          />
        </div>
      ) : (
        <p>Loading data...</p>
      )}
    </Container>
  );
};

export default MovieData;
