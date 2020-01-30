import React, {Component} from 'react'
import * as StackBlur from 'stackblur-canvas';
import './styles.css'; 

class SlothImg extends React.Component {
  constructor(props) {
    super(props);
    this._memoization = {};
    this.blurDelay = 100;
    this.blurRadius = 7;
    this.ref = React.createRef();
  }
  componentDidMount() {
    const wrapper = this;
    window.addEventListener('scroll', () => {
      if(wrapper._isElementInViewport(wrapper.ref) && this._memoization[wrapper.name] !== 'in') {
        this._memoization[wrapper.name] = 'in'
        this._loadImage()
      }
    });
    setTimeout(()=>{
      this.init();
    }, 0)
  }

  _canvasBlur(options) {
    const {thumbnail, blurRadius, context, canvas, wrapper} = options; 
    //The aspect-ratio-fill padding is set here.
    var aspectRatioFill = wrapper.aspectRatioFill;
    var percentage = (thumbnail.naturalHeight / thumbnail.naturalWidth) * 100;
    aspectRatioFill.style.paddingBottom = `${percentage}%`;

    //Draw the thumbnail onto the canvas, then blur it
    drawThumbnail(blurRadius);

    //Draws the thumbnail into the canvas and blurs it
    function drawThumbnail(blur) {
      context
        .drawImage(thumbnail, 0, 0, thumbnail.naturalWidth,
                  thumbnail.naturalHeight, 0, 0, canvas.width, canvas.height);
      StackBlur.canvasRGBA(canvas, 0, 0, canvas.width, canvas.height, blur);
    }
  }

  init() {
    const canvas = this.progressiveMedia__canvas;

    const args = {
      thumbnail: this.progressiveMedia__thumbnail,
      blurRadius: this.blurRadius,
      context: canvas.getContext('2d'),
      wrapper: this,
      canvas: canvas,
    }
    if(args.thumbnail.complete) {
      return this._canvasBlur(args)
    }

    args.thumbnail.addEventListener('load', () => {
      return this._canvasBlur(args)
    })

  }

  _loadImage() {
    const blurdelay = this.blurDelay;//The delay to see the fade in.
    var component = this.progressiveMedia;
    var image     = this.progressiveMedia__image;
    //Load the image in. Once it's loaded, add a class to the component wrapper that fades in the image and fades out the canvas element.
    image.src = image.dataset.src;
    image.addEventListener('load', function onImageLoaded() {
      image.removeEventListener('load', onImageLoaded);
      
      // This delay is only set so the we can see the blur effect more clearly on page load  
      setTimeout(function () {
        component.classList.add('isImageLoaded');
      }, blurdelay);		
    });
  }
  
  _isElementInViewport(el) {
    const rect = this.wrapper.getBoundingClientRect();
    return (
        rect.y <= window.innerHeight
    );
  }

  render() {
    console.log(this.props);
    const { datasrc, datathumbnail, alt } = this.props;

    return (
      <section className="wrapper" ref={elem => this.wrapper = elem}>
        <div className="aspect-ratio-fill" ref={elem => this.aspectRatioFill = elem}>
          <div className="progressiveMedia" ref={elem => this.progressiveMedia = elem}>
            <canvas className="progressiveMedia__canvas" ref={elem => this.progressiveMedia__canvas = elem} width="75" height="38.671875"></canvas>
            <img className="progressiveMedia__image" ref={elem => this.progressiveMedia__image = elem} data-src={datasrc} alt={alt}/>
            <img className="progressiveMedia__thumbnail" ref={elem => this.progressiveMedia__thumbnail = elem} src={datathumbnail} alt={alt}/>
          </div>
        </div>
      </section>
    );
  }
}

export default SlothImg
