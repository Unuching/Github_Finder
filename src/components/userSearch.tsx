import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import UserCard from './userCard';
import RecentSearches from './recentsearches';

import { fetchGithubUser } from '../api/github';

const UserSearch = () => {
  const [userName, setUserName] = useState('');
  const [submittedUserName, setSubmittedUserName] = useState('');
  const [recentUsers, setRecentUsers] = useState<string[]>([]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['users', submittedUserName],
    queryFn: () => fetchGithubUser(submittedUserName),
    enabled: !!submittedUserName,
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = userName.trim();
    if (!trimmed) return;

    setSubmittedUserName(trimmed);

    setRecentUsers((prev) => {
      const updated = [trimmed, ...prev.filter((u) => u !== trimmed)];
      return updated.slice(0, 5);
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit} className='form'>
        <input
          type='text'
          placeholder='Enter Github Username...'
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <button type='submit'>Search</button>
      </form>
      {isLoading && <p className='status'>Loading...</p>}
      {isError && <p className='status error'>{error.message}</p>}

      {data && <UserCard user={data} />}
      {recentUsers.length > 0 && (
        <RecentSearches
          users={recentUsers}
          onSelect={(userName) => {
            setUserName(userName);
            setSubmittedUserName(userName);
          }}
        />
      )}
    </>
  );
};

export default UserSearch;
