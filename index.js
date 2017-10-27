class ImageSlider {
  constructor(slider) {
    this.dom = {
      imageList: slider.querySelector(".imageList"),
      arrowLeft: slider.querySelector(".leftArrow"),
      arrowRight: slider.querySelector(".rightArrow"),
      dot: slider.querySelectorAll(".dot")
    };

    this.vars = {
      amount: this.dom.imageList.children.length,
      currentSlide: 0,
      step: 100 / this.dom.imageList.children.length
    };

    const imageListWidth = this.vars.amount * 100;
    console.log(this.dom.dot);

    slider
      .querySelector(".imageList")
      .setAttribute("style", `width:${imageListWidth}%`);

    slider.querySelectorAll(".slide").forEach(slide => {
      slide.style.width = `${this.vars.step}%`;
    });

    this.dom.arrowLeft.addEventListener("click", this.goLeft.bind(this));
    this.dom.arrowRight.addEventListener("click", this.goRight.bind(this));

    // this.goRight();
    setInterval(() => {
      this.goRight();
    }, 1000);
  }

  goLeft(e) {
    e.preventDefault();
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
  }

  goRight() {
    ++this.vars.currentSlide;
    let newXPosition = 0;
    const result = this.vars.currentSlide * this.vars.step;

    if (result === 100) {
      this.vars.currentSlide = 0;
    } else {
      newXPosition = result * -1;
    }
    this.dom.imageList.style.transform = `translateX(${newXPosition}%)`;

    for (let i = 0; i < this.dom.dot.length; i++) {
      this.dom.dot[i].classList.remove("active");
      if (this.dom.dot[this.vars.currentSlide]) {
        this.dom.dot[this.vars.currentSlide].classList.add("active");
      }
    }
  }
}

(function() {
  document.querySelectorAll(".slider.with-js").forEach(slider => {
    new ImageSlider(slider);
  });
})();

//ToDos:
// x .) Magic Numbers variabilisieren
// x .) über js die variablen im css deklarieren (slide, imagelist)
// .) buttons verschönern (es soll schön ausschauen..)
// .) die bulletpoints sind noch nicht da! bei aktivem bild richtigen bulletpoint highlighten,die bulletpoints unten im bild
// .) die hrefs ('anker' --> #)
// .) die buttuns links und rechts vom bild einblenden bei hover
// .) das bild dritteln : links und rechts sind die buttons/arrows , in der mitte ein play/pause button fürs sliden (togglen!)
// x .) inital autoplay
// .) beim manuellen sliden wird autoplay auf pause geschalten
// .) HTML wird nicht verändert
// .) Arrows + Play/Pause sollen Icons sein.
