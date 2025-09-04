import { useQuery, useMutation } from '@tanstack/react-query';
import { checkIfFollowing, followUser, unFollowUser } from '../api/github';
import { FaGithubAlt, FaUserMinus, FaUserPlus } from 'react-icons/fa';
import type { GithubUser } from '../types';
import { toast } from 'sonner';

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
      toast.success(`You are now following ${user.login}`);
      refetch();
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  // unfollow mutation
  const unFollowMutation = useMutation({
    mutationFn: () => unFollowUser(user.login),
    onSuccess: () => {
      toast.success(`You have unFollowed ${user.login}`);
      refetch();
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const handleFollow = () => {
    if (isFollowing) {
      //todo unfollow
      unFollowMutation.mutate();
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
          disabled={followMutation.isPending || unFollowMutation.isPending}
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
