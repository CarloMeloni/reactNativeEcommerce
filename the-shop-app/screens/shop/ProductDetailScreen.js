import React from 'react';
import { ScrollView, Text, View, Button, StyleSheet, Image } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import * as cartActions from '../../store/actions/cart';
import Colors from '../../constants/Colors';

const ProductDetailScreen = props => {
    const productId = props.navigation.getParam('productId');
    const selectedProduct = useSelector(state => 
            state.products.availableProducts.find(prod => 
                    prod.id === productId)
                    );
    const dispatch = useDispatch();

    return (
        <ScrollView>
            <Image style={styles.image} source={{uri: selectedProduct.imageUrl}} />
            <View style={styles.buttonContainer}>
                <Button color={Colors.primary} 
                        title='Aggiungi al carrello' 
                        onPress={() => {
                            dispatch(cartActions.addToCart(selectedProduct));
                        }} />
            </View>
            <Text style={styles.price}>${selectedProduct.price.toFixed(2)}</Text>
            <Text style={styles.description}>{selectedProduct.description}</Text>
        </ScrollView>
    );
};

ProductDetailScreen.navigationOptions = navData => {
    return{
        headerTitle: navData.navigation.getParam('productTitle')
    };
};

const styles = StyleSheet.create({
    image: {
        width: '100%',
        height: 300
    },
    buttonContainer: {
        marginVertical: 10,
        alignItems: 'center'
    },
    price: {
        fontFamily: 'open-sans-bold',
        fontSize: 18,
        color: '#888',
        textAlign: 'center',
        marginVertical: 18
    },
    description: {
        fontFamily: 'open-sans-bold',
        fontSize: 12,
        textAlign: 'center',
        marginHorizontal: 18
    }
});

export default ProductDetailScreen;