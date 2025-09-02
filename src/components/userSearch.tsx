import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FaGithubAlt } from 'react-icons/fa';
import { fetchGithubUser } from '../api/github';

const UserSearch = () => {
  const [userName, setUserName] = useState('');
  const [submittedUserName, setSubmittedUserName] = useState('');

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['users', submittedUserName],
    queryFn: () => fetchGithubUser(submittedUserName),
    enabled: !!submittedUserName,
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmittedUserName(userName.trim());
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

      {data && (
        <div className='user-card'>
          <img src={data.avatar_url} alt={data.name} className='avatar' />
          <h2>{data.name || data.login}</h2>
          <p className='bio'>{data.bio}</p>
          <a
            href={data.html_url}
            className='profile-btn'
            target='_blank'
            rel='noopener noreferrer'
          >
            <FaGithubAlt /> View Github Profile
          </a>
        </div>
      )}
    </>
  );
};

export default UserSearch;
