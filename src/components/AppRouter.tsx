import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSarifStore } from '../store/sarifStore';
import Layout from '../components/Layout';
import Upload from '../pages/Upload';
import Dashboard from '../pages/Dashboard';
import Rules from '../pages/Rules';
import Findings from '../pages/Findings';
import FindingDetail from '../pages/FindingDetail';

const AppRouter: React.FC = () => {
  const { sarifData } = useSarifStore();
  const hasData = !!sarifData;

  return (
    <Router>
      <Layout>
        <Routes>
          {/* Upload route - always accessible */}
          <Route path="/" element={<Upload />} />
          
          {/* Protected routes - only accessible when SARIF data is loaded */}
          {hasData ? (
            <>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/rules" element={<Rules />} />
              <Route path="/findings" element={<Findings />} />
              <Route path="/finding/:id" element={<FindingDetail />} />
            </>
          ) : (
            <>
              <Route path="/dashboard" element={<Navigate to="/" replace />} />
              <Route path="/rules" element={<Navigate to="/" replace />} />
              <Route path="/findings" element={<Navigate to="/" replace />} />
              <Route path="/finding/:id" element={<Navigate to="/" replace />} />
            </>
          )}
        </Routes>
      </Layout>
    </Router>
  );
};

export default AppRouter;
