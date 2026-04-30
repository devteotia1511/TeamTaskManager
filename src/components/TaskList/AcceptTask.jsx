import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthProvider';
import { taskAPI } from '../../services/api';

const AcceptTask = ({ data }) => {
  const { fetchTasks } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      await taskAPI.updateStatus(data._id, 'completed');
      fetchTasks(); // Refresh tasks
    } catch (error) {
      console.error('Failed to complete task:', error);
      alert('Failed to complete task');
    } finally {
      setIsLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className='flex-shrink-0 h-full w-[300px] p-5 bg-yellow-400 rounded-xl'>
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
      <div className='mt-6'>
        <button
          onClick={handleComplete}
          disabled={isLoading}
          className='w-full bg-green-600 hover:bg-green-700 text-white rounded font-medium py-2 px-2 text-sm disabled:opacity-50'
        >
          {isLoading ? 'Completing...' : 'Mark Complete'}
        </button>
      </div>
    </div>
  );
};

export default AcceptTask;