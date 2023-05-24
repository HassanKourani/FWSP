import "./MobileBurger.css";

const MobileBurger = ({ setIsBurgerOpen, isBurgerOpen }) => {
  return (
    <>
      <div>
        <input
          type="checkbox"
          id="checkbox"
          onClick={() => setIsBurgerOpen(!isBurgerOpen)}
          checked={isBurgerOpen}
        />
        <label htmlFor="checkbox" className="toggle">
          <div className="bars" id="bar1" />
          <div className="bars" id="bar2" />
          <div className="bars" id="bar3" />
        </label>
      </div>
    </>
  );
};

export default MobileBurger;
