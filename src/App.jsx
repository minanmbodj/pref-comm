import 'bootstrap/dist/css/bootstrap.min.css';
import logo from './logo.svg';
import './App.css';
import AdvisorsPage from './pages/advisors/AdvisorsPage';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Preference Community</h1>
      </header>
      <AdvisorsPage className="Main-content" />
    </div>
  );
}

export default App;
