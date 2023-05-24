import EditInput from "../../utils/EditInput";

const Settings = () => {
  return (
    <>
      <div className="w-3/4">
        <label>Edit profile</label>
        <div className="relative h-44 mb-8 ">
          <div src="" alt="Banner" className="w-full h-36  bg-red-500  "></div>
          <img
            className="w-32 h-32 rounded-full absolute top-14 left-2"
            src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
            alt="user photo"
          />
        </div>
        <div className="flex flex-col items-center m-auto gap-2 w-full md:w-1/2 ">
          <EditInput />
          <EditInput />
        </div>
      </div>
      <button>Logout</button>
    </>
  );
};

export default Settings;
