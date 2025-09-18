import ErrorBoundary from './components/ErrorBoundary';
import AppRouter from './components/AppRouter';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <AppRouter />
    </ErrorBoundary>
  );
}

export default App;
