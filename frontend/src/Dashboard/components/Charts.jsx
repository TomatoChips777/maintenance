import React, { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import { Form } from 'react-bootstrap';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#a6cee3', '#b2df8a'];

const Charts = ({ type, data }) => {
  const [timeframe, setTimeframe] = useState('day');

  if (!data || data.length === 0) return <p className="text-muted">No data available.</p>;

  const renderTimeframeSelector = () => (
    <Form.Select value={timeframe} onChange={(e) => setTimeframe(e.target.value)} style={{ width: '150px' }}>
      <option value="day">Per Day</option>
      <option value="week">Per Week</option>
      <option value="month">Per Month</option>
      <option value="year">Per Year</option>
    </Form.Select>
  );

  const groupByTimeframe = (records, dateField) => {
    return records.reduce((acc, record) => {
      const dateObj = new Date(record[dateField]);
      let key;
      switch (timeframe) {
        case 'week':
          const startOfWeek = new Date(dateObj);
          startOfWeek.setDate(dateObj.getDate() - dateObj.getDay());
          key = startOfWeek.toLocaleDateString();
          break;
        case 'month':
          key = `${dateObj.getFullYear()}-${dateObj.getMonth() + 1}`;
          break;
        case 'year':
          key = `${dateObj.getFullYear()}`;
          break;
        default:
          key = dateObj.toLocaleDateString();
      }
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
  };

  if (type === 'borrowingFrequency') {
    const groupedData = groupByTimeframe(data, 'created_at');
    const chartData = Object.entries(groupedData)
      .map(([key, count]) => ({ date: key, count }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
    const total = chartData.reduce((sum, item) => sum + item.count, 0);
    const firstDate = chartData[0]?.date || '';
    const lastDate = chartData.at(-1)?.date || '';

    return (
      <>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <p className="mb-0 text-muted">
            <strong>Total Reports:</strong> {total} | <strong>Date Range:</strong> {firstDate} – {lastDate}
          </p>
          {renderTimeframeSelector()}
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </>
    );
  }

  if (type === 'mostBorrowedItems') {
    const itemCounts = data.reduce((acc, record) => {
      acc[record.item_name] = (acc[record.item_name] || 0) + 1;
      return acc;
    }, {});
    const chartData = Object.entries(itemCounts).map(([name, value]) => ({ name, value }));

    return (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={chartData} dataKey="value" nameKey="name" outerRadius={120} label>
            {chartData.map((_, idx) => (
              <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    );
  }

  // if (type === 'inventoryStatus') {
  //   const statusCounts = data.reduce((acc, item) => {
  //     acc[item.status] = (acc[item.status] || 0) + 1;
  //     return acc;
  //   }, {});
  //   const statusChartData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
  
  //   const categoryCounts = data.reduce((acc, item) => {
  //     const category = item.category || 'Uncategorized';
  //     acc[category] = (acc[category] || 0) + 1;
  //     return acc;
  //   }, {});
  //   const categoryChartData = Object.entries(categoryCounts).map(([name, value]) => ({ name, value }));
  
  //   return (
  //     <div className="d-flex flex-column flex-md-row justify-content-around gap-4">
  //       <div style={{ flex: 1 }}>
  //         <h6 className="text-center">Inventory Status</h6>
  //         <ResponsiveContainer width="100%" height={300}>
  //           <PieChart>
  //             <Pie data={statusChartData} dataKey="value" nameKey="name" outerRadius={100} label>
  //               {statusChartData.map((_, idx) => (
  //                 <Cell key={`status-${idx}`} fill={COLORS[idx % COLORS.length]} />
  //               ))}
  //             </Pie>
  //             <Tooltip />
  //           </PieChart>
  //         </ResponsiveContainer>
  //       </div>
  //       <div style={{ flex: 1 }}>
  //         <h6 className="text-center">Category Distribution</h6>
  //         <ResponsiveContainer width="100%" height={300}>
  //           <PieChart>
  //             <Pie data={categoryChartData} dataKey="value" nameKey="name" outerRadius={100} label>
  //               {categoryChartData.map((_, idx) => (
  //                 <Cell key={`category-${idx}`} fill={COLORS[idx % COLORS.length]} />
  //               ))}
  //             </Pie>
  //             <Tooltip />
  //           </PieChart>
  //         </ResponsiveContainer>
  //       </div>
  //     </div>
  //   );
  // }
  
  if (type === 'inventoryStatus') {
    const statusCounts = data.reduce((acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    }, {});
    const statusChartData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
  
    const categoryCounts = data.reduce((acc, item) => {
      const category = item.category || 'Uncategorized';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});
    const categoryChartData = Object.entries(categoryCounts).map(([name, value]) => ({ name, value }));
  
    return (
      <div className="d-flex flex-column flex-md-row justify-content-around gap-4">
        <div style={{ flex: 1 }}>
          <h6 className="text-center">Inventory Status</h6>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusChartData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
              >
                {statusChartData.map((_, idx) => (
                  <Cell key={`status-${idx}`} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend layout="horizontal" verticalAlign="bottom" align="center" />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div style={{ flex: 1 }}>
          <h6 className="text-center">Category Distribution</h6>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryChartData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
              >
                {categoryChartData.map((_, idx) => (
                  <Cell key={`category-${idx}`} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend layout="horizontal" verticalAlign="bottom" align="center" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }
  

  if (type === 'borrowingByDepartment') {
    const grouped = data.reduce((acc, record) => {
      acc[record.department] = (acc[record.department] || 0) + 1;
      return acc;
    }, {});
    const chartData = Object.entries(grouped).map(([name, value]) => ({ name, value }));
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    );
  }

  if (type === 'topAssistants') {
    const grouped = data.reduce((acc, record) => {
      acc[record.assisted_by] = (acc[record.assisted_by] || 0) + 1;
      return acc;
    }, {});
    const chartData = Object.entries(grouped).map(([name, value]) => ({ name, value }));
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#ffc658" />
        </BarChart>
      </ResponsiveContainer>
    );
  }

  if (type === 'eventFrequency') {
    const grouped = groupByTimeframe(data, 'event_date');
    const chartData = Object.entries(grouped).map(([key, value]) => ({ name: key, value }));
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#a6cee3" />
        </BarChart>
      </ResponsiveContainer>
    );
  }

  if (type === 'itemStatusOverTime') {
    const grouped = {};
    data.forEach(item => {
      const date = new Date(item.created_at);
      const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
      if (!grouped[key]) grouped[key] = {};
      grouped[key][item.status] = (grouped[key][item.status] || 0) + 1;
    });
    const chartData = Object.entries(grouped).map(([key, statuses]) => ({ date: key, ...statuses }));
    const uniqueStatuses = Array.from(new Set(data.map(i => i.status)));
    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          {uniqueStatuses.map((status, idx) => (
            <Line key={status} type="monotone" dataKey={status} stroke={COLORS[idx % COLORS.length]} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    );
  }

  if (type === 'borrowingDurationDistribution') {
    const durations = data.map(record => {
      const start = new Date(record.borrow_date);
      const end = record.returned_date ? new Date(record.returned_date) : new Date();
      return Math.round((end - start) / (1000 * 60 * 60 * 24));
    });
    const buckets = { '0-1': 0, '2-3': 0, '4-7': 0, '8+': 0 };
    durations.forEach(days => {
      if (days <= 1) buckets['0-1']++;
      else if (days <= 3) buckets['2-3']++;
      else if (days <= 7) buckets['4-7']++;
      else buckets['8+']++;
    });
    const chartData = Object.entries(buckets).map(([name, value]) => ({ name, value }));
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#ff7f50" />
        </BarChart>
      </ResponsiveContainer>
    );
  }
  if (type === 'borrowerRanking') {
    const colors = [
      '#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#8dd1e1',
      '#a4de6c', '#d0ed57', '#d88884', '#888888', '#c6b4ce'
    ];
  
    const chartData = data
      .map((record, index) => ({
        borrower: `User ${index + 1}`,
        name: record.borrower_name,
        count: parseInt(record.borrow_count, 10),
        fill: colors[index % colors.length] // cycle through colors if more than 10
      }))
      .slice(0, 10);
  
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="borrower" label={{ value: 'Borrowers Rank', position: 'insideBottom', offset: -5 }} />
          <YAxis label={{ value: 'Borrow Count', angle: -90, position: 'insideLeft' }} />
          <Tooltip
            formatter={(value, name, props) => [`${value} times`, 'Borrowed']}
            labelFormatter={(label, payload) => `${payload[0]?.payload?.name}`}
          />
          <Bar dataKey="count">
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  }
  
  if (type === 'assistFrequency') {
    const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#8dd1e1', '#a4de6c'];
  
    const chartData = data
      .map((record, index) => ({
        assistant: `Staff ${index + 1}`,
        name: record.assisted_by,
        count: parseInt(record.assist_count, 10),
        fill: colors[index % colors.length]
      }));
  
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="assistant" />
          <YAxis />
          <Tooltip
            formatter={(value) => [`${value} assists`, 'Assisted']}
            labelFormatter={(label, payload) => `${payload[0]?.payload?.name}`}
          />
          <Bar dataKey="count">
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  }
  
  return <p className="text-muted">Invalid chart type.</p>;
};

export default Charts;
