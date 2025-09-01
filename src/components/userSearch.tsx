import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

const UserSearch = () => {
  const [userName, setUserName] = useState('');
  const [submittedUserName, setSubmittedUserName] = useState('');

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['users', submittedUserName],
    queryFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_GITHUB_API_URL}/users/${submittedUserName}`
      );
      if (!res.ok) throw new Error('User Not Found');
      const data = await res.json();
      console.log(data);
      return data;
    },
    enabled: !!submittedUserName,
  });

  return (
    <>
      <form className='form'>
        <input
          type='text'
          placeholder='Enter Github Username...'
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <button type='submit'>Search</button>
      </form>
    </>
  );
};

export default UserSearch;
