
import React from 'react';
import Card from '../components/ui/Card';

const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">{title}</h1>
      <Card>
        <div className="text-center py-20">
            <h2 className="text-2xl font-semibold text-gray-600">Halaman dalam Pengembangan</h2>
            <p className="text-gray-500 mt-2">Fitur "{title}" akan segera tersedia. Terima kasih atas kesabaran Anda.</p>
        </div>
      </Card>
    </div>
  );
};

export default PlaceholderPage;
