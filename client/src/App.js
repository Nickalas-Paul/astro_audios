import React, { useState } from "react";
import BirthInputForm from "./BirthInputForm";

const App = () => {
  const [chartData, setChartData] = useState(null);

  return (
    <div className="App">
      <h1>AstroAudio App</h1>
      <BirthInputForm onChartGenerated={setChartData} />
      {chartData && (
        <div>
          <h2>Your Birth Chart Data:</h2>
          <pre>{JSON.stringify(chartData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default App;
