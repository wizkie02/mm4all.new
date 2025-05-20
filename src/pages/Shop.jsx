import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import BackgroundEffect from '../components/BackgroundEffect';

// Import product images
import candleImg from '../assets/product-candle.jpg';
import cushionImg from '../assets/product-cushion.jpg';
import diffuserImg from '../assets/product-diffuser.jpg';
import bowlImg from '../assets/product-singing-bowl.jpg';

const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [fade, setFade] = useState(true);
  
  // Simulate loading state
  useEffect(() => {
    setFade(false);
    const timer = setTimeout(() => {
      setFade(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [selectedCategory]);
  
  const categories = [
    { id: 'all', label: 'All Products' },
    { id: 'essentials', label: 'Meditation Essentials' },
    { id: 'aromatherapy', label: 'Aromatherapy' },
    { id: 'bundles', label: 'Bundles' }
  ];
  
  const products = [
    {
      id: 1,
      name: 'Meditation Cushion',
      price: 49.99,
      category: 'essentials',
      image: cushionImg,
      description: 'Ergonomic design for extended meditation sessions. Made from sustainable materials.'
    },
    {
      id: 2,
      name: 'Singing Bowl',
      price: 79.99,
      category: 'essentials',
      image: bowlImg,
      description: 'Handcrafted Tibetan singing bowl with mallet. Produces calming tones for meditation.'
    },
    {
      id: 3,
      name: 'Essential Oil Diffuser',
      price: 39.99,
      category: 'aromatherapy',
      image: diffuserImg,
      description: 'Ultrasonic diffuser with LED lighting. Perfect for creating a calm atmosphere.'
    },
    {
      id: 4,
      name: 'Meditation Candle',
      price: 24.99,
      category: 'aromatherapy',
      image: candleImg,
      description: 'Handpoured soy candle with essential oils. Burns for up to 50 hours.'
    },
    {
      id: 5,
      name: 'Beginner\'s Bundle',
      price: 89.99,
      category: 'bundles',
      image: cushionImg,
      description: 'Everything you need to start your meditation practice: cushion, candle, and guided meditations.'
    },
    {
      id: 6,
      name: 'Aromatherapy Collection',
      price: 59.99,
      category: 'bundles',
      image: diffuserImg,
      description: 'Diffuser plus a set of 5 essential oils for different moods and meditation goals.'
    }
  ];
  
  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory);
  
  const addToCart = (product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (existingItem) {
        return prevItems.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
    
    // Show cart briefly
    setIsCartOpen(true);
    setTimeout(() => setIsCartOpen(false), 3000);
  };
  
  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };
  
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === productId 
          ? { ...item, quantity: newQuantity } 
          : item
      )
    );
  };
  
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };
  
  return (
    <ShopContainer>
      <BackgroundEffect />
      
      <PageHeader>
        <HeaderContent>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Meditation Shop
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Enhance your meditation practice with our curated collection of mindfulness products
          </motion.p>
        </HeaderContent>
      </PageHeader>
      
      <ContentSection>
        <CategoryNav>
          {categories.map(category => (
            <CategoryButton
              key={category.id}
              active={selectedCategory === category.id}
              onClick={() => setSelectedCategory(category.id)}
              as={motion.button}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              {category.label}
              {selectedCategory === category.id && (
                <ActiveIndicator layoutId="categoryIndicator" />
              )}
            </CategoryButton>
          ))}
        </CategoryNav>
        
        <ProductGrid
          as={motion.div}
          animate={{ opacity: fade ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <AnimatePresence>
            {filteredProducts.map((product, index) => (              <ProductCard
                key={product.id}
                as={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                /* Remove the whileHover here to prevent double animation */
              >
                <ProductImage>
                  <img src={product.image} alt={product.name} />
                </ProductImage>
                <ProductInfo>
                  <ProductName>{product.name}</ProductName>
                  <ProductCategory>{product.category}</ProductCategory>
                  <ProductDescription>{product.description}</ProductDescription>
                  <ProductPrice>${product.price.toFixed(2)}</ProductPrice>
                  <AddToCartButton
                    onClick={() => addToCart(product)}
                    as={motion.button}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Add to Cart
                  </AddToCartButton>
                </ProductInfo>
              </ProductCard>
            ))}
          </AnimatePresence>
        </ProductGrid>
      </ContentSection>
      
      <CartIcon 
        onClick={() => setIsCartOpen(!isCartOpen)}
        as={motion.div}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{ 
          rotate: cartItems.length > 0 && !isCartOpen ? [0, 10, -10, 0] : 0
        }}
        transition={{ 
          duration: 0.5, 
          repeat: cartItems.length > 0 && !isCartOpen ? 1 : 0
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
        </svg>
        {cartItems.length > 0 && (
          <CartCount>{cartItems.reduce((total, item) => total + item.quantity, 0)}</CartCount>
        )}
      </CartIcon>
      
      <AnimatePresence>
        {isCartOpen && (
          <CartPanel
            as={motion.div}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 20 }}
          >
            <CartHeader>
              <h3>Your Cart</h3>
              <CloseButton 
                onClick={() => setIsCartOpen(false)}
                as={motion.button}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                ✕
              </CloseButton>
            </CartHeader>
            
            {cartItems.length === 0 ? (
              <EmptyCart>
                <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor" opacity="0.3">
                  <path d="M15.55 13c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.37-.66-.11-1.48-.87-1.48H5.21l-.94-2H1v2h2l3.6 7.59-1.35 2.44C4.52 15.37 5.48 17 7 17h12v-2H7l1.1-2h7.45zM6.16 6h12.15l-2.76 5H8.53L6.16 6zM7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
                </svg>
                <p>Your cart is empty</p>
              </EmptyCart>
            ) : (
              <>
                <CartItems>
                  {cartItems.map(item => (
                    <CartItem key={item.id}>
                      <CartItemImage>
                        <img src={item.image} alt={item.name} />
                      </CartItemImage>
                      <CartItemInfo>
                        <CartItemName>{item.name}</CartItemName>
                        <CartItemPrice>${item.price.toFixed(2)}</CartItemPrice>
                        <CartItemControls>
                          <QuantityButton 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            -
                          </QuantityButton>
                          <ItemQuantity>{item.quantity}</ItemQuantity>
                          <QuantityButton onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                            +
                          </QuantityButton>
                          <RemoveButton onClick={() => removeFromCart(item.id)}>
                            Remove
                          </RemoveButton>
                        </CartItemControls>
                      </CartItemInfo>
                    </CartItem>
                  ))}
                </CartItems>
                <CartFooter>
                  <TotalContainer>
                    <span>Total:</span>
                    <TotalAmount>${getTotalPrice().toFixed(2)}</TotalAmount>
                  </TotalContainer>
                  <CheckoutButton
                    as={motion.button}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Proceed to Checkout
                  </CheckoutButton>
                </CartFooter>
              </>
            )}
          </CartPanel>
        )}
      </AnimatePresence>
    </ShopContainer>
  );
};

// Styled Components
const ShopContainer = styled.div`
  position: relative;
  min-height: 100vh;
  padding-bottom: 4rem;
`;

const PageHeader = styled.div`
  background-color: var(--primary-color);
  color: white;
  padding: 4rem 0;
  margin-bottom: 3rem;
  position: relative;
  overflow: hidden;
  
  /* Add meditation shop-themed pattern with static icons */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url("data:image/svg+xml,%3Csvg width='400' height='400' viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3C!-- Shopping Cart --%3E%3Cpath d='M50,80 L65,80 L80,120 L30,120 L50,80 Z' stroke='rgba(255,255,255,0.25)' stroke-width='2' fill='rgba(255,255,255,0.05)'/%3E%3Ccircle cx='45' cy='130' r='5' stroke='rgba(255,255,255,0.25)' stroke-width='1.5' fill='rgba(255,255,255,0.05)'/%3E%3Ccircle cx='70' cy='130' r='5' stroke='rgba(255,255,255,0.25)' stroke-width='1.5' fill='rgba(255,255,255,0.05)'/%3E%3C!-- Meditation Cushion --%3E%3Cpath d='M120,90 C120,85 130,80 140,80 C150,80 160,85 160,90 C160,95 150,100 140,100 C130,100 120,95 120,90 Z' stroke='rgba(255,255,255,0.25)' stroke-width='2' fill='rgba(255,255,255,0.05)'/%3E%3C!-- Singing Bowl --%3E%3Cpath d='M200,90 C200,80 220,80 220,90 L225,100 L195,100 L200,90 Z' stroke='rgba(255,255,255,0.25)' stroke-width='1.5' fill='rgba(255,255,255,0.05)'/%3E%3Cpath d='M190,100 L230,100' stroke='rgba(255,255,255,0.25)' stroke-width='2'/%3E%3C!-- Lotus --%3E%3Cpath d='M290,80 C295,70 300,70 310,80 C320,70 325,70 330,80 C335,70 340,70 350,80 C340,90 335,90 330,80 C325,90 320,90 310,80 C300,90 295,90 290,80 Z' stroke='rgba(255,255,255,0.25)' stroke-width='1.5' fill='rgba(255,255,255,0.05)'/%3E%3Ccircle cx='320' cy='90' r='5' fill='rgba(255,255,255,0.1)'/%3E%3C!-- Essential Oil Bottle --%3E%3Cpath d='M70,200 L80,200 L80,210 C80,215 75,220 70,220 C65,220 60,215 60,210 L60,200 L70,200 Z' stroke='rgba(255,255,255,0.25)' stroke-width='1.5' fill='rgba(255,255,255,0.05)'/%3E%3Cpath d='M65,195 L75,195 L75,200 L65,200 L65,195 Z' stroke='rgba(255,255,255,0.25)' stroke-width='1.5' fill='rgba(255,255,255,0.05)'/%3E%3C!-- Candle --%3E%3Crect x='140' y='190' width='20' height='30' rx='2' stroke='rgba(255,255,255,0.25)' stroke-width='1.5' fill='rgba(255,255,255,0.05)'/%3E%3Cpath d='M150,190 L150,180' stroke='rgba(255,255,255,0.25)' stroke-width='1.5'/%3E%3Cpath d='M147,180 L153,180 C153,175 147,175 147,180 Z' stroke='rgba(255,255,255,0.25)' stroke-width='1' fill='rgba(255,255,255,0.1)'/%3E%3C!-- Shopping Bag --%3E%3Cpath d='M200,200 L225,200 L220,230 L205,230 L200,200 Z' stroke='rgba(255,255,255,0.25)' stroke-width='1.5' fill='rgba(255,255,255,0.05)'/%3E%3Cpath d='M205,200 C205,190 210,185 212.5,185 C215,185 220,190 220,200' stroke='rgba(255,255,255,0.25)' stroke-width='1.5'/%3E%3C!-- Diffuser --%3E%3Cpath d='M290,210 C290,220 300,225 310,225 C320,225 330,220 330,210 L330,200 L290,200 L290,210 Z' stroke='rgba(255,255,255,0.25)' stroke-width='1.5' fill='rgba(255,255,255,0.05)'/%3E%3Cpath d='M300,200 L320,200 L320,195 L300,195 L300,200 Z' stroke='rgba(255,255,255,0.25)' stroke-width='1.5' fill='rgba(255,255,255,0.05)'/%3E%3Cpath d='M305,195 L315,185' stroke='rgba(255,255,255,0.25)' stroke-width='1'/%3E%3Cpath d='M315,195 L305,185' stroke='rgba(255,255,255,0.25)' stroke-width='1'/%3E%3C!-- Om Symbol --%3E%3Cpath d='M70,290 C65,280 65,270 75,270 C85,270 80,290 70,290 Z' stroke='rgba(255,255,255,0.25)' stroke-width='1.5' fill='none'/%3E%3Cpath d='M70,290 C80,290 85,300 80,310 C75,320 65,315 65,305' stroke='rgba(255,255,255,0.25)' stroke-width='1.5' fill='none'/%3E%3Cpath d='M65,305 L60,315' stroke='rgba(255,255,255,0.25)' stroke-width='1.5'/%3E%3Cpath d='M62,270 L78,270' stroke='rgba(255,255,255,0.25)' stroke-width='1.5'/%3E%3C!-- Coupon/Discount --%3E%3Crect x='140' y='280' width='40' height='20' rx='2' stroke='rgba(255,255,255,0.25)' stroke-width='1.5' fill='rgba(255,255,255,0.05)'/%3E%3Cpath d='M145,285 L175,295' stroke='rgba(255,255,255,0.25)' stroke-width='1'/%3E%3Cpath d='M145,295 L175,285' stroke='rgba(255,255,255,0.25)' stroke-width='1'/%3E%3C!-- Meditation Timer/Clock --%3E%3Ccircle cx='220' cy='300' r='15' stroke='rgba(255,255,255,0.25)' stroke-width='1.5' fill='rgba(255,255,255,0.05)'/%3E%3Cpath d='M220,300 L220,290' stroke='rgba(255,255,255,0.25)' stroke-width='1.5'/%3E%3Cpath d='M220,300 L228,308' stroke='rgba(255,255,255,0.25)' stroke-width='1.5'/%3E%3C!-- Payment/Checkout --%3E%3Crect x='300' y='290' width='30' height='20' rx='2' stroke='rgba(255,255,255,0.25)' stroke-width='1.5' fill='rgba(255,255,255,0.05)'/%3E%3Cpath d='M300,300 L330,300' stroke='rgba(255,255,255,0.25)' stroke-width='1'/%3E%3Cpath d='M305,310 L310,310' stroke='rgba(255,255,255,0.25)' stroke-width='1' stroke-linecap='round'/%3E%3Cpath d='M315,310 L325,310' stroke='rgba(255,255,255,0.25)' stroke-width='1' stroke-linecap='round'/%3E%3C/g%3E%3C/svg%3E");
    opacity: 0.95;
    z-index: 1;
    pointer-events: none;
    background-size: 400px;
  }
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
  padding: 0 1rem;
  position: relative;
  z-index: 2; /* Ensure content stays above the patterns */
  
  h1 {
    color: white;
    margin-bottom: 1rem;
  }
  
  p {
    color: rgba(255, 255, 255, 0.9);
    font-size: 1.2rem;
    max-width: 700px;
    margin: 0 auto;
  }
`;

const ContentSection = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const CategoryNav = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
  position: relative;
`;

const CategoryButton = styled.button`
  background: ${props => props.active ? 'var(--lavender)' : 'transparent'};
  color: ${props => props.active ? 'white' : 'var(--text-dark)'};
  border: 1px solid ${props => props.active ? 'var(--lavender)' : 'rgba(122, 107, 172, 0.4)'};
  padding: 0.7rem 1.5rem;
  border-radius: 30px;
  font-size: 1rem;
  font-weight: ${props => props.active ? '600' : '500'};
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(120deg, transparent, rgba(122, 107, 172, 0.1), transparent);
    transform: translateX(-100%);
    transition: transform 0.6s ease;
  }
  
  &:hover {
    border-color: var(--lavender);
    background: ${props => props.active ? 'var(--lavender)' : 'rgba(122, 107, 172, 0.05)'};
    box-shadow: 0 2px 8px rgba(122, 107, 172, 0.15);
    
    &::before {
      transform: translateX(100%);
    }
  }
  
  &:active {
    transform: translateY(1px);
    box-shadow: 0 1px 3px rgba(122, 107, 172, 0.1);
  }
`;

const ActiveIndicator = styled(motion.div)`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
  background: var(--primary-color);
  border-radius: 30px;
  z-index: -1;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const ProductCard = styled.div`
  background: white;
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: var(--shadow);
  transition: transform 0.5s ease, box-shadow 0.5s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(31, 29, 62, 0.15);
  }
`;

const ProductImage = styled.div`
  height: 200px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
  
  ${ProductCard}:hover & img {
    transform: scale(1.05);
  }
`;

const ProductInfo = styled.div`
  padding: 1.5rem;
`;

const ProductName = styled.h3`
  margin-bottom: 0.5rem;
`;

const ProductCategory = styled.span`
  display: inline-block;
  background: var(--tertiary-color);
  color: var(--primary-color);
  padding: 0.3rem 0.7rem;
  border-radius: 20px;
  font-size: 0.8rem;
  text-transform: capitalize;
  margin-bottom: 1rem;
`;

const ProductDescription = styled.p`
  color: var(--text-light);
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
`;

const ProductPrice = styled.div`
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--text-dark);
  margin-bottom: 1rem;
`;

const AddToCartButton = styled.button`
  width: 100%;
  background: var(--gradient-primary);
  color: white;
  border: none;
  padding: 0.8rem;
  border-radius: var(--border-radius);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(31, 29, 62, 0.2);
    
    &::after {
      opacity: 1;
    }
  }
  
  &:active {
    transform: translateY(1px);
    box-shadow: 0 2px 6px rgba(31, 29, 62, 0.1);
  }
`;

const CartIcon = styled.div`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  z-index: 100;
  cursor: pointer;
`;

const CartCount = styled.div`
  position: absolute;
  top: -8px;
  right: -8px;
  background: #1C4473; /* Changed to the requested blue color */
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: bold;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  border: 2px solid white;
`;

const CartPanel = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 400px;
  max-width: 100%;
  height: 100%;
  background: white;
  box-shadow: -5px 0 20px rgba(0, 0, 0, 0.1);
  z-index: 101;
  display: flex;
  flex-direction: column;
  
  @media (max-width: 480px) {
    width: 100%;
  }
`;

const CartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
  
  h3 {
    margin: 0;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--text-dark);
  cursor: pointer;
`;

const EmptyCart = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--text-light);
  
  p {
    margin-top: 1rem;
  }
`;

const CartItems = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
`;

const CartItem = styled.div`
  display: flex;
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #eee;
`;

const CartItemImage = styled.div`
  width: 80px;
  height: 80px;
  border-radius: var(--border-radius);
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const CartItemInfo = styled.div`
  flex: 1;
  padding-left: 1rem;
`;

const CartItemName = styled.h4`
  margin: 0 0 0.5rem;
`;

const CartItemPrice = styled.div`
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const CartItemControls = styled.div`
  display: flex;
  align-items: center;
`;

const QuantityButton = styled.button`
  width: 30px;
  height: 30px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  
  &:disabled {
    opacity: 0.5;
  }
`;

const ItemQuantity = styled.span`
  padding: 0 1rem;
`;

const RemoveButton = styled.button`
  border: none;
  background: none;
  color: #999;
  margin-left: auto;
  transition: all 0.3s ease;
  position: relative;
  padding: 3px 5px;
  
  &::after {
    content: '';
    position: absolute;
    width: 0;
    height: 1px;
    bottom: 0;
    left: 0;
    background-color: #f44336;
    transition: width 0.3s ease;
  }
  
  &:hover {
    color: #f44336;
    
    &::after {
      width: 100%;
    }
  }
`;

const CartFooter = styled.div`
  padding: 1.5rem;
  border-top: 1px solid #eee;
`;

const TotalContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
`;

const TotalAmount = styled.span`
  font-weight: 700;
  font-size: 1.3rem;
`;

const CheckoutButton = styled.button`
  width: 100%;
  background: var(--primary-color);
  color: white;
  border: none;
  padding: 1rem;
  border-radius: var(--border-radius);
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.7s ease;
  }
  
  &:hover {
    background: var(--lavender);
    box-shadow: 0 5px 15px rgba(31, 29, 62, 0.2);
    
    &::before {
      left: 100%;
    }
  }
  
  &:active {
    transform: translateY(1px);
    box-shadow: 0 2px 5px rgba(31, 29, 62, 0.1);
  }
`;

export default Shop;
