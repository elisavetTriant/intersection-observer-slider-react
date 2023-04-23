import './App.scss';
import imageData from './data/images.json';
import { useRef } from 'react';


function App() {

  const itemsRef = useRef(null);

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

  //Scroll to the specific element, through the indicators/buttons

  function getMap() {
    if (!itemsRef.current) {
      // Initialize the Map on first usage.
      itemsRef.current = new Map();
    }
    return itemsRef.current;
  }


  function scrollToId(itemId) {
    const map = getMap();
    const node = map.get(itemId);
    node.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "center"
    })
  }

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
              <li 
              className="card" 
              key={index} 
              ref={(node) => {
                //https://react.dev/learn/manipulating-the-dom-with-refs#how-to-manage-a-list-of-refs-using-a-ref-callback
                const map = getMap();
                if (node) {
                  map.set(index, node);
                } else {
                  map.delete(index);
                }
              }}>
                <img src={imageSlide.children[0].src} alt={imageSlide.children[0].alt} />{imageSlide.children[1]}
              </li>
            )
          })}
        </ul>
        <div className="indicatorsList">
          {
            imageData.children.map((imageSlide, index) => {
              return (
                <button className="indicator" key={index} onClick={() => scrollToId(index)}>{index + 1}</button>
              )
            })}
        </div >
      </div>
    </>
  );
}

export default App;
