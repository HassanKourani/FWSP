import Astronaut from "../images/cute-astronaut.png";

const EmptyPage = ({ message }) => {
  return (
    <>
      <div className="flex flex-col justify-center items-center opacity-50">
        <img src={Astronaut} alt="sad astronaut" />
        <span className="text-3xl text-purple-500 ">{message}</span>
      </div>
    </>
  );
};

export default EmptyPage;
