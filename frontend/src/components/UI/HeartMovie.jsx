import { HeartIcon } from "@heroicons/react/20/solid";

function HeartMovie({ movie, favorited }) {
  const handleClick = () => {
    //Like or unlike
  };
  return (
    <HeartIcon
      onClick={handleClick}
      className={`size-6 cursor-pointer hover:text-red-500 ${
        favorited & "text-red-500"
      }`}
    />
  );
}

export default HeartMovie;
