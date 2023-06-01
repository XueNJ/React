import Carousel from 'react-bootstrap/Carousel';

const CarouselCard = () => {
    return (
        <Carousel variant="dark">
            <Carousel.Item>
                <img
                    className="d-block w-100"
                    src="./DrinksImage/9_1_20230518175110.jpg"
                    alt="First slide"
                />
                <Carousel.Caption></Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
                <img
                    className="d-block w-100"
                    src="./DrinksImage/0_1_20230518142251.jpg"
                    alt="Second slide"
                />
                <Carousel.Caption></Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
                <img
                    className="d-block w-100"
                    src="./DrinksImage/3_1_20230518142252.jpg"
                    alt="Third slide"
                />
                <Carousel.Caption></Carousel.Caption>
            </Carousel.Item>
        </Carousel>
    );
}

export default CarouselCard;