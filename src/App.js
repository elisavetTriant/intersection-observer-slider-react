import './App.scss';
import imageData from './data/images.json';

function App() {

  let isDown = false;
  let startX;
  let scrollLeft;

  const handleMouseEnter = function (e) {
    isDown = false;
    e.currentTarget.style.cursor = "grab";
  };

  const handleMouseDown = function (e) {
    isDown = true;
    e.currentTarget.classList.add("active");
    startX = e.pageX - e.currentTarget.offsetLeft;
    scrollLeft = e.currentTarget.scrollLeft;
    e.currentTarget.style.cursor = "grabbing";
  };

  const handleMouseLeave = function (e) {
    isDown = false;
    e.currentTarget.classList.remove("active");
    e.currentTarget.style.cursor = "default";
  };

  const handleMouseUp = function (e) {
    isDown = false;
    e.currentTarget.classList.remove("active");
    e.currentTarget.style.cursor = "grab";
  };

  const handleMouseMove = function (e) {
    if (!isDown) return;
    e.currentTarget.style.cursor = "grabbing";
    e.preventDefault();
    const x = e.pageX - e.currentTarget.offsetLeft;
    const SCROLL_SPEED = 3;
    const walk = (x - startX) * SCROLL_SPEED;
    e.currentTarget.scrollLeft = scrollLeft - walk;
  };

  return (
    <>
      <div className="gallery_wrapper slider-container">
        <ul className="inner-slider"
          onMouseEnter={(e) => handleMouseEnter(e)}
          onMouseDown={(e) => handleMouseDown(e)}
          onMouseLeave={(e) => handleMouseLeave(e)}
          onMouseUp={(e) => handleMouseUp(e)}
          onMouseMove={(e) => handleMouseMove(e)}
        >
          {imageData.children.map((imageSlide, index) => {
            return (
              <li className="card" key={index}>
                <img src={imageSlide.children[0].src} alt={imageSlide.children[0].alt} />{imageSlide.children[1]}
              </li>
            )
          })}
        </ul>
        <div className="indicatorsList">
          {
            imageData.children.map((imageSlideIndicator, index) => {
              return (
                <button className="indicator" key={index}>{index + 1}</button>
              )
            })}
        </div >
      </div>
    </>
  );
}

export default App;
