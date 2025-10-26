import React, { useState } from 'react';

const SupplyChainPage: React.FC = () => {
  const [selectedContinent, setSelectedContinent] = useState<string | null>(null);

  const continents = [
    { name: 'Asia', top: '28%', left: '65%', color: 'bg-orange-500', countries: 'India, China, Japan, Singapore, Malaysia, Thailand, Vietnam, Bangladesh, Philippines, Indonesia, South Korea, UAE, Saudi Arabia, Qatar, Lebanon, Israel, and more.' },
    { name: 'Europe', top: '22%', left: '50%', color: 'bg-yellow-500', countries: 'UK, Germany, France, Italy, Spain, Netherlands, Switzerland, Sweden, Poland, Russia, and all EU member states.' },
    { name: 'North America', top: '25%', left: '20%', color: 'bg-green-500', countries: 'USA, Canada, Mexico.' },
    { name: 'South America', top: '60%', left: '25%', color: 'bg-blue-500', countries: 'Brazil, Argentina, Chile, Peru, Colombia, Venezuela, Uruguay.' },
    { name: 'Africa', top: '50%', left: '55%', color: 'bg-red-500', countries: 'South Africa, Egypt, Kenya, Nigeria, Ghana, Morocco, Tunisia, and more.' },
    { name: 'Oceania', top: '65%', left: '90%', color: 'bg-purple-500', countries: 'Australia, New Zealand, Papua New Guinea, Fiji, and other Pacific islands.' },
  ];

  return (
    <div className="min-h-screen bg-white">

      {/* Hero Section */}
      <section className="relative h-96 md:h-[28rem] bg-cover bg-center" style={{ backgroundImage: "url('https://picsum.photos/seed/supply-chain/1600/800')" }}>
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center text-white p-4">
            <h1 className="text-5xl md:text-6xl font-serif font-bold animate-fade-in-up">Our Supply Chain</h1>
            <p className="text-xl mt-4">Transparent, Efficient, and Sustainable</p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 py-20">

        {/* Supply Chain Overview */}
        <section className="mb-20">
          <h2 className="text-4xl font-serif font-bold text-gray-800 mb-8 text-center">End-to-End Supply Chain Management</h2>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {[
              { title: 'Sourcing', description: 'We partner with trusted local farmers and artisans across Sri Lanka to bring you authentic, high-quality products.', icon: '🌱' },
              { title: 'Processing', description: 'Our facilities maintain the highest standards of quality and hygiene while preserving traditional preparation methods.', icon: '🏭' },
              { title: 'Distribution', description: 'Efficient logistics network ensuring your orders reach you fresh and in perfect condition, wherever you are in the world.', icon: '🚚' }
            ].map((item, index) => (
              <div key={index} className="bg-orange-50 p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Sustainability Section */}
        <section className="bg-gray-50 p-12 rounded-2xl mb-20">
          <h2 className="text-4xl font-serif font-bold text-gray-800 mb-8 text-center">Our Commitment to Sustainability</h2>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-lg text-gray-600 mb-6">
                We are committed to sustainable practices throughout our supply chain, from eco-friendly packaging to supporting fair trade principles and local communities.
              </p>
              <ul className="space-y-3">
                {[
                  'Ethical sourcing from local farmers',
                  'Minimal environmental impact',
                  'Fair wages and working conditions',
                  'Eco-friendly packaging materials',
                  'Carbon footprint reduction initiatives'
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="h-64 bg-gray-200 rounded-lg overflow-hidden">
              <img src="https://picsum.photos/seed/sustainable-farming/800/500" alt="Sustainable farming in Sri Lanka" className="w-full h-full object-cover" />
            </div>
          </div>
        </section>

        {/* Tracking Section */}
      

        {/* Interactive Global Coverage */}
        <section>
          

          <div className="relative">

            {/* Continent Dots */}
         

            {/* Display Selected Continent Name */}
            {selectedContinent && (
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-lg shadow-lg animate-fade-in-up text-gray-800 font-bold">
                {selectedContinent}
              </div>
            )}
          </div>

          {/* Country Table */}
          <div className="overflow-x-auto mt-12">
            <table className="w-full border-collapse border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-300 px-4 py-2 text-left">Continent</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Countries / Regions</th>
                </tr>
              </thead>
              <tbody>
                {continents.map((c, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="border border-gray-300 px-4 py-2 font-medium">{c.name}</td>
                    <td className="border border-gray-300 px-4 py-2">{c.countries}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes fade-in-up {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in-up {
            animation: fade-in-up 1s ease forwards;
          }
        `
      }} />
    </div>
  );
};

export default SupplyChainPage;
