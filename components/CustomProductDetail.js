import Link from "next/link";
import Image from "next/image";
import styles from "../styles/CustomProductDetail.module.css";
import {
    Nav,
    Navbar,
    NavDropdown,
    Container,
    Form,
    FormControl,
    FormGroup,
    InputGroup,
    Button,
    Col,
    Row,
    ControlLabel,
    Card,
} from "react-bootstrap";
import { useState, useEffect } from "react";
import axios from "axios";
import router from "next/router";
import { useCart } from "../context/CartContext";

const domain = process.env.NEXT_PUBLIC_API_DOMAIN_NAME;

const CustomProductDetail = ({ product, original_product }) => {

    const {cart, update_product} = useCart()

    const [cant, setCant] = useState(1);
    const [clothing_s, setClothingS] = useState('S');
    const [sleeve, setSleeve] = useState('Corta');
    const [fit, setFit] = useState('Regular Fit');
    const [price, setPrice] = useState(product.price)
    const [color, setColor] = useState("Default")
    const [changeColor, setChangeColor] = useState(false)
    const [images, setImages] = useState(null)
    const [currentImage, setCurrentImage] = useState(original_product.image)

    useEffect(async()=>{
        setCant(product.cant)
        setClothingS(product.clothing_s)
        setSleeve(product.size_of_sleeve)
        setFit(product.fit)
        setColor(product.color)
        var changeColorTemp = (product.color == "Default")?false:true;
        setChangeColor(changeColorTemp)
        await getImages(setImages, original_product.id)
    },[])

    var body = JSON.stringify({
        cant,
        clothing_s,
        size_of_sleeve: sleeve,
        fit,
        original_product_id: original_product.id,
        price: original_product.price*cant,
        id: product.id,
        pk: product.pk,
        color,
    })

    console.log(product)

    const onSaveClickedHandler = async(e) => {
        e.preventDefault();

        if(cant > 0){
            
            var temp_color = color;
            if(changeColor == false){
                temp_color = "Default"
            }
        
            
             if(product.product.subtag === "ABAJO"){
                if(clothing_s === "S"){
                    body = JSON.stringify({
                        cant,
                        clothing_s: "32",
                        size_of_sleeve: "-1",
                        fit: "-1",
                        original_product_id: original_product.id,
                        price: original_product.price*cant,
                        id: product.id,
                        pk: product.pk,
                        color: temp_color,
                    })
                }
            }

            else if(product.product.subtag !== "ARRIBA"){
                body = JSON.stringify({
                    cant,
                    clothing_s,
                    size_of_sleeve: "-1",
                    fit: "-1",
                    original_product_id: original_product.id,
                    price: original_product.price*cant,
                    id: product.id,
                    pk: product.pk,
                    color: temp_color,
                })
            }
            if(color == 'Default' && changeColor==true){
                alert("Select a custom color")
            }
            else{
                await update_product(product.id, body)
            }
           
        }
        
    } 

    return product == null || images==null? (
        <div></div>
    ) : (
        <Container className={styles.customProductsDetailContainer}>
            <Row className={styles.row}>
            <Col
                    xs={12}
                    sm={12}
                    md={6}
                    lg={6}
                    className={styles.productCol}
                >
                    <Row>
                        <Col xs={12} sm={12} md={3} lg={3}>
                            <Card className={styles.s_images_card}>

                                {images.map((image, index) => {
                                    return (
                                        <div key={index} className={styles.s_images_div}>
                                            <Card.Img src={image.image} onMouseOver={e => setCurrentImage(e.target.src)} className={styles.card_s_image} alt='Image of product' />
                                        </div>
                                    )
                                })}
                            </Card>
                        </Col>

                        <Col xs={12} sm={12} md={9} lg={9}>
                            <Card className={styles.card_image_mcard}>
                                <Card.Img variant="top" src={currentImage} className={styles.card_image} />
                            </Card>
                        </Col>
                    </Row>
                </Col>
                <Col
                    xs={12}
                    sm={12}
                    md={6}
                    lg={6}
                    className={styles.productCol}
                >
                    <Card className={styles.card}>
                    <Card.Body className={styles.card_body}>
                    {product.product.subtag === "ARRIBA" ? (
                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <Form.Label>Talla de Ropa</Form.Label>
                                    <Form.Select aria-label="Default select example" onChange={(e) => setClothingS(e.target.value)}>
                                        <option value={product.clothing_s}>{product.clothing_s}</option>
                                        <option value="S">S</option>
                                        <option value="M">M</option>
                                        <option value="L">L</option>
                                    </Form.Select>
                                </Form.Group>
                            ) : (
                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <Form.Label>Talla de Ropa</Form.Label>
                                    <Form.Select aria-label="Default select example" onChange={(e) => setClothingS(e.target.value)}>
                                    <option value={product.clothing_s}>{product.clothing_s}</option>
                                        <option value="32">32</option>
                                        <option value="34">34</option>
                                        <option value="36">36</option>
                                    </Form.Select>
                                </Form.Group>
                            )}

                            {product.product.subtag === "ARRIBA" ? (
                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <Form.Label>Corte</Form.Label>
                                    <Form.Select aria-label="Default select example" onChange={(e) => setFit(e.target.value)}>
                                        <option value={product.fit}>{product.fit}</option>
                                        <option value="Regular Fit">Regular Fit</option>
                                        <option value="Slim Fit">Slim Fit</option>
                                    </Form.Select>
                                </Form.Group>
                            ) : <div></div>}

                            {product.product.subtag === "ARRIBA" ? (
                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <Form.Label>Largo de Manga</Form.Label>
                                    <Form.Select aria-label="Default select example" onChange={(e) => setSleeve(e.target.value)}>
                                        <option value={product.size_of_sleeve}>{product.size_of_sleeve}</option>
                                        <option value="Corta">Corta</option>
                                        <option value="Larga">Larga</option>
                                    </Form.Select>
                                </Form.Group>
                            ) : <div></div>}
                            
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Cantidad</Form.Label>
                                <Form.Control type="number" onChange={(e) => setCant(e.target.value)} value={cant}/>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Check
                                    inline
                                    name="group1"
                                    type="checkbox"
                                    id="checkbox_color"
                                    checked={changeColor === true}
                                    onChange={e => setChangeColor(e.target.checked)}
                                />
                                <Form.Label>
                                    Custom Color
                                </Form.Label>
                            </Form.Group>

                            {(changeColor === true) ? <div>
                                <Row>
                                    {original_product.available_colors.map((ecolor, index) => {
                                        var sel_outline = '';
                                        if(ecolor.code == color){
                                            sel_outline = '3px solid royalblue'
                                        }
                                        else{
                                            sel_outline = '1px solid lightsteelblue'
                                        }
                                        return (
                                            <Col key={index} xs={4} sm={4} md={3} lg={2}>
                                                <div style={{}}>
                                                    <div onClick={e => setColor(ecolor.code)} key={index} style={{ backgroundColor: ecolor.code, height: '25px', width: '25px', border: "1px solid white", borderRadius: "30px", outline:sel_outline}} />
                                                </div>
                                            </Col>
                                        )
                                    })}
                                </Row>
                            </div> : <div></div>}

                        </Card.Body>
                        <Card.Footer className={styles.card_footer}>
                        <Button className={styles.button} onClick={(e)=>onSaveClickedHandler(e)}>Save</Button>
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};


const getImages = (setImages, id) => {
    const config = {
        headers: {
            "Content-Type": "application/json",
        },
    };

    const prod_images_url = domain + `store/product-images/${id}/`;
    axios
        .get(prod_images_url, config)
        .then(async (res) => {
            const result = await res.data['Images'];
            setImages(result);
        })
        .catch((error) => {
            console.log(error);
        });
}


export default CustomProductDetail;