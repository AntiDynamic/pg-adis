import { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

const dummyRoommates = [
  { name: 'Person A', paid: false, customAmount: '' },
  { name: 'Person B', paid: false, customAmount: '' },
  { name: 'Person C', paid: false, customAmount: '' },
];

const roomTypes = [
  { label: 'Single', value: 1 },
  { label: 'Double', value: 2 },
  { label: 'Triple', value: 3 },
  { label: 'Shared', value: 4 },
];

export default function ExpensesPage() {
  const [roomType, setRoomType] = useState(roomTypes[1].value);
  const [numPeople, setNumPeople] = useState(2);
  const [expenses, setExpenses] = useState({
    Rent: '12000',
    Electricity: '1200',
    WiFi: '600',
    Water: '400',
    Food: '3000',
  });
  const [roommates, setRoommates] = useState(dummyRoommates);
  const [customTotal, setCustomTotal] = useState('');
  const total = customTotal
    ? parseInt(customTotal) || 0
    : Object.values(expenses).reduce((a, b) => a + (parseInt(b as string) || 0), 0);
  const perPerson = numPeople > 0 ? Math.round(total / numPeople) : 0;

  const handleExpenseChange = (key: string, value: string) => {
    setExpenses((prev) => ({ ...prev, [key]: value }));
  };

  const handlePaidToggle = (idx: number) => {
    setRoommates((prev) =>
      prev.map((r, i) => (i === idx ? { ...r, paid: !r.paid } : r))
    );
  };

  return (
    <div className="min-h-screen bg-dark-900 py-10">
      <div className="max-w-2xl mx-auto">
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-white">Shared Expenses</h2>
          <div className="mb-4 flex gap-4 flex-wrap">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Room Type</label>
              <select
                value={roomType}
                onChange={(e) => {
                  setRoomType(Number(e.target.value));
                  setNumPeople(Number(e.target.value));
                  setRoommates(dummyRoommates.slice(0, Number(e.target.value)));
                }}
                className="bg-[#23272f] text-white px-3 py-2 rounded-md border border-gray-700"
              >
                {roomTypes.map((rt) => (
                  <option key={rt.value} value={rt.value}>{rt.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Number of People</label>
              <Input
                type="number"
                value={numPeople.toString()}
                onChange={(e) => {
                  const val = Math.max(1, Math.min(10, Number(e.target.value)));
                  setNumPeople(val);
                  setRoommates(dummyRoommates.slice(0, val));
                }}
                className="w-24 bg-[#23272f] text-white"
              />
            </div>
          </div>

          <div className="mb-4 grid grid-cols-2 gap-3">
            {Object.entries(expenses).map(([key, value]) => (
              <div key={key}>
                <label className="block text-sm text-gray-300 mb-1">{key}</label>
                <Input
                  type="number"
                  value={value.toString()}
                  onChange={(e) => handleExpenseChange(key, e.target.value)}
                  className="w-full bg-[#23272f] text-white"
                />
              </div>
            ))}
            <div className="col-span-2">
              <label className="block text-sm text-gray-300 mb-1">Custom Total (overrides above)</label>
              <Input
                type="number"
                value={customTotal}
                onChange={(e) => setCustomTotal(e.target.value)}
                className="w-full bg-[#23272f] text-white"
                placeholder="Enter custom total expense"
              />
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between text-lg text-white font-semibold">
              <span>Total Expense</span>
              <span>₹{total}</span>
            </div>
            <div className="flex justify-between text-md text-gray-300 mt-1">
              <span>Number of People</span>
              <span>{numPeople}</span>
            </div>
            <div className="flex justify-between text-xl text-trust-400 mt-2 font-bold">
              <span>Amount per Person</span>
              <span>₹{perPerson}</span>
            </div>
            <div className="text-sm text-gray-400 mt-2">Each person needs to pay ₹{perPerson} this month.</div>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold text-white mb-2">Payment Status</h3>
            <div className="grid grid-cols-2 gap-3">
              {roommates.slice(0, numPeople).map((r, idx) => (
                <div key={r.name} className="flex items-center gap-2 bg-[#181c23] rounded-lg px-3 py-2">
                  <span className="flex-1 text-white">{r.name}</span>
                  <span className={`text-xs font-bold px-2 py-1 rounded ${r.paid ? 'bg-green-600 text-white' : 'bg-yellow-500 text-black'}`}>
                    {r.paid ? 'Paid' : 'Pending'}
                  </span>
                  <Button size="sm" variant="outline" onClick={() => handlePaidToggle(idx)}>
                    Mark {r.paid ? 'Pending' : 'Paid'}
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Optional: uneven split, warnings, etc. */}
        </Card>
      </div>
    </div>
  );
}
