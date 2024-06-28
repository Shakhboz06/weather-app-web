export const slickCarousel = () => {
    const weather_con = document.querySelector('.carousel')
    if (weather_con) {
        $('.carousel').slick({
            dots: false,
            infinite: false,
            slidesToShow: 3,
            slidesToScroll: 2,
            draggable: true,
            lazyLoad: 'ondemand',
            prevArrow: '<button class="slick-prev slick-arrow" aria-label="Previous" type="button">Previous</button>',
            nextArrow: '<button class="slick-next slick-arrow" aria-label="Next" type="button">Next</button>',
            responsive: [
                {
                    breakpoint: 620,
                    settings: {
                        slidesToShow: 2
                    }
                },
            ]
        })
    }
}