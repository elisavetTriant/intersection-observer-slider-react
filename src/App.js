import './App.scss';
import imageData from './data/images.json';
import { useRef, useState, useEffect } from 'react';

function App() {

  const [imgsLoaded, setImgsLoaded] = useState(false)

  const rootRef = useRef(null)
  const itemsRef = useRef(null)
  const indicatorsRef = useRef(null)


  useEffect(() => {

    //PRELOADER
    const loadImage = image => {
      return new Promise((resolve, reject) => {
        const loadImg = new Image()
        loadImg.src = image.children[0].src
        loadImg.onload = () => resolve(image.children[0].src)
        loadImg.onerror = err => reject(err)
      })
    }

    Promise.all(imageData.children.map(image => loadImage(image)))
      .then(() => {
        setImgsLoaded(true);
      })
      .catch(err => console.log("Failed to load images", err))

  }, [])

  useEffect(() => {

    //OBSERVER FUNCTIONALITY
    const observer = new IntersectionObserver(
      (entries) => {
        const indicatorsMap = getIndicatorsMap()

        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active")
            const currentIndex = Array.from(rootRef.current.children).indexOf(entry.target)
            indicatorsMap.get(currentIndex).classList.add("active")
          } else {
            entry.target.classList.remove("active")
            const currentIndex = Array.from(rootRef.current.children).indexOf(entry.target)
            indicatorsMap.get(currentIndex).classList.remove("active")

          }
        })
      }
      ,
      { root: rootRef.current, rootMargin: "0px", threshold: 0.85 }

    );
    const map = getItemsMap();
    // observe each item
    for (let item of map.values()) {
      observer.observe(item);
    }

    return () => observer.disconnect();

  }, [])


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

  function scrollToId(itemId) {
    const map = getItemsMap();
    const node = map.get(itemId);
    node.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "center"
    })
  }

  //Helper
  function getItemsMap() {
    if (!itemsRef.current) {
      // Initialize the Map on first usage.
      itemsRef.current = new Map();
    }
    return itemsRef.current;
  }

  function getIndicatorsMap() {
    if (!indicatorsRef.current) {
      indicatorsRef.current = new Map();
    }
    return indicatorsRef.current;
  }

  return (
    imgsLoaded ?
      <>
        <div id="slider" className="gallery-wrapper slider-container">
          <ul ref={rootRef} id="gallery" className="inner-slider"
            onMouseEnter={(e) => handleMouseEnter(e)}
            onMouseDown={(e) => handleMouseDown(e)}
            onMouseLeave={(e) => handleMouseLeave(e)}
            onMouseUp={(e) => handleMouseUp(e)}
            onMouseMove={(e) => handleMouseMove(e)}
          >
            {imageData.children.map((imageSlide, index) => {
              return (
                <li
                  className={imgsLoaded ? "fade-in card" : "card"}
                  key={index}
                  ref={(node) => {
                    //https://react.dev/learn/manipulating-the-dom-with-refs#how-to-manage-a-list-of-refs-using-a-ref-callback
                    const map = getItemsMap();
                    if (node) {
                      map.set(index, node);
                    } else {
                      map.delete(index);
                    }
                  }}

                >
                  <img src={imageSlide.children[0].src} alt={imageSlide.children[0].alt} />
                  {imageSlide.children[1]}
                </li>
              )
            })}
          </ul>

          <div className="indicators-list">
            {
              imageData.children.map((imageSlide, index) => {
                return (
                  <button
                    className="indicator"
                    key={index}
                    onClick={() => scrollToId(index)}
                    ref={(node) => {
                      const map = getIndicatorsMap();
                      if (node) {
                        map.set(index, node);
                      } else {
                        map.delete(index);
                      }
                    }}
                  >
                    {index + 1}
                  </button>
                )
              })}
          </div >
        </div>
      </> :
      <div className="loading-wrapper">
        <h1>Loading images...</h1>
      </div>
  );
}

export default App;
