import React from 'react';
import { View, Text, FlatList, Button, Platform, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Item, HeaderButtons } from 'react-navigation-header-buttons';

import ProductItem from '../../components/shop/ProductItem';
import HeaderButton from '../../components/UI/HeaderButton';
import Colors from '../../constants/Colors';
import * as ProductsActions from '../../store/actions/product';

const UserProductScreen = props => {
    const userProducts = useSelector(state => state.products.userProducts);

    const dispatch = useDispatch();

    const editProductHandler = (id) => {
        props.navigation.navigate('EditProduct', {productId: id});
    };

    const deleteHandler = (id) => {
        Alert.alert('Siguru sei?', 'Cazz avveru ni voi gavà chistha gosa?', [
            { text: 'No cazz', style: 'default' },
            { text: 'Eja cazz', style: 'destructive', onPress:() => {
                dispatch(ProductsActions.deleteProduct(id));
            } }
        ])
    };

    if (userProducts.length === 0) {
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text>Nessun Prodotto trovato, aggiungine qualcuno!</Text>
            </View>
        );
    }

    return(
        <FlatList 
            data={userProducts} 
            keyExtractor={item => item.id} 
            renderItem={itemData => 
                            <ProductItem
                                image={itemData.item.imageUrl}
                                title={itemData.item.title}
                                price={itemData.item.price}
                                onSelect={() => {
                                    editProductHandler(itemData.item.id);
                                } }>
                                    <Button 
                                        color={Colors.primary} 
                                        title='Modifica' 
                                        onPress={() => {
                                            editProductHandler(itemData.item.id);
                                            //deleteHandler.bind('this', itemData.item.id);
                                        }} />
                                    <Button 
                                        color={Colors.primary} 
                                        title='Cancella'
                                        onPress={() => {
                                            deleteHandler(itemData.item.id);
                                        }} />
                                </ProductItem>
                            } />
    );
};

UserProductScreen.navigationOptions = navData => {
    return {
        headerTitle: 'I tuoi prodotti',
        headerLeft: (<HeaderButtons HeaderButtonComponent={HeaderButton}>
                            <Item 
                                title="Menu" 
                                iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu' }  
                                onPress={() => {
                                    navData.navigation.toggleDrawer();
                                }} />
                        </HeaderButtons>),
        headerRight: (<HeaderButtons HeaderButtonComponent={HeaderButton}>
                            <Item 
                                title="Aggiungi" 
                                iconName={Platform.OS === 'android' ? 'md-create' : 'ios-create' }  
                                onPress={() => {
                                    navData.navigation.navigate('EditProduct');
                                }} />
                        </HeaderButtons>)
    };
}

export default UserProductScreen;