import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Row from 'react-bootstrap/Row';

const Maintenance = () => {
    return (
        <div className='container'>
            <br />
            <h2>系統維護中，請稍待片刻...！</h2>
            <br />
            <Container>
                <Row>
                    <br />
                    <Col xs={6} md={4}>
                        <Image style={{ height: '500px', width: '300%' }} src='/Maintenance.gif' rounded />
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Maintenance;