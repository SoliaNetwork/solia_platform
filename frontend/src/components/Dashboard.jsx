export default function Dashboard() {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Admin</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-900 p-6 rounded-xl">
        <StatCard label="Total Users" value="1,250" />
        <StatCard label="Total SOLIA Mined" value="57,320" />
        <StatCard label="Daily Active" value="845" />
        <StatCard label="Mining Streak" value="62%" />
      </div>

      {/* Users Table */}
      <div className="bg-gray-900 p-6 rounded-xl">
        <h3 className="text-xl font-semibold mb-4">Users</h3>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Search users"
            className="w-full p-2 bg-gray-800 text-white border border-gray-700 rounded"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-gray-400 border-b border-gray-700">
              <tr>
                <th className="py-2">Email</th>
                <th className="py-2">Balance</th>
                <th className="py-2">Referral Code</th>
                <th className="py-2">Referred Users</th>
                <th className="py-2">Mining Streak</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  email: 'john.doe@example.com',
                  balance: '120 SOLIA',
                  code: 'ABC123',
                  users: 5,
                  streak: '7 days',
                },
                {
                  email: 'jane.smith@example.com',
                  balance: '95 SOLIA',
                  code: 'XYZ799',
                  users: 0,
                  streak: '0 s',
                },
                {
                  email: 'alex.jones@example.com',
                  balance: '210 SOLIA',
                  code: 'LMN456',
                  users: 3,
                  streak: '2 days',
                },
                {
                  email: 'emily.white@example.com',
                  balance: '75 SOLIA',
                  code: 'FGH234',
                  users: 1,
                  streak: '5 days',
                },
              ].map((user, index) => (
                <tr key={index} className="border-b border-gray-800">
                  <td className="py-2">{user.email}</td>
                  <td className="py-2">{user.balance}</td>
                  <td className="py-2 text-blue-400">{user.code}</td>
                  <td className="py-2">{user.users}</td>
                  <td className="py-2">{user.streak}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-gray-800 p-4 rounded-lg text-center">
      <p className="text-gray-400 text-sm">{label}</p>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
}
