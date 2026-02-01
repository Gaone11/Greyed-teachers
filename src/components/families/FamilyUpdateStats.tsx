import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { Calendar, Users, Mail, TrendingUp } from 'lucide-react';

interface FamilyUpdateStatsProps {
  stats: {
    totalUpdates: number;
    totalSent: number;
    averageOpenRate: number;
    weeklyStats: {
      week: string;
      sent: number;
      opened: number;
    }[];
  };
}

const FamilyUpdateStats: React.FC<FamilyUpdateStatsProps> = ({ stats }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold text-black mb-6">Family Update Analytics</h2>
      
      {/* Summary metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-greyed-navy/5 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <Mail className="w-5 h-5 text-greyed-blue mr-2" />
            <h3 className="font-medium text-black">Total Updates</h3>
          </div>
          <p className="text-2xl font-semibold text-black">{stats.totalUpdates}</p>
        </div>
        
        <div className="bg-greyed-navy/5 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <Calendar className="w-5 h-5 text-greyed-blue mr-2" />
            <h3 className="font-medium text-black">Updates Sent</h3>
          </div>
          <p className="text-2xl font-semibold text-black">{stats.totalSent}</p>
        </div>
        
        <div className="bg-greyed-navy/5 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <Users className="w-5 h-5 text-greyed-blue mr-2" />
            <h3 className="font-medium text-black">Open Rate</h3>
          </div>
          <p className="text-2xl font-semibold text-black">{stats.averageOpenRate}%</p>
        </div>
        
        <div className="bg-greyed-navy/5 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <TrendingUp className="w-5 h-5 text-greyed-blue mr-2" />
            <h3 className="font-medium text-black">Trend</h3>
          </div>
          <p className="text-2xl font-semibold text-black">
            {stats.weeklyStats.length > 1 && 
             stats.weeklyStats[stats.weeklyStats.length - 1].opened > 
             stats.weeklyStats[stats.weeklyStats.length - 2].opened ? '↑' : '↓'}
          </p>
        </div>
      </div>
      
      {/* Weekly chart */}
      <div className="mb-6">
        <h3 className="font-medium text-black mb-4">Weekly Engagement</h3>
        
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={stats.weeklyStats}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sent" name="Updates Sent" fill="#212754" />
              <Bar dataKey="opened" name="Updates Opened" fill="#bbd7eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Tips */}
      <div className="bg-greyed-blue/10 p-4 rounded-lg">
        <h3 className="font-medium text-black mb-2">Tips to Improve Engagement</h3>
        <ul className="space-y-1 text-sm text-black/80">
          <li>• Send updates consistently on the same day of the week</li>
          <li>• Include visually engaging content and student work samples</li>
          <li>• Keep content concise and actionable for families</li>
          <li>• Include specific calls to action for parent involvement</li>
        </ul>
      </div>
    </div>
  );
};

export default FamilyUpdateStats;