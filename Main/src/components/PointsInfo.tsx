'use client';

import { useState } from 'react';

interface PointsInfoProps {
  currentPoints: number;
}

export default function PointsInfo({ currentPoints }: PointsInfoProps) {
  const [showDetails, setShowDetails] = useState(false);

  const earningOpportunities = [
    { action: 'Upload an item', points: 50, description: 'Get points for contributing to the community' },
    { action: 'Complete a swap', points: 100, description: 'Earn points when you successfully swap items' },
    { action: 'Daily login', points: 10, description: 'Log in daily to earn bonus points' },
    { action: 'Refer a friend', points: 200, description: 'Invite friends to join ReWear' },
    { action: 'Leave a review', points: 25, description: 'Share your experience after a swap' }
  ];

  const spendingOpportunities = [
    { action: 'Premium features', points: 500, description: 'Unlock advanced search and filters' },
    { action: 'Priority listing', points: 200, description: 'Boost your item to the top of search results' },
    { action: 'Verified badge', points: 1000, description: 'Get a verified seller badge' },
    { action: 'Extended item duration', points: 150, description: 'Keep your item listed longer' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Points System</h3>
        <div className="text-right">
          <p className="text-2xl font-bold text-green-600">{currentPoints}</p>
          <p className="text-sm text-gray-500">current points</p>
        </div>
      </div>

      <button
        onClick={() => setShowDetails(!showDetails)}
        className="text-blue-600 hover:text-blue-800 text-sm font-medium mb-4"
      >
        {showDetails ? 'Hide details' : 'How to earn & spend points'}
      </button>

      {showDetails && (
        <div className="space-y-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Earn Points</h4>
            <div className="space-y-2">
              {earningOpportunities.map((opportunity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{opportunity.action}</p>
                    <p className="text-xs text-gray-600">{opportunity.description}</p>
                  </div>
                  <span className="text-green-600 font-semibold">+{opportunity.points}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-3">Spend Points</h4>
            <div className="space-y-2">
              {spendingOpportunities.map((opportunity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{opportunity.action}</p>
                    <p className="text-xs text-gray-600">{opportunity.description}</p>
                  </div>
                  <span className="text-blue-600 font-semibold">-{opportunity.points}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h5 className="font-medium text-yellow-800 mb-2">💡 Tips</h5>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Points help you build trust in the community</li>
              <li>• Higher points often lead to more successful swaps</li>
              <li>• Be active to earn more points</li>
              <li>• Use points wisely for premium features</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
} 