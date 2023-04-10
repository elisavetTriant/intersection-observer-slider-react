import './App.scss';
import imageData from './data/images.json';

function App() {

  return (
    <>
      <div className="gallery_wrapper slider-container">
        <ul className="inner-slider">
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
                <button className="indicator" key={index}>{index+1}</button>
              )
            })}
        </div >
      </div>
    </>
  );
}

export default App;
