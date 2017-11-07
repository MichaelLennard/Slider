class ImageSlider {
  constructor(slider) {
    // collecting all important dom elements
    // these elements are not changeable, they have to show the dom elements ,which i need to access to some other elements
    this.dom = {
      imageList: slider.querySelector(".imageList"),
      arrowLeft: slider.querySelector(".leftArrow"),
      arrowRight: slider.querySelector(".rightArrow"),
      bulletpoints: slider.querySelector(".bulletpoints"),
      dots: slider.querySelectorAll(".dot"),
      play: slider.querySelector(".play-pause")
    };

    // collecting all important vars for later usage
    // these elements i need for some important usages for correct sliding for all functions
    this.vars = {
      // the amount is length of all childrenelements (images) in an imageList
      amount: this.dom.imageList.children.length,
      // currentSlide storages the number of the current visible slide/image/page
      currentSlide: 0,
      // calculate the correct width for each image in an imagelist
      step: 100 / this.dom.imageList.children.length,
      initautoplay: null,
      //get the data speed attribute and parse it to integer to prevent a magic number in code(!)
      speed: parseInt(slider.getAttribute("data-speed"), 10)
    };
    //multiplicate the amount of the images with 100 for correct width
    const imageListWidth = this.vars.amount * 100;

    // get all elements with imagelist and set the widthattribute to the correct width (length)
    slider
      .querySelector(".imageList")
      .setAttribute("style", `width:${imageListWidth}%`);

    // get all elements with class slide and set the width for those elements to the correct width
    slider.querySelectorAll(".slide").forEach(slide => {
      slide.style.width = `${this.vars.step}%`;
    });

    // add eventlistener to all important click events for the control elements
    this.dom.arrowLeft.addEventListener("click", this.slideLeft.bind(this));
    this.dom.arrowRight.addEventListener("click", this.slideRight.bind(this));
    this.dom.play.addEventListener("click", this.toggleSliding.bind(this));

    // add for each dot an click eventlistener and bind it to following method
    this.dom.dots.forEach(dot => {
      dot.addEventListener("click", this.goToSlide.bind(this));
    });
    // call function to init autoplay
    this.startSliding();
  }

  // this function returns, if current element contains class, it's necessary to know, becuase of that the autoplay gets started or stopped
  isPlaying() {
    return this.dom.play.classList.contains("playing");
  }

  // set interval (autoplay), if the play/pause element doesn't contain this class and add it, the pause button is changed to a play button
  startSliding() {
    if (!this.isPlaying()) {
      this.vars.initautoplay = setInterval(() => {
        this.slideRight();
      }, this.vars.speed);
      this.dom.play.classList.add("playing");
    }
  }

  // this function clears the interval which is set to the variable initautoplay and removes the class playlist
  stopSliding() {
    if (this.isPlaying()) {
      clearInterval(this.vars.initautoplay);
      this.dom.play.classList.remove("playing");
    }
  }
  // this function is for the play/pause button, if the current button is clicked, it calls the functions inside
  // i need the preventDefault-function to define, if some actions were triggered by an event or because of other cases
  toggleSliding(event) {
    if (event !== undefined) {
      event.preventDefault();
    }

    if (!this.isPlaying()) {
      this.startSliding();
    } else {
      this.stopSliding();
    }
  }

  // in this function happens all the left slide shit..
  // it calls _stoponevent to know, if the function got triggered by an event (click), otherwise it won't stop the slideanimation
  slideLeft(event) {
    this._stopOnEvent(event);

    // subtract from the current slide one, to get the slide on the left
    --this.vars.currentSlide;

    let newXPosition = 0;

    // declare result, to get to know on which position the slider needs so be moved
    const result = this.vars.currentSlide * this.vars.step;
    // if the last image (respectively the first image in list) is reached, set newXposition  and multiply it with -1
    if (result === -`${this.vars.step}`) {
      newXPosition = this.vars.step * (this.vars.amount - 1) * -1;

      // set the currentslide to the last element of array (imageList)
      this.vars.currentSlide = this.vars.amount - 1;
    } else {
      // otherwise set the newXPosition to the result and multiplay it with -1 to jump to the next image on the left position of the current
      newXPosition = result * -1;
    }
    // translate the imagelist to the wanted position (ine position backwards)
    this.dom.imageList.style.transform = `translateX(${newXPosition}%)`;

    this._calculateBulletPoints();
  }

  // in this function happens all the right slide shit..
  slideRight(event) {
    this._stopOnEvent(event);

    //add one to currentSlide to get to know which is the current image in the list
    ++this.vars.currentSlide;
    let newXPosition = 0;
    // declate result, to get to know, to which position the slider needs to move
    const result = this.vars.currentSlide * this.vars.step;

    // if result is equal to 100, set the currentslide to 0, so the slide can afterwars begin from the first image in the imagelist
    if (result === 100) {
      this.vars.currentSlide = 0;
    } else {
      // otherwise multiply the result with -1 and assign it to newXPosition
      newXPosition = result * -1;
    }
    // translate the imagelist to the wanted position (one position forwards)
    this.dom.imageList.style.transform = `translateX(${newXPosition}%)`;

    this._calculateBulletPoints();
  }

  //
  goToSlide(event) {
    this._stopOnEvent(event);

    // get the index of the actually clicked bulletpoint and set the currentSlide to the position of the bulletpoint -1, afterwards call slideRight
    // what happens: the current position of the image is storaged and gets substracted with -1, so now we are one position forward to slide/image i want to move,
    // when we call slideRight, the currentSlide gets elevated by one. so now we are on the correct position and the slideright function does the magic.
    let currentPoint = Array.from(this.dom.dots).indexOf(event.target);
    this.vars.currentSlide = currentPoint - 1;
    this.slideRight();
  }

  //  get all elements with class .dot , .active and remove the active class from those, and add the active class to the dot with the position of the currentSlide
  _calculateBulletPoints() {
    this.dom.bulletpoints
      .querySelector(".dot.active")
      .classList.remove("active");
    this.dom.dots[this.vars.currentSlide].classList.add("active");
  }

  // if the event is not undefined ( actually if, some event is  triggered, actually if something got clicked), prevent Default and stopSliding
  _stopOnEvent(event) {
    if (event !== undefined) {
      event.preventDefault();
      this.stopSliding();
    }
  }
}

(function() {
  // i get access to all elements which have the '.slider-with-js'-class, foreach element i create a new class of ImageSlider, to get own access to all sliders on one page (for strict spearation)
  // can't do map, because you get back a nodelist, which doesn't include map function, because it's an arrayfunction
  document.querySelectorAll(".slider.with-js").forEach(slider => {
    new ImageSlider(slider);
  });
})();

//ToDos:
// x.) Magic Numbers variabilisieren
// x.) über js die variablen im css deklarieren (slide, imagelist)
// x.) buttons verschönern (es soll schön ausschauen..)
// x.) die bulletpoints sind noch nicht da! bei aktivem bild richtigen bulletpoint highlighten,die bulletpoints unten im bild
// x.) die hrefs ('anker' --> #)
// x.) die buttuns links und rechts vom bild einblenden bei hover
// x.) das bild dritteln : links und rechts sind die buttons/arrows , in der mitte ein play/pause button fürs sliden (togglen!)
// x.) inital autoplay
// x.) beim manuellen sliden wird autoplay auf pause geschalten
// x.) HTML wird nicht verändert
// x.) Arrows + Play/Pause sollen Icons sein.
// x.) bulletpoints weiß mit dunklem schatten und margin
// x.) bulletpoints sollen klickbar sein, und zu richtigem slide/page sliden
// x.) Optionen implementieren
