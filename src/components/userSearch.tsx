import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import UserCard from './userCard';
import RecentSearches from './recentsearches';
import { useDebounce } from 'use-debounce';
import { fetchGithubUser, searchGithubUser } from '../api/github';
import SuggestionDropdown from './suggestionDropdown';
import type { GithubUser } from '../types';

const UserSearch = () => {
  const [userName, setUserName] = useState('');
  const [submittedUserName, setSubmittedUserName] = useState('');
  const [recentUsers, setRecentUsers] = useState<string[]>(() => {
    const stored = localStorage.getItem('recentUsers');
    return stored ? JSON.parse(stored) : [];
  });

  const [debouncedUsername] = useDebounce(userName, 300);

  const [showSuggestions, setShowSuggestions] = useState(false);
  // query to search specific user
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['users', submittedUserName],
    queryFn: () => fetchGithubUser(submittedUserName),
    enabled: !!submittedUserName,
  });

  // query to get multiple user suggestions
  const { data: suggestions } = useQuery({
    queryKey: ['github-user-suggestions', debouncedUsername],
    queryFn: () => searchGithubUser(debouncedUsername),
    enabled: debouncedUsername.length > 1,
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = userName.trim();
    if (!trimmed) return;

    setSubmittedUserName(trimmed);
    setUserName('');

    setRecentUsers((prev) => {
      const updated = [trimmed, ...prev.filter((u) => u !== trimmed)];
      return updated.slice(0, 5);
    });
  };

  useEffect(() => {
    localStorage.setItem('recentUsers', JSON.stringify(recentUsers));
  }, [recentUsers]);

  return (
    <>
      <form onSubmit={handleSubmit} className='form'>
        <div className='dropdown-wrapper'>
          <input
            type='text'
            placeholder='Enter Github Username...'
            value={userName}
            onChange={(e) => {
              const val = e.target.value;
              setUserName(val);
              setShowSuggestions(val.trim().length > 1);
            }}
          />

          {showSuggestions && suggestions?.length > 0 && (
            <SuggestionDropdown
              suggestions={suggestions}
              show={showSuggestions}
              onSelect={(selected) => {
                setUserName(selected);
                setShowSuggestions(false);
                if (submittedUserName !== selected) {
                  setSubmittedUserName(selected);
                  setUserName('');
                } else {
                  refetch();
                }
                setRecentUsers((prev) => {
                  const updated = [
                    selected,
                    ...prev.filter((u) => u !== selected),
                  ];
                  return updated.slice(0, 5);
                });
              }}
            />
          )}
        </div>

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
