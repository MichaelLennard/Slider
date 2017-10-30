class ImageSlider {
  constructor(slider) {
    // collecting all important dom elements
    this.dom = {
      imageList: slider.querySelector(".imageList"),
      arrowLeft: slider.querySelector(".leftArrow"),
      arrowRight: slider.querySelector(".rightArrow"),
      bulletpoints: slider.querySelector(".bulletpoints"),
      dots: slider.querySelectorAll(".dot"),
      play: slider.querySelector(".play-pause")
    };

    // collecting all important vars for later usage
    this.vars = {
      amount: this.dom.imageList.children.length,
      currentSlide: 0,
      step: 100 / this.dom.imageList.children.length,
      initautoplay: null,
      interval: 1000
    };
    const imageListWidth = this.vars.amount * 100;

    slider
      .querySelector(".imageList")
      .setAttribute("style", `width:${imageListWidth}%`);

    slider.querySelectorAll(".slide").forEach(slide => {
      slide.style.width = `${this.vars.step}%`;
    });

    this.dom.arrowLeft.addEventListener("click", this.slideLeft.bind(this));
    this.dom.arrowRight.addEventListener("click", this.slideRight.bind(this));
    this.dom.play.addEventListener("click", this.toggleSliding.bind(this));

    this.dom.dots.forEach(dot => {
      dot.addEventListener("click", this.goToSlide.bind(this));
    });

    // const rightArrowicon = document.createElement("i");
    // rightArrowicon.className = "fa fa-caret-right 5-x";
    // this.dom.arrowRight.appendChild(rightArrowicon);
    // const leftArrowicon = document.createElement("i");
    // leftArrowicon.className = "fa fa-caret-left 4-x";
    // this.dom.arrowLeft.appendChild(leftArrowicon);
    this.dom.arrowLeft.innerHTML =
      '<i class="fa fa-caret-left fa-4x" aria-hidden="true"></i>';

    this.dom.arrowRight.innerHTML =
      '<i class="fa fa-caret-right fa-4x" aria-hidden="true"></i>';

    this.startSliding();
  }

  isPlaying() {
    return this.dom.play.classList.contains("playing");
  }

  startSliding() {
    if (!this.isPlaying()) {
      this.vars.initautoplay = setInterval(() => {
        this.slideRight();
      }, this.vars.interval);
      this.dom.play.classList.add("playing");
      this.dom.play.innerHTML =
        '<i class="fa fa-pause fa-3x" aria-hidden="true"></i>';
    }
  }

  stopSliding() {
    if (this.isPlaying()) {
      clearInterval(this.vars.initautoplay);
      this.dom.play.classList.remove("playing");
      this.dom.play.innerHTML =
        '<i class="fa fa-play fa-3x" aria-hidden="true"></i>';
    }
  }

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

  slideLeft(event) {
    this._stopOnEvent(event);

    --this.vars.currentSlide;
    let newXPosition = 0;
    const result = this.vars.currentSlide * this.vars.step;

    if (result === -`${this.vars.step}`) {
      newXPosition = this.vars.step * (this.vars.amount - 1) * -1;

      this.vars.currentSlide = this.vars.amount - 1;
    } else {
      newXPosition = result * -1;
    }
    this.dom.imageList.style.transform = `translateX(${newXPosition}%)`;

    this._calculateBulletPoints();
  }

  slideRight(event) {
    this._stopOnEvent(event);

    ++this.vars.currentSlide;
    let newXPosition = 0;
    const result = this.vars.currentSlide * this.vars.step;

    if (result === 100) {
      this.vars.currentSlide = 0;
    } else {
      newXPosition = result * -1;
    }
    this.dom.imageList.style.transform = `translateX(${newXPosition}%)`;

    this._calculateBulletPoints();
  }

  goToSlide(event) {
    this._stopOnEvent(event);

    let currentPoint = Array.from(this.dom.dots).indexOf(event.target);
    this.vars.currentSlide = currentPoint - 1;
    this.slideRight();
  }

  _calculateBulletPoints() {
    this.dom.bulletpoints
      .querySelector(".dot.active")
      .classList.remove("active");
    this.dom.dots[this.vars.currentSlide].classList.add("active");
  }

  _stopOnEvent(event) {
    if (event !== undefined) {
      event.preventDefault();
      this.stopSliding();
    }
  }
}

(function() {
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
