import React from 'react';

const FailedTask = ({ data }) => {
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className='flex-shrink-0 h-full w-[300px] p-5 bg-red-300 rounded-xl'>
      <div className='flex justify-between items-center'>
        <h3 className='bg-red-600 text-white text-sm px-3 py-1 rounded'>{data.category}</h3>
        <h4 className='text-sm text-gray-800'>{formatDate(data.dueDate)}</h4>
      </div>
      <h2 className='mt-5 text-2xl font-semibold text-gray-900'>{data.title}</h2>
      <p className='text-sm mt-2 text-gray-700'>{data.description}</p>
      {data.priority && (
        <div className='mt-2'>
          <span className={`text-xs px-2 py-1 rounded ${
            data.priority === 'urgent' ? 'bg-red-600 text-white' :
            data.priority === 'high' ? 'bg-orange-500 text-white' :
            data.priority === 'medium' ? 'bg-yellow-500 text-black' :
            'bg-gray-500 text-white'
          }`}>
            {data.priority}
          </span>
        </div>
      )}
      {data.isOverdue && (
        <div className='mt-2'>
          <span className='text-xs px-2 py-1 rounded bg-red-600 text-white'>
            Overdue
          </span>
        </div>
      )}
      <div className='mt-6'>
        <button className='w-full bg-red-600 text-white rounded font-medium py-2 px-2 text-sm' disabled>
          Failed
        </button>
      </div>
    </div>
  );
};

export default FailedTask;