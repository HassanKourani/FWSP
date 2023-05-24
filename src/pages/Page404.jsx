import cuteness from "../images/cute-astronaut.png";
// import "./Stars.css";

const Page404 = () => {
  return (
    <>
      <div className="h-screen w-full flex flex-col justify-center items-center main">
        <img src={cuteness} alt="Cuteness" />

        <h1 className="text-5xl font-extrabold text-purple-500 ">Ooooops!</h1>

        <h1 className="text-3xl text-blue-300">Something went wrong.</h1>
      </div>
    </>
  );
};

export default Page404;
