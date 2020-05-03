import React, { useState, useEffect, useCallback, useReducer } from 'react';
import { ScrollView, View, StyleSheet, Platform, Alert, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import { Item, HeaderButtons } from 'react-navigation-header-buttons';
import { useSelector, useDispatch } from 'react-redux';

import HeaderButton from '../../components/UI/HeaderButton';
import * as productsActions from '../../store/actions/product';
import Input from '../../components/UI/Input';
import Colors from '../../constants/Colors';

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';
const formReducer = (state, action) => {
    if (action.type === FORM_INPUT_UPDATE) {
        const updatedValues = {
            ...state.inputValues,
            [action.input]: action.value
        };
        const updateValidities = {
            ...state.inputValidities,
            [action.input]: action.isValid
        }
        let updatedFormIsValid = true;
        for (const key in updateValidities) {
            updatedFormIsValid = updatedFormIsValid && updateValidities[key];
        }
        return {
            formIsValid: updatedFormIsValid,
            inputValues: updatedValues,
            inputValidities: updateValidities
        };
    }
    return state;
};

const EditProductScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    const prodId = props.navigation.getParam('productId');
    const editedProduct = useSelector(state => 
        state.products.userProducts.find(prod => prod.id === prodId)
        );

    const dispatch = useDispatch();

    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
            title: editedProduct ? editedProduct.title : '',
            imageUrl: editedProduct ? editedProduct.imageUrl : '',
            description: editedProduct ? editedProduct.description : '',
            price: ''
        }, 
        inputValidities: {
            title: editedProduct ? true : false,
            imageUrl: editedProduct ? true : false,
            description: editedProduct ? true : false,
            title: editedProduct ? true : false,
        }, 
        formIsValid: editedProduct ? true : false
    })

   // const [title, setTitle] = useState(editedProduct ? editedProduct.title : '');
   // const [titleIsValid, setTitleIsValid] = useState(false);
   // const [imageUrl, setImageUrl] = useState(editedProduct ? editedProduct.imageUrl : '');
   // const [price, setPrice] = useState('');
   // const [description, setDescription] = useState(editedProduct ? editedProduct.description : '');

   useEffect(() => {
    if (error) {
        Alert.alert('Erroraccio!', error, [{text: 'Okay fra'}])
    }
   }, [error])

    const submitHandler = useCallback(async () => {
        if (!formState.formIsValid) {
            Alert.alert('Dato non valido', 'Controlla meglio il dato inserito',[ { text: 'Okay'}
        ]);
            return;
        }
        setError(null);
        setIsLoading(true);
        try {
            if (editedProduct) {
                await dispatch(productsActions.updateProduct(
                    prodId, 
                    formState.inputValues.title, 
                    formState.inputValues.description, 
                    formState.inputValues.imageUrl
                    ));
            } else {
                await dispatch(productsActions.createProduct(
                    formState.inputValues.title, 
                    formState.inputValues.description, 
                    formState.inputValues.imageUrl, 
                    +formState.inputValues.price
                    ))
            }
            props.navigation.goBack();
        } catch (err) {
            setError(err.message);
        }

        setIsLoading(false);
        
    }, [dispatch, prodId, formState]);

    useEffect(() => {
        props.navigation.setParams({ submit: submitHandler });
    }, [submitHandler]);

    const inputChangeHandler = useCallback((inputIdentifier, inputValue, inputValidity) => {
        dispatchFormState({
            type: FORM_INPUT_UPDATE, 
            value: inputValue, 
            isValid: inputValidity,
            input: inputIdentifier
        });
       // setTitle(text);
    }, [dispatchFormState]);

    if (isLoading) {
        return <View style={styles.centered}><ActivityIndicator size='large' color={Colors.primary} /></View>
    }

    return(
        <KeyboardAvoidingView style={{flex: 1}} behavior='padding' keyboardVerticalOffset={100}>
        <ScrollView>
            <View style={styles.form}>
                <Input
                    id='title'
                    label='Titolo'
                    errorText='Inserisci un titolo valido'
                    keyboardType='default' 
                    autoCapitalize='sentences' 
                    autoCorrect 
                    returnKeyType='next'
                    onInputChange={inputChangeHandler}
                    initialValue={editedProduct ? editedProduct.title : ''}
                    initiallyValid={!!editedProduct}
                    required />
                    
                <Input
                    id='imageUrl'
                    label='Foto'
                    errorText='Inserisci un indirizzo immagine valido'
                    keyboardType='default'  
                    returnKeyType='next'
                    onInputChange={inputChangeHandler}
                    initialValue={editedProduct ? editedProduct.imageUrl : ''}
                    initiallyValid={!!editedProduct}
                    required  />

                {editedProduct ? null : (
                    <Input
                        id='price'
                        label='Prezzo'
                        errorText='Inserisci un prezzo valido'
                        keyboardType='decimal-pad'
                        returnKeyType='next'
                        onInputChange={inputChangeHandler}
                        required
                        min={0.1} />)}
                        
                <Input
                    id='description'
                    label='Descrizione'
                    errorText='Inserisci una descrizione valida'
                    keyboardType='default' 
                    autoCapitalize='sentences' 
                    autoCorrect 
                    multiline
                    numberOfLines={3}
                    onInputChange={inputChangeHandler}
                    initialValue={editedProduct ? editedProduct.description : ''}
                    initiallyValid={!!editedProduct}
                    required
                    minLength={5}  />
            </View>
        </ScrollView>
        </KeyboardAvoidingView>
    );
};


EditProductScreen.navigationOptions = navData => {
    const submitFunct = navData.navigation.getParam('submit');
    return {
        headerTitle: navData.navigation.getParam('productId') ? 'Modifica' : 'Aggiungi',
        headerRight: (<HeaderButtons HeaderButtonComponent={HeaderButton}>
                            <Item 
                                title="Aggiungi" 
                                iconName={Platform.OS === 'android' ? 'md-checkmark' : 'ios-checkmark' }  
                                onPress={submitFunct} />
                        </HeaderButtons>)
    };
};

const styles = StyleSheet.create({
    form: {
        margin: 20,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
    
});

export default EditProductScreen;