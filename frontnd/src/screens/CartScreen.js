import React, {useEffect} from 'react'
import { Link, useParams,useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Row,Col, ListGroup, Image, Form, Button, Card, Container } from 'react-bootstrap'
import  Message  from '../components/Message'
import { addToCart, removeFromCart } from '../actions/cartActions'

function CartScreen() {
  const match = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const productId = match.id;
  const qty = location.search ? Number(location.search.split('=')[1]) :1;
  const dispatch = useDispatch();

  const cart = useSelector(state => state.cart);
  const {cartItems} = cart;
  
  
  useEffect(() =>{
    if (productId){
      dispatch(addToCart(productId,qty))
    }
  }, [dispatch,productId,qty]) 

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id))
  }

  const checkoutHandler = () => {
    navigate('/shipping')
}

  return (
    <Container className='p-3'>
      <Row >
        <Col  md={8}> 
          <h1> Shopping Cart</h1>
          {cartItems.length ===0 ?  (
            <Message variant='info'>
              Your cart is empty  <Link to='/'>Go Back</Link>
            </Message>
          ): ( 
            <ListGroup variant='flush'>
              { cartItems.map( (item) => (
                <ListGroup.Item key={item.product}>
                  <Row>

                    <Col md={2}>
                      { <Image src={item.image} alt={item.name} fluid rounded/> /* fluid makes it responsive */}
                    </Col>

                    <Col md={3} className='my-1 mt-md-0'>
                      <Link to={`/product/${item.product}`}> {item.name}</Link>
                    </Col>

                    <Col md={2} className='my-1 mt-md-0'>
                      ${item.price}
                    </Col>

                    <Col md={3} className='my-1 mt-md-0'>
                      <Form.Select
                        value={item.qty} 
                        onChange={(e) => dispatch(addToCart(item.product, Number(e.target.value))) }
                      >
                        {
                          [...Array(item.countInStock).keys()].map((x)=>(
                            <option key={x+1} value={x+1}>
                              {x+1}
                            </option>
                          ))
                        }
                      </Form.Select>
                    </Col>

                    <Col md={1} className='my-1 mt-md-0'>
                      <Button
                        type='button'
                        variant='light'
                        onClick={ () => removeFromCartHandler(item.product)}
                      >
                        <i className='fas fa-trash'></i>

                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>

        <Col  md={4}> 
          <Card>
            <ListGroup variant='flush'>
                <ListGroup.Item>
                    <h2>Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)}) items</h2>
                    ${cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}
                </ListGroup.Item>
            </ListGroup>

            <ListGroup.Item className='px-3 py-1'>
              <Button
                    type='button'
                    className='w-100 '
                    disabled={cartItems.length === 0}
                    onClick={checkoutHandler}
                    
                >
                    Proceed To Checkout <i class="fa-solid fa-cash-register"></i>
                </Button> 
            </ListGroup.Item>
          </Card>
        </Col>

      </Row>
    </Container>
  )
}

export default CartScreen