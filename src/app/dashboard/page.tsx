'use client'; // Mark this file as a Client Component

import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import DashboardLayout from '@/components/DashboardLayout';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function DashboardPage() {
  // User's name (you can fetch this from an authentication context or backend)
  const userName = "John Doe"; // Replace with dynamic name fetching

  // Progress bars values and animation
  const [progress, setProgress] = useState(0);
  const [regionProgress, setRegionProgress] = useState(0);

  // Simulate loading animation for progress bars
  useEffect(() => {
    setTimeout(() => {
      setProgress(65);  // Set your actual progress value here
      setRegionProgress(80);  // Set your actual region progress value here
    }, 1000);
  }, []);

  // Data for the Bar Chart
  const data = {
    labels: ['Region 1', 'Region 2', 'Region 3', 'Region 4', 'Region 5'],
    datasets: [
      {
        label: 'Votes by Region',
        data: [1200, 1500, 900, 1300, 1100],
        backgroundColor: '#00bf63', // Updated color
        borderColor: '#00bf63',
        borderWidth: 1,
      },
    ],
  };

  // Options for the Bar Chart
  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Votes by Region',
        font: {
          size: 18,
        },
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `Votes: ${tooltipItem.raw}`;
          },
        },
      },
    },
  };

  return (
    <DashboardLayout>
      {/* Welcome Message */}
      <h1 className="text-3xl font-semibold text-prime mb-4">
        Welcome back, {userName}!
      </h1>

      {/* Dashboard Stats */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-prime p-6 rounded-lg shadow-lg text-white flex items-center justify-center hover:scale-105 transition-transform">
          <div className="text-center">
            <h2 className="text-xl font-semibold">Active Elections</h2>
            <p className="text-3xl font-bold mt-2">3</p>
          </div>
        </div>
        <div className="bg-prime p-6 rounded-lg shadow-lg text-white flex items-center justify-center hover:scale-105 transition-transform">
          <div className="text-center">
            <h2 className="text-xl font-semibold">Votes Cast</h2>
            <p className="text-3xl font-bold mt-2">1,245</p>
          </div>
        </div>
        <div className="bg-prime p-6 rounded-lg shadow-lg text-white flex items-center justify-center hover:scale-105 transition-transform">
  <div className="text-center">
    <h2 className="text-xl font-semibold">Election Progress</h2>
    <div className="flex flex-row justify-between ">

    <div className="w-full bg-gray-300 rounded-full mt-2 h-2 relative">
      {/* Progress bar */}
      <div 
        className="bg-gradient-to-r from-black to-black h-2 rounded-full transition-all duration-1000"
        style={{ width: `${progress}%` }}
      ></div>
<div className="mt-2">

      {/* Percentage text */}
      <span className="right-0 transform -translate-x-1/2 bottom-0 text-center text-white font-semibold">
        {progress}%
      </span>
</div>
    </div>
    </div>
  </div>
</div>

      </section>

      {/* Voter and Region Progress */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-lg text-prime hover:shadow-xl transition-shadow text-center">
          <h3 className="text-xl font-semibold">Voter Turnout</h3>
          <div className="w-full bg-gray-200 rounded-full mt-6 h-2 relative">
            <div 
              className="bg-prime h-2 rounded-full transition-all duration-1000"
              style={{ width: `${regionProgress}%` }}
            ></div>
            <span className="absolute top-0 right-0 text-white font-semibold">
              {regionProgress}%
            </span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg text-prime hover:shadow-xl transition-shadow text-center">
          <h3 className="text-xl font-semibold">Votes by Region</h3>
          <div>
            
          </div>
          <div className="w-full bg-gray-200 rounded-full mt-6 h-2 relative">
            <div 
              className="bg-prime h-2 rounded-full transition-all duration-1000"
              style={{ width: `${regionProgress}%` }}
            ></div>
            <span className="absolute top-0 right-0 text-white font-semibold">
              {regionProgress}%
            </span>
          </div>
        </div>
      </section>

      {/* Bar Chart Section */}
      <section className="bg-white p-6 w-30 rounded-lg shadow-lg mt-12">
        <h3 className="text-xl font-semibold text-teal-500 text-center">Votes by Region (Bar Chart)</h3>
        <div className="mt-4">
          <Bar data={data} options={options} />
        </div>
      </section>
    </DashboardLayout>
  );
}
