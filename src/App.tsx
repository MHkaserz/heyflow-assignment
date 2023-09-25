import InteractiveJson from './InteractiveJson/InteractiveJson';
import './App.scss';

const demoData = {
  response: {
    date: "2021-10-27T07:49:14.896Z",
    hasError: false,
    fields: [
      0,
      {
        id: "4c212130",
        prop: "iban",
        value: "DE81200505501265402568",
        hasError: false
      },
      [
        "testing"
      ]
    ]
  }
}

function App() {
  return (
    <div className="App">
      <InteractiveJson jsonData={demoData} />
    </div>
  );
}

export default App;