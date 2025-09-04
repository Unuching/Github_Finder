import { useQuery, useMutation } from '@tanstack/react-query';
import { checkIfFollowing, followUser } from '../api/github';
import { FaGithubAlt, FaUserMinus, FaUserPlus } from 'react-icons/fa';
import type { GithubUser } from '../types';

const UserCard = ({ user }: { user: GithubUser }) => {
  const { data: isFollowing, refetch } = useQuery({
    queryKey: ['folow-status', user.login],
    queryFn: () => checkIfFollowing(user.login),
    enabled: !!user.login,
  });
  // mutation to follow user
  const followMutation = useMutation({
    mutationFn: () => followUser(user.login),
    onSuccess: () => {
      console.log(`You are now following ${user.login}`);
      refetch();
    },
    onError: (err) => {
      console.error(err.message);
    },
  });

  const handleFollow = () => {
    if (isFollowing) {
      //todo unfollow
    } else {
      followMutation.mutate();
    }
  };
  return (
    <div className='user-card'>
      <img src={user.avatar_url} alt={user.name} className='avatar' />
      <h2>{user.name || user.login}</h2>
      <p className='bio'>{user.bio}</p>
      <div className='user-card-buttons'>
        <button
          onClick={handleFollow}
          className={`follow-btn ${isFollowing ? 'following' : ''} `}
        >
          {isFollowing ? (
            <>
              <FaUserMinus className='follow-icon' />
              Following
            </>
          ) : (
            <>
              <FaUserPlus className='follow-icon' />
              Follow User
            </>
          )}
        </button>
        <a
          href={user.html_url}
          className='profile-btn'
          target='_blank'
          rel='noopener noreferrer'
        >
          <FaGithubAlt /> View Github Profile
        </a>
      </div>
    </div>
  );
};

export default UserCard;
