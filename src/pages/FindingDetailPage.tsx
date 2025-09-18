import React from 'react';
import { useParams } from 'react-router-dom';

const FindingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Finding Detail</h1>
      <p className="text-gray-600">Coming soon - Detailed view for finding ID: {id}</p>
    </div>
  );
};

export default FindingDetailPage;
