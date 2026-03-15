'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

function clearAdminCookie() {
  document.cookie = 'admin_access=; path=/; max-age=0; SameSite=Lax';
}

export default function Admin() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const chartData = useMemo(() => {
    const days = Array.from({ length: 7 }).map((_, idx) => {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - (6 - idx));
      return date;
    });

    const counts = days.map((day) => {
      const start = new Date(day);
      const end = new Date(day);
      end.setDate(end.getDate() + 1);
      return users.filter((user) => {
        const created = new Date(user.createdAt);
        return created >= start && created < end;
      }).length;
    });

    const maxCount = Math.max(...counts, 1);
    return days.map((day, index) => ({
      label: day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: counts[index],
      pct: counts[index] / maxCount,
    }));
  }, [users]);

  const totalUsers = users.length;
  const todayUsers = chartData[chartData.length - 1]?.value ?? 0;

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await fetch('/api/admin/users');
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        } else {
          setError('Failed to fetch users.');
        }
      } catch (err) {
        setError('Network error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const countryBreakdown = useMemo(() => {
    const counts = {
      '+250': 0,
      '+256': 0,
      '+254': 0,
      '+255': 0,
      '+257': 0,
      other: 0,
    };

    users.forEach((user) => {
      const match = user.phoneNumber.match(/^\+\d{3}/);
      if (match && counts[match[0]] !== undefined) {
        counts[match[0]] += 1;
      } else {
        counts.other += 1;
      }
    });

    const total = users.length || 1;

    return Object.entries(counts).map(([code, count]) => ({
      code,
      count,
      percent: Math.round((count / total) * 100),
    }));
  }, [users]);

  const downloadVCF = () => {
    window.open('/api/admin/download', '_blank');
  };

  const handleLogout = () => {
    clearAdminCookie();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-500 mt-1">Overview of recent registrations.</p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={downloadVCF}
                className="w-full sm:w-auto bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Download Contacts (VCF)
              </button>
              <button
                onClick={handleLogout}
                className="w-full sm:w-auto bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Exit Admin
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-800 p-4 rounded-lg mb-6 border border-red-200">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading users...</p>
            </div>
          ) : (
            <>
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-6">
                <div className="bg-indigo-50 rounded-lg p-5">
                  <div className="text-sm font-medium text-indigo-700">Total users</div>
                  <div className="mt-2 text-3xl font-semibold text-indigo-900">{totalUsers}</div>
                </div>
                <div className="bg-indigo-50 rounded-lg p-5">
                  <div className="text-sm font-medium text-indigo-700">New today</div>
                  <div className="mt-2 text-3xl font-semibold text-indigo-900">{todayUsers}</div>
                </div>
                <div className="bg-indigo-50 rounded-lg p-5">
                  <div className="text-sm font-medium text-indigo-700">Last 7 days</div>
                  <div className="mt-2 text-3xl font-semibold text-indigo-900">{chartData.reduce((sum, item) => sum + item.value, 0)}</div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">New users (last 7 days)</h2>
                  <span className="text-xs text-gray-500">Live</span>
                </div>

                <div className="flex flex-wrap items-end gap-3 h-40">
                  {chartData.map((data) => (
                    <div key={data.label} className="flex-1 min-w-[60px] flex flex-col items-center">
                      <div
                        className="w-full rounded-t-lg bg-indigo-500"
                        style={{ height: `${Math.max(10, data.pct * 100)}%` }}
                      />
                      <div className="mt-2 text-xs text-gray-600 text-center">{data.label}</div>
                      <div className="text-xs font-medium text-gray-700">{data.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Country distribution</h2>
                  <span className="text-xs text-gray-500">By phone prefix</span>
                </div>

                <div className="space-y-3">
                  {countryBreakdown.map((item) => (
                    <div key={item.code} className="flex items-center gap-3">
                      <div className="w-24 text-xs text-gray-600">
                        {item.code === 'other' ? 'Other' : item.code}
                      </div>
                      <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                        <div className="h-full bg-indigo-500" style={{ width: `${item.percent}%` }} />
                      </div>
                      <div className="w-12 text-right text-xs font-medium text-gray-700">
                        {item.count}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[540px] table-auto border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                        Username
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                        Phone Number
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                        Registration Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="px-6 py-8 text-center text-gray-500">
                          No users found
                        </td>
                      </tr>
                    ) : (
                      users.map((user, index) => (
                        <tr key={user._id || index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {user.username}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {user.phoneNumber}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(user.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 text-center text-sm text-gray-500">
                Total users: {users.length}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
