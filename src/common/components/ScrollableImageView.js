import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ImageBackground, Image, FlatList } from 'react-native';
import { dimensionUtils } from '../utils';
import { useTheme, Modal } from '@ui-kitten/components';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
const { convertHeight, convertWidth } = dimensionUtils;

const ScrollableImageView = (props) => {
    const data = [props.source];
    const [showModalVisibility, toggleModalVisibility] = useState(false);
    const [url, setUrl] = useState('');
    const theme = useTheme();
    const styles = StyleSheet.create({
        imageContain: {
            height: convertHeight(80),
            width: convertWidth(70),
            borderRadius: convertWidth(2),
        },
        closeBtn: {
            position: 'absolute', right: convertWidth(10)
        }
    });

    const renderImage = ({ item }) => {
        return (
            <View style={{ flexDirection: 'row', paddingHorizontal: convertWidth(5) }}  >
                <TouchableOpacity onPress={() => { setUrl(item); toggleModalVisibility(true); }}>
                    <Image style={styles.imageContain}
                        source={{ uri: `data:image/gif;base64,${item}` }}
                    />
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <>
            <FlatList
                contentContainerStyle={{ flexDirection: "row", justifyContent: 'space-between' }}
                showsHorizontalScrollIndicator={false}
                horizontal={true}
                data={data}
                keyExtractor={(item, index) => index.toString()}
                renderItem={(item) => renderImage(item)}
            />
            <Modal backdropStyle={{ backgroundColor: theme['background-drop-shadow-color-default'] }} onBackdropPress={() => toggleModalVisibility(false)} visible={showModalVisibility}>
                <View style={{ height: convertHeight(450), width: convertWidth(300) }}>
                    <ImageBackground style={{ height: convertHeight(450), width: convertWidth(300) }}
                        source={{ uri: `data:image/gif;base64,${url}` }}
                    >
                        <View style={{ flex: 1, width: convertWidth(300), top: convertWidth(10) }}>
                            <TouchableOpacity onPress={() => toggleModalVisibility(false)}
                                style={styles.closeBtn}>
                                <MaterialCommunityIcons name="close" color={theme['color-basic-100']} size={convertHeight(20)} />
                            </TouchableOpacity>
                        </View>
                    </ImageBackground>
                </View>
            </Modal>
        </>
    );
};

export default ScrollableImageView;
