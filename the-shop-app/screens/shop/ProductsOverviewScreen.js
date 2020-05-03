import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, Button, Platform, ActivityIndicator, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Item, HeaderButtons } from 'react-navigation-header-buttons';

import ProductItem from '../../components/shop/ProductItem';
import * as cartActions from '../../store/actions/cart';
import * as productsActions from '../../store/actions/product';
import HeaderButton from '../../components/UI/HeaderButton';
import Colors from '../../constants/Colors';

const ProductsOverviewScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [isResfreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState();
    const products = useSelector(state => state.products.availableProducts);
    const dispatch = useDispatch();

    const loadProducts = useCallback(async () => {
        setError(null);
        setIsRefreshing(true);
        try {
            await dispatch(productsActions.fetchProducts());
        } catch (err) {
            setError(err.message);
        }
        setIsRefreshing(false);
    }, [dispatch, setIsLoading, setError]);

    useEffect(() => {
        const willFocusSub = props.navigation.addListener('willFocus', loadProducts);

        return () => {
            willFocusSub.remove();
        };
    }, [loadProducts]);


    useEffect(() => {
        setIsLoading(true);
        loadProducts().then(() => {
            setIsLoading(false);
        });
    }, [dispatch, loadProducts]);

    const selectItemHandler = (id, title) => {
        props.navigation.navigate('ProductDetail', {
            productId: id,
            productTitle: title
        });
    };

    if (error) {
        return ( <View style={styles.centered}>
            <Text>C'è un error!</Text>
            <Button title="Prova a riprovare" onPress={loadProducts} color={Colors.primary} />
        </View> )
    }

    if (isLoading) {
        return ( <View style={styles.centered}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                </View> )
    }

    if (!isLoading && products.length === 0) {
        return ( <View style={styles.centered}>
                    <Text>Nessun prodotto trovato. prova ad aggiungerne qualcuno.</Text>
                </View> )
    }

    return <FlatList 
                onRefresh={loadProducts}
                refreshing={isResfreshing}
                data={products} 
                keyExtractor={item => item.id} 
                renderItem={itemData => 
                                <ProductItem
                                    image={itemData.item.imageUrl} 
                                    title={itemData.item.title}
                                    price={itemData.item.price}
                                    onSelect={() => {
                                        selectItemHandler(itemData.item.id, itemData.item.title);
                                    }}>
                                    <Button 
                                        color={Colors.primary} 
                                        title='Vedi i dettagli' 
                                        onPress={() => {
                                            selectItemHandler(itemData.item.id, itemData.item.title);
                                        }} />
                                    <Button 
                                        color={Colors.primary} 
                                        title='Nel carrello'
                                        onPress={() => {
                                            dispatch(cartActions.addToCart(itemData.item));
                                        }} />
                                </ProductItem>} 
                                />};

ProductsOverviewScreen.navigationOptions = navData => {
    return {
        headerTitle: 'Tutti i prodotti',
        headerLeft: <HeaderButtons HeaderButtonComponent={HeaderButton}>
                        <Item 
                            title="Menu" 
                            iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu' }  
                            onPress={() => {
                                navData.navigation.toggleDrawer();
                            }} />
                    </HeaderButtons>,
        headerRight: <HeaderButtons HeaderButtonComponent={HeaderButton}>
                    <Item 
                        title="Cart" 
                        iconName={Platform.OS === 'android' ? 'md-cart' : 'ios-cart' }  
                        onPress={() => {
                            navData.navigation.navigate('Cart');
                        }} />
                 </HeaderButtons>
        };
    };
    

    const styles = StyleSheet.create({
        centered: {flex: 1, justifyContent: 'center', alignItems: 'center'}
    });

export default ProductsOverviewScreen;