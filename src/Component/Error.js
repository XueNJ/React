import { Link } from 'react-router-dom'
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Row from 'react-bootstrap/Row';

const Error = () => {
    return (
        <div className='container'>
            <h2>404無效頁面，請按回首頁！</h2>
            <Container>
                <Row>
                    <Link to='/'>回首頁</Link>
                    <br />
                    <Col xs={6} md={4}>
                        <Image style={{ height: '500px', width: '300%' }} src='/ErrorPage.jpg' rounded />
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Error;